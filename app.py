from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DB_PATH = "movies_trends.sqlite"

def query_db(query, args=()):
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query(query, conn, params=args)
    conn.close()

    # ✅ Manual clean: convert NaN or NaT to None
    clean_records = []
    for row in df.to_dict(orient="records"):
        cleaned = {
            k: (None if pd.isna(v) else v)
            for k, v in row.items()
        }
        clean_records.append(cleaned)
    return clean_records

@app.route("/")
def home():
    return (
        "Available Routes:<br>"
        "/api/movies<br>"
        "/api/movies/&lt;title&gt;<br>"
        "/api/trends/&lt;title&gt;<br>"
    )

@app.route("/api/movies")
def get_movies():
    return jsonify(query_db("SELECT * FROM cleaned_merged_movies ORDER BY title"))

@app.route("/api/movies/<title>")
def get_movie(title):
    query = """
        SELECT * FROM cleaned_merged_movies
        WHERE LOWER(TRIM(title)) = LOWER(TRIM(?))
    """
    return jsonify(query_db(query, [title]))

@app.route("/api/trends/<title>")
def get_trends(title):
    query = """
        SELECT t.date, t.trend
        FROM movies_trends AS t
        JOIN cleaned_merged_movies AS m
        ON LOWER(TRIM(t.movie_title)) = LOWER(TRIM(m.title))
        WHERE LOWER(TRIM(t.movie_title)) = LOWER(TRIM(?))
        ORDER BY t.date
    """
    return jsonify(query_db(query, [title]))

if __name__ == "__main__":
    app.run(debug=True)

