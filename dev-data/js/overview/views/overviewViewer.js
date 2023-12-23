class AnimeView {
  // Pagination
  #prevPage = document.querySelector('.prev-page');
  #nextPage = document.querySelector('.next-page');
  #sortBy = document.querySelector('.drop-down');
  #parentContainer = document.querySelector('.anime-cards');
  #pagination = document.querySelector('.pagination');
  #curPage = document.querySelector('.update-cur-page');
  // Infinite scroll
  #endOf = document.querySelector('.end-of');
  #total = document
    .querySelector('.overview-layout')
    .getAttribute('data-pages-total');

  updateState(action) {
    action(this.#sortBy, +this.#total);
  }

  addEventListeners(prev, next, change) {
    this.#prevPage.addEventListener('click', function (e) {
      prev();
    });
    this.#nextPage.addEventListener('click', function (e) {
      next();
    });
    this.#sortBy.addEventListener('change', function (e) {
      change();
    });
  }

  #applySpinner() {
    return `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>`;
  }

  #returnIcon() {
    return `<ion-icon name="chevron-down-outline"></ion-icon>`;
  }

  render(animes, currentPage) {
    this.#parentContainer.innerHTML = this.#applySpinner();

    const allCards = animes.map((anime) => this.#getOneCard(anime)).join('');
    this.#parentContainer.innerHTML = allCards;
    this.#updatePagination(currentPage);
  }

  renderOnScroll(animes) {
    const newCards = animes.map((anime) => {
      const figureInsideHTML = this.#getInsideFigure(anime);
      const fig = document.createElement('figure');
      fig.classList.add('anime-card');
      fig.innerHTML = figureInsideHTML;
      return fig;
    });
    newCards.forEach((fig) => {
      this.#parentContainer.append(fig);
    });
  }

  renderSpinner(anime, currentPage) {
    this.#endOf.innerHTML = this.#applySpinner();
  }

  hideSpinner() {
    this.#endOf.classList.add('hidden');
  }

  #updatePagination(page) {
    this.#curPage.innerText = page;
    if (page == +this.#pagination.getAttribute('data-pages-total')) {
      this.#nextPage.classList.add('hidden');
    } else {
      this.#nextPage.classList.remove('hidden');
    }
    if (page === 1) {
      this.#prevPage.classList.add('hidden');
    } else {
      this.#prevPage.classList.remove('hidden');
    }
  }

  #getInsideFigure(card) {
    const genres = card.genres
      .map((genre) => {
        return `<span
          href="/${genre.toLowerCase().split(' ').join('-')}"
          class="genre blue-under-link"
          data-genre="${genre.toLowerCase()}"
          >${genre}</span>`;
      })
      .join(', ');
    let rating = '';
    if (card.rating) {
      rating = `<span class="card-delimeter"> / </span>
                  <span class="card-rating"
                    ><ion-icon
                      class="card-rating-icon"
                      name="star"
                    ></ion-icon>
                    <span class="card-rate-num">${card.rating}</span></span
                  >`;
    }
    return `<img
                  class="anime-card-img"
                  src="img/anime/${card.imageCover}"
                  alt="${card.title} image"
                />

                <div class="card-info">
                  <a href="#" class="card-title"
                    >${card.title}</a
                  >
                  <span class="card-japanese">${card.japaneseTitle}</span>
                  <div class="card-facts">
                    <span class="card-release-year">${card.releaseYear}</span>
                    <span class="card-delimeter"> / </span>
                    <p class="cards-genres">
                      ${genres}
                    </p>
                    ${rating}                   
                    <span class="card-delimeter"> / </span>
                    <span class="card-reviews"> Reviews: ${
                      card.reviews.length
                    }</span>
                  </div>

                  <p class="card-description">
                    ${
                      card.summary.length < 270
                        ? card.summary
                        : card.summary.slice(0, 270)
                    };
                  </p>
                  <a class="read-more blue-under-link" href="#">Read more...</a>
                </div>`;
  }

  #getOneCard(card) {
    const genres = card.genres
      .map((genre) => {
        return `<span
          href="/${genre.toLowerCase().split(' ').join('-')}"
          class="genre blue-under-link"
          data-genre="${genre.toLowerCase()}"
          >${genre}</span>`;
      })
      .join(', ');
    let rating = '';
    if (card.rating) {
      rating = `<span class="card-delimeter"> / </span>
                  <span class="card-rating"
                    ><ion-icon
                      class="card-rating-icon"
                      name="star"
                    ></ion-icon>
                    <span class="card-rate-num">${card.rating}</span></span
                  >`;
    }
    return `<figure class="anime-card">
                <img
                  class="anime-card-img"
                  src="img/anime/${card.imageCover}"
                  alt="${card.title} image"
                />

                <div class="card-info">
                  <a href="#" class="card-title"
                    >${card.title}</a
                  >
                  <span class="card-japanese">${card.japaneseTitle}</span>
                  <div class="card-facts">
                    <span class="card-release-year">${card.releaseYear}</span>
                    <span class="card-delimeter"> / </span>
                    <p class="cards-genres">
                      ${genres}
                    </p>
                    ${rating}                   
                    <span class="card-delimeter"> / </span>
                    <span class="card-reviews"> Reviews: ${
                      card.reviews.length
                    }</span>
                  </div>

                  <p class="card-description">
                    ${
                      card.summary.length < 270
                        ? card.summary
                        : card.summary.slice(0, 270)
                    };
                  </p>
                  <a class="read-more blue-under-link" href="#">Read more...</a>
                </div>
              </figure>`;
  }
  // Implementing infinite scroll
  attachInfScrollEvent(action) {
    action(this.#endOf);
  }
}

export default new AnimeView();
