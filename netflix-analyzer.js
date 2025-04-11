document.addEventListener('DOMContentLoaded', function () {
    const movieDropdown = document.getElementById('movie-dropdown');
    const yearSelect = document.getElementById('year-select');
    const searchButton = document.getElementById('search-btn');
    const movieDescription = document.getElementById('movie-description');
    const movieRating = document.getElementById('movie-rating');
    const csvFileInput = document.getElementById('csv-file');

    let csvData = [];

    // CSV File Upload Handler
    csvFileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    csvData = results.data;
                    console.log("Parsed CSV:", csvData.slice(0, 3)); // Preview
                    populateMovieDropdown();
                    alert("CSV uploaded successfully!");
                },
                error: function (err) {
                    console.error("CSV parse error:", err);
                }
            });
        }
    });

    // Populate movie dropdown with movies from 2021–2023
    function populateMovieDropdown() {
        const years = ['2021', '2022', '2023'];
        const filtered = csvData.filter(row => years.includes(String(row.release_year)));
        const uniqueTitles = [...new Set(filtered.map(row => row.title).filter(Boolean))];

        movieDropdown.innerHTML = '<option value="">Select a movie...</option>';
        uniqueTitles.forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.textContent = title;
            movieDropdown.appendChild(option);
        });
    }

    // Movie Search Handler
    searchButton.addEventListener('click', function () {
        const selectedMovie = movieDropdown.value;
        const selectedYear = parseInt(yearSelect.value);

        if (!selectedMovie) {
            movieDescription.textContent = 'Please select a movie.';
            movieRating.textContent = '';
            return;
        }

        const found = csvData.find(row =>
            row.title === selectedMovie && row.release_year === selectedYear
        );

        if (found) {
            movieDescription.textContent = `Description: ${found.description || 'N/A'}`;
            movieRating.textContent = `IMDb Rating: ${found.imdb_rating || 'N/A'}`;
            plotSearchTrend(found);
            plotRatingComparison(csvData.filter(row => row.release_year === selectedYear));
        } else {
            movieDescription.textContent = 'Movie not found for that year.';
            movieRating.textContent = '';
        }
    });

    // Line Graph
    function plotSearchTrend(movie) {
        const interest = typeof movie.search_interest === 'string'
            ? movie.search_interest.split(',').map(Number)
            : [movie.search_interest];

        const trace = {
            x: Array.from({ length: interest.length }, (_, i) => `Month ${i + 1}`),
            y: interest,
            type: 'scatter',
            mode: 'lines+markers',
            name: movie.title
        };

        Plotly.newPlot('line-graph', [trace], { title: `Search Trend: ${movie.title}` });
    }

    // Scatter Plot
    function plotRatingComparison(data) {
        const ratings = data.map(row => row.imdb_rating);
        const interest = data.map(row => parseFloat(row.search_interest?.split(',')?.[0] || 0));

        const trace = {
            x: ratings,
            y: interest,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 10, color: 'darkred' },
            name: 'Movies'
        };

        Plotly.newPlot('scatter-plot', [trace], {
            title: 'IMDb Rating vs Initial Search Interest',
            xaxis: { title: 'IMDb Rating' },
            yaxis: { title: 'Search Interest (Month 1)' }
        });
    }
});
