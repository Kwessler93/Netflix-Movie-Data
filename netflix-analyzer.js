// Updated Netflix Analyzer with movie_trends.json integration

// Load movie trend data from JSON
let movieTrendData = {};
fetch("movie_trends.json")
  .then((response) => response.json())
  .then((data) => {
    movieTrendData = data;
    console.log("Loaded trend data");
  })
  .catch((err) => console.error("Error loading trend JSON", err));

// Main functionality

const movieDropdown = document.getElementById("movie-dropdown");
const yearSelect = document.getElementById("year-select");
const searchButton = document.getElementById("search-btn");
const movieDescription = document.getElementById("movie-description");
const movieRating = document.getElementById("movie-rating");
const csvFileInput = document.getElementById("csv-file");

let csvData = [];

// CSV Upload
csvFileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        csvData = results.data;
        console.log("Parsed CSV:", csvData.slice(0, 3));
        populateMovieDropdown();
        alert("CSV uploaded successfully!");
      },
      error: function (err) {
        console.error("CSV parse error:", err);
      },
    });
  }
});

// Populate dropdown
function populateMovieDropdown() {
  const years = ["2021", "2022", "2023"];
  const filtered = csvData.filter((row) => years.includes(String(row.release_year)));
  const uniqueTitles = [...new Set(filtered.map((row) => row.title).filter(Boolean))];

  movieDropdown.innerHTML = '<option value="">Select a movie...</option>';
  uniqueTitles.forEach((title) => {
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    movieDropdown.appendChild(option);
  });
}

// Handle Search Click
searchButton.addEventListener("click", function () {
  const selectedMovie = movieDropdown.value;
  const selectedYear = parseInt(yearSelect.value);

  if (!selectedMovie) {
    movieDescription.textContent = "Please select a movie.";
    movieRating.textContent = "";
    return;
  }

  const found = csvData.find(
    (row) => row.title === selectedMovie && row.release_year === selectedYear
  );

  if (found) {
    movieDescription.textContent = `Description: ${found.description || "N/A"}`;
    movieRating.textContent = `IMDb Rating: ${found.imdb_rating || "N/A"}`;
    plotSearchTrend(selectedMovie);
  } else {
    movieDescription.textContent = "Movie not found for that year.";
    movieRating.textContent = "";
  }
});

// Plot trend from JSON
function plotSearchTrend(movieTitle) {
  const trendArray = movieTrendData[movieTitle];

  if (!trendArray) {
    Plotly.newPlot("line-graph", [], {
      title: `No trend data found for: ${movieTitle}`,
    });
    return;
  }

  const filteredData = trendArray.filter((d) => {
    const year = new Date(d.date).getFullYear();
    return year >= 2021 && year <= 2023;
  });

  const dates = filteredData.map((d) => d.date);
  const trends = filteredData.map((d) => d.trend);

  const trace = {
    x: dates,
    y: trends,
    type: "scatter",
    mode: "lines+markers",
    name: movieTitle,
  };

  Plotly.newPlot("line-graph", [trace], {
    title: `Search Trends for ${movieTitle} (2021–2023)`,
    xaxis: { title: "Date" },
    yaxis: { title: "Trend Score" },
  });
}

