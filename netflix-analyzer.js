// Updated Netflix Analyzer with movie_trends.json integration and vote/trend comparison chart (auto-load CSV, no year dropdown, includes loading spinner, loads 'Aftermath' by default)

let movieTrendData = {};
fetch("movie_trends.json")
  .then((response) => response.json())
  .then((data) => {
    movieTrendData = data;
    console.log("Loaded trend data");
  })
  .catch((err) => console.error("Error loading trend JSON", err));

const movieDropdown = document.getElementById("movie-dropdown");
const searchButton = document.getElementById("search-btn");
const movieDescription = document.getElementById("movie-description");
const movieRating = document.getElementById("movie-rating");
const spinner = document.getElementById("loading-spinner");

let csvData = [];

// Show loading spinner
spinner.style.display = "block";

fetch("cleaned_merged_movies.csv")
  .then((response) => response.text())
  .then((csvText) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        csvData = results.data;
        console.log("Auto-loaded CSV:", csvData.slice(0, 3));
        populateMovieDropdown();
        spinner.style.display = "none";
        autoLoadDefaultMovie("Aftermath");
      },
      error: function (err) {
        console.error("CSV parse error:", err);
        spinner.style.display = "none";
      },
    });
  });

function populateMovieDropdown() {
  const uniqueTitles = [...new Set(csvData.map((row) => row.title).filter(Boolean))];

  movieDropdown.innerHTML = '<option value="">Select a movie...</option>';
  uniqueTitles.forEach((title) => {
    const option = document.createElement("option");
    option.value = title;
    option.textContent = title;
    movieDropdown.appendChild(option);
  });
}

function autoLoadDefaultMovie(title) {
  movieDropdown.value = title;
  displayMovieInfo(title);
}

searchButton.addEventListener("click", function () {
  const selectedMovie = movieDropdown.value;
  displayMovieInfo(selectedMovie);
});

function displayMovieInfo(selectedMovie) {
  if (!selectedMovie) {
    movieDescription.textContent = "Please select a movie.";
    movieRating.textContent = "";
    return;
  }

  const found = csvData.find((row) => row.title === selectedMovie);

  if (found) {
    movieDescription.innerHTML = `
      <strong>Description:</strong> ${found.description || "N/A"}<br/>
      <strong>Rating:</strong> ${found.rating || "N/A"}<br/>
      <strong>IMDb Rating:</strong> ${found.imdb_rating || "N/A"}<br/>
      <strong>IMDb Votes:</strong> ${found.imdb_votes || "N/A"}<br/>
      <strong>Director:</strong> ${found.director || "N/A"}<br/>
      <strong>Cast:</strong> ${found.cast || "N/A"}<br/>
      <strong>Duration:</strong> ${found.duration_minutes || "N/A"} minutes
    `;

    movieRating.textContent = "";
    plotSearchTrend(selectedMovie);
    plotTrendVsVotes(selectedMovie, found.imdb_votes);
  } else {
    movieDescription.textContent = "Movie not found.";
    movieRating.textContent = "";
  }
}

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

function plotTrendVsVotes(movieTitle, votes) {
  const trendArray = movieTrendData[movieTitle];
  if (!trendArray || !votes) return;

  const dates = trendArray.map((d) => d.date);
  const trends = trendArray.map((d) => d.trend);
  const votesArray = new Array(trends.length).fill(votes);

  const trace1 = {
    x: dates,
    y: trends,
    type: "bar",
    name: "Trend Score",
  };

  const trace2 = {
    x: dates,
    y: votesArray,
    type: "scatter",
    mode: "lines",
    name: "IMDb Votes",
    yaxis: "y2"
  };

  const layout = {
    title: `Trend vs. Votes for ${movieTitle}`,
    xaxis: { title: "Date" },
    yaxis: { title: "Trend Score" },
    yaxis2: {
      title: "IMDb Votes",
      overlaying: "y",
      side: "right"
    }
  };

  const vizDiv = document.createElement("div");
  vizDiv.style.width = "90%";
  vizDiv.style.height = "400px";
  vizDiv.style.marginTop = "20px";
  document.getElementById("visualizations").appendChild(vizDiv);
  Plotly.newPlot(vizDiv, [trace1, trace2], layout);
}