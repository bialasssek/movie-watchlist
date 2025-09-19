const watchlistEl = document.querySelector(".watchlist");
const savedWatchlistMovies = JSON.parse(
	localStorage.getItem("watchlist") || "[]"
);

if (!savedWatchlistMovies.length) {
	watchlistEl.innerHTML = `<div class="start-exploring">
        <h3 class="start-h3">Your watchlist is looking a little empty ...</h3>
        <a href="index.html" class="watchlist-flexing">
            <img src="/images/add.svg" alt="add icon" class="watchlist-btn2" />
            Let's add some movies!
        </a>
    </div>`;
} else {
	watchlistEl.innerHTML = `<div class="start-exploring">
        <h3 class="start-h3">Preparing your watchlist movies ...</h3>
        
    </div>`;
	Promise.all(
		savedWatchlistMovies.map((id) =>
			fetch(`https://www.omdbapi.com/?i=${id}&apikey=dd2f5d37`).then((res) =>
				res.json()
			)
		)
	).then((movies) => {
		let html = "";
		movies.forEach((movie) => {
			const movieGenre = movie.Genre || "N/A";
			const moviePlot = movie.Plot || "No plot available.";
			const movieLength = movie.Runtime || "N/A";
			const movieRating = movie.imdbRating || "N/A";

			html += `<div class="movie" >
                <img
                    src="${movie.Poster}"
                    alt="${movie.Title} poster"
                    class="movie-poster"
                />
                <div class="movie-flex">
                    <div class="movie-title-flex">
                        <h3 class="movie-title">${movie.Title}</h3>
                        <img src="/images/star.svg" alt="star icon" class="star-icon" />
                        <p class="movie-score">${movieRating}</p>
                    </div>
                    <div class="movie-info-flex">
                        <p class="movie-length">${movieLength}</p>
                        <p class="movie-category">${movieGenre}</p>
                        
                    </div>
                    <p class="movie-description">
                        ${moviePlot}
                    </p>
                </div>
            </div>`;
		});
		watchlistEl.innerHTML = html;
	});
}
