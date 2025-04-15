# Netflix/Streaming Trends Analyzer

## 📊 Project Overview
This project explores Netflix and streaming movie trends by combining metadata, IMDb ratings, and Google search interest over time. Our goal was to create an interactive dashboard that allows users to select a movie and view:
- A description and IMDb metadata
- A line chart of search interest from 2021 to 2025
- A bar chart comparing trend scores to IMDb vote counts

We used data visualization to tell a clear, engaging story about how public interest in movies correlates with viewer ratings and popularity.

---

## ⚙️ Project Components

### Data Collection & Cleaning
We used three primary datasets:
- We used a Kaggle dataset with Netflix movie metadata to get a dataset of metadata for movies released in 2021 and create the file, `Netflix files.csv`.
- We then used OMDBI API data to pull in the the imdb ratings and number of votes for the movies in the dataset to create the `omdb_movie_data.csv`. This code requires an API Key saved in an file called `api_keys.py`.
- We then cleaned and merged the Netlix metadata and OMDB API data to create the `cleaned_merged_movies.csv` which includes Metadata including title, director, cast, ratings, duration, and IMDb info.
- We then used pytrends to pull in the google search trend data for each of the movies and created the `movie_trends.csv` file which includes Google Trends data over time for each movie title. This code takes several hours to run due to the large amount of data it pulls in.

Cleaning steps included:
- Removing records with missing or malformed values.
- Converting types (e.g., strings to numeric).
- Merging data by movie title.

### Database
We created an SQLite database (`movies_trends.sqlite`) with two tables:
- `cleaned_merged_movies`
- `movies_trends`

The `create_movie_data_sqlite.py` script handles database generation from the CSV files.

### Flask API
The `app.py` file runs a Flask server exposing API endpoints:
- `/api/movies`: Returns a list of all movie metadata.
- `/api/movies/<title>`: Returns metadata for a selected movie.
- `/api/trends/<title>`: Returns trend data over time for that movie.

### Front-End Interface
- `index.html` and `netflix-analyzer.js` create a lightweight interactive dashboard.
- Users can select a movie from a dropdown, view its details, and generate interactive Plotly.js charts.

---

## 📈 Visualizations
The dashboard includes three distinct visualizations:
1. **Movie Description Panel** (text-based metadata)
2. **Line Graph** of Google search interest over time
3. **Bar + Line Combo Chart** comparing trend score vs IMDb votes

These charts allow intuitive exploration of how viewer interest aligns with ratings data.

---

## 🤖 Technology Stack
- **Python Libraries**: Flask, Pandas, SQLite3, PyTrends (external, not taught in class)
- **JavaScript Libraries**: Plotly.js
- **Database**: SQLite
- **Frontend**: HTML/CSS, vanilla JavaScript

---

## 🗭 Ethical Considerations
Throughout the project, we prioritized ethical data practices by:
- Using only public datasets (OMDb API and Google Trends).
- Avoiding personally identifiable information.
- Handling missing values and edge cases carefully.
- Ensuring fair representation across all movies by processing all titles uniformly.
- Avoiding misleading visuals by clearly labeling all axes and units.

---

## 📘 References
- [OMDb API](https://www.omdbapi.com/) — for movie metadata 
- [Google Trends](https://trends.google.com/) via PyTrends — for google search data
- [Kaggle Netflix Dataset](https://www.kaggle.com/datasets/shivamb/netflix-shows) — for initial Netflix movie data
- [Plotly.js](https://plotly.com/javascript/) — for interactive charting
- [Milligram CSS](https://milligram.io/) — for minimal UI styling

---

## 🚀 How to Use the Project

To run the full application locally (backend + frontend):

1. **Clone the repository** and navigate to the project directory.

2. **Run the Flask API backend** to serve movie metadata and trend data:

   ```bash
   python app.py
   ```

3. **Start a local server** to host the frontend files:

   ```bash
   # From the directory where index.html is located
   python -m http.server
   ```

4. **Open your browser** and go to:

   ```
   http://localhost:8000/index.html
   ```

5. **Use the dropdown menu** to select a movie and view:
   - Description and metadata
   - A line chart of Google Trends data (2021–2025)
   - A bar + line graph comparing trend scores to IMDb votes

> 💡 Note: Ensure both the Flask backend and the local server are running simultaneously for full functionality.


