import pandas as pd
import sqlite3
from pathlib import Path

database_path = "movies_trends.sqlite"

Path(database_path).touch()

conn = sqlite3.connect(database_path)

c = conn.cursor()

c.execute(''' CREATE TABLE movies_trends ( date, movie_title, trend)''')
csv_movies_trends = pd.read_csv("movie_trends.csv")
csv_movies_trends.to_sql("movies_trends", conn, if_exists='append', index=False)

c.execute(''' CREATE TABLE  cleaned_merged_movies ( title, director, cast, rating, duration_minutes, description, year, imdb_rating, imdb_votes)''')
csv_cleaned_merged_movies = pd.read_csv("cleaned_merged_movies.csv")
csv_cleaned_merged_movies.to_sql("cleaned_merged_movies", conn, if_exists='append', index=False)

# Close the connection
conn.close()