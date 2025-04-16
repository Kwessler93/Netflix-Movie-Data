const API_BASE = "http://127.0.0.1:5000";

const dropdown = document.getElementById("movie-dropdown");
const descriptionBox = document.getElementById("movie-description");
const searchBtn = document.getElementById("search-btn");

function fetchMovies() {
  fetch(`${API_BASE}/api/movies`)
    .then(res => res.json())
    .then(data => {
      data.forEach(movie => {
        const option = document.createElement("option");
        option.value = movie.title;
        option.textContent = movie.title;
        dropdown.appendChild(option);
      });
      dropdown.value = "Aftermath";
      showMovieInfo("Aftermath");
    });
}

function showMovieInfo(title) {
  fetch(`${API_BASE}/api/movies/${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(([movie]) => {
      if (!movie) {
        descriptionBox.innerHTML = "Movie not found.";
        return;
      }

      const safe = field => field ?? "Not Available";

      descriptionBox.innerHTML = `
        <strong>Description:</strong> ${safe(movie.description)}<br/>
        <strong>Rating:</strong> ${safe(movie.rating)}<br/>
        <strong>IMDb Rating:</strong> ${safe(movie.imdb_rating)}<br/>
        <strong>IMDb Votes:</strong> ${safe(movie.imdb_votes)}<br/>
        <strong>Director:</strong> ${safe(movie.director)}<br/>
        <strong>Cast:</strong> ${safe(movie.cast)}<br/>
        <strong>Duration:</strong> ${safe(movie.duration_minutes)} minutes
      `;

      plotTrends(title);
      plotTrendVsVotes(title, movie.imdb_votes);
    });
}

function plotTrends(title) {
  fetch(`${API_BASE}/api/trends/${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        Plotly.newPlot("line-graph", [], {
          title: `No trend data for ${title}`,
        });
        return;
      }

      const dates = data.map(d => new Date(d.date));
      const trends = data.map(d => d.trend);

      const trace = {
        x: dates,
        y: trends,
        mode: "lines+markers",
        name: title
      };

      Plotly.newPlot("line-graph", [trace], {
        title: `Search Trends for ${title}`,
        xaxis: { title: "Date", type: "date" },
        yaxis: { title: "Trend Score" }
      });
    });
}

function plotTrendVsVotes(title, votes) {
  fetch(`${API_BASE}/api/trends/${encodeURIComponent(title)}`)
    .then(res => res.json())
    .then(data => {
      const barGraphDiv = document.getElementById("bar-graph");

      // Clear the chart if no data or no votes
      if (!data.length || !votes) {
        Plotly.purge(barGraphDiv);  // Fully clears any existing chart
        Plotly.newPlot(barGraphDiv, [], {
          title: `No trend data for ${title}`,
        });
        return;
      }

      const dates = data.map(d => new Date(d.date));
      const trends = data.map(d => d.trend);
      const votesLine = new Array(trends.length).fill(votes);

      const trace1 = { x: dates, y: trends, type: "bar", name: "Trend" };
      const trace2 = {
        x: dates,
        y: votesLine,
        type: "scatter",
        mode: "lines",
        name: "IMDb Votes",
        yaxis: "y2"
      };

      Plotly.newPlot(barGraphDiv, [trace1, trace2], {
        title: `Trend vs IMDb Votes for ${title}`,
        xaxis: { title: "Date", type: "date" },
        yaxis: { title: "Trend Score" },
        yaxis2: {
          title: "IMDb Votes",
          overlaying: "y",
          side: "right"
        },
        legend: {
          x: 1.05,
          y: 1,
          xanchor: "left",
          yanchor: "top"
        }
      });      
    });
}

searchBtn.onclick = () => showMovieInfo(dropdown.value);
fetchMovies();

