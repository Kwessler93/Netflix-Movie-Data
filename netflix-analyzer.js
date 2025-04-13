// Netflix Analyzer updated: fix duplicate charts, ensure proper date parsing, and show clean trend data

const movieDropdown = document.getElementById("movie-dropdown");
const searchButton = document.getElementById("search-btn");
const movieDescription = document.getElementById("movie-description");
const movieRating = document.getElementById("movie-rating");
const spinner = document.getElementById("loading-spinner");

let csvData = [];
let trendData = [];

spinner.style.display = "block";

Promise.all([
  fetch("cleaned_merged_movies.csv").then((res) => res.text()),
  fetch("movie_trends.csv").then((res) => res.text())
])
.then(([moviesCSV, trendsCSV]) => {
  Papa.parse(moviesCSV, {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
      csvData = results.data.map(row => ({
        ...row,
        title: row.title ? row.title.trim() : ""
      }));
      populateMovieDropdown();
      autoLoadDefaultMovie("Aftermath");
    }
  });

  Papa.parse(trendsCSV, {
    header: false,
    delimiter: ";",
    skipEmptyLines: true,
    complete: function (results) {
      console.log("Raw trend CSV data:", results.data.slice(0, 20));
      trendData = results.data
        .filter(row => row.length === 3)
        .map(([date, movie_title, trend]) => {
          const parsedDate = new Date(date);
          if (isNaN(parsedDate)) {
            console.warn("Invalid date format:", date);
          }
          return {
            movie_title: movie_title.trim(),
            date: parsedDate,
            trend: parseInt(trend)
          };
        });
      spinner.style.display = "none";
    }
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

  const found = csvData.find((row) => row.title.toLowerCase() === selectedMovie.trim().toLowerCase());

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
  const visualContainer = document.getElementById("visualizations");
  visualContainer.innerHTML = ""; // Clear previous content

  const chartRow = document.createElement("div");
  chartRow.style.display = "flex";
  chartRow.style.justifyContent = "space-around";
  chartRow.style.flexWrap = "wrap";
  chartRow.style.width = "100%";
  chartRow.style.alignItems = "stretch";
  chartRow.style.gap = "20px";

  const lineGraph = document.createElement("div");
  lineGraph.id = "line-graph";
  lineGraph.style.width = "45%";
  lineGraph.style.height = "400px";
  lineGraph.style.minWidth = "400px";
  lineGraph.style.flexGrow = "1";

  const barGraph = document.createElement("div");
  barGraph.id = "bar-graph";
  barGraph.style.width = "45%";
  barGraph.style.height = "400px";
  barGraph.style.minWidth = "400px";
  barGraph.style.flexGrow = "1";

  chartRow.appendChild(lineGraph);
  chartRow.appendChild(barGraph);
  visualContainer.appendChild(chartRow);

  const filtered = trendData.filter((row) =>
    row.movie_title.toLowerCase() === movieTitle.trim().toLowerCase()
  );
  console.log("Filtered trend data for", movieTitle, filtered);

  if (!filtered.length) {
    Plotly.newPlot("line-graph", [], {
      title: `No trend data found for: ${movieTitle}`,
    });
    return;
  }

  const dates = filtered.map((row) => row.date);
  const trends = filtered.map((row) => row.trend);

  const trace = {
    x: dates,
    y: trends,
    type: "scatter",
    mode: "lines+markers",
    name: movieTitle,
  };

  Plotly.newPlot("line-graph", [trace], {
    title: `Search Trends for ${movieTitle} (2021–2023)`,
    xaxis: { title: "Date", type: "date" },
    yaxis: { title: "Trend Score" },
  });
}

function plotTrendVsVotes(movieTitle, votes) {
  const filtered = trendData.filter((row) =>
    row.movie_title.toLowerCase() === movieTitle.trim().toLowerCase()
  );
  if (!filtered.length) {
    console.warn("No trend data for votes chart:", movieTitle);
    return;
  }
  if (!votes) {
    console.warn("No vote data for:", movieTitle);
    return;
  }

  const dates = filtered.map((row) => row.date);
  const trends = filtered.map((row) => row.trend);
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
    xaxis: { title: "Date", type: "date" },
    yaxis: { title: "Trend Score" },
    yaxis2: {
      title: "IMDb Votes",
      overlaying: "y",
      side: "right"
    }
  };

  Plotly.newPlot("bar-graph", [trace1, trace2], layout);
}
