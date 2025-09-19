document.querySelector("form").addEventListener("submit", searchMovies);
const watchlistEl = document.querySelector(".watchlist");

function searchMovies(e) {
	watchlistEl.innerHTML = `
    <div class="start-exploring">
		<h3 class="start-h3">Searching for movies ...</h3>
	</div>
    `;
	e.preventDefault();
	const searchValue = document.querySelector("#searchMovie").value.trim();
	if (!searchValue) return;

	fetch(`https://www.omdbapi.com/?apikey=dd2f5d37&s=${searchValue}`)
		.then((res) => {
			if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
			return res.json();
		})
		.then((data) => {
			if (data.Response === "False") {
				watchlistEl.innerHTML = `<div class="start-exploring">
					<h3 class="start-h3">Unable to find what you’re looking for.<br/> Please try another search.</h3>
				</div>`;
				return;
			}
			return Promise.all(
				data.Search.map((movie) =>
					fetch(
						`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=dd2f5d37`
					).then((res) => res.json())
				)
			);
		})
		.then((detailedMovies) => renderMovies(detailedMovies));
}

function renderMovies(detailedMovies) {
	let html = "";
	detailedMovies.forEach((movie) => {
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
                            <div class="watchlist-btn-flex">
                                <img
                                    src="/images/add.svg"
                                    alt="add icon"
                                    class="watchlist-btn"
                                    data-id="${movie.imdbID}"
                                />
                                <h5 class="watchlist-btn-text">Watchlist</h5>
                            </div>
                        </div>
                        <p class="movie-description">
                            ${moviePlot}
                        </p>
                    </div>
                </div>`;
	});
	watchlistEl.innerHTML = html;
}

let watchlistMovies = [];
document.querySelector("body").addEventListener("click", (e) => {
	if (e.target.classList.contains("watchlist-btn")) {
		const movieId = e.target.dataset.id;
		if (!watchlistMovies.includes(movieId)) {
			watchlistMovies.push(movieId);
			const textEl = e.target.nextElementSibling;
			e.target.classList.add("hidden");
			if (textEl) textEl.textContent = "Added";
		}
	}

	if (e.target.classList.contains("watchlist-link")) {
		if (watchlistMovies.length > 0) {
			localStorage.setItem("watchlist", JSON.stringify(watchlistMovies));
		}
	}
});
