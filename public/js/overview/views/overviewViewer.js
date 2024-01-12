const createClass = () => {
  if (window.location.pathname.startsWith('/overview')) {
    class OverviewViewer {
      #sortMenuNode = document.querySelector('.drop-down');
      #animeCardsContainer = document.querySelector('.anime-cards');
      #spinnerContainer = document.querySelector('.end-of');
      #totalPagesNum = document
        .querySelector('.overview-layout')
        .getAttribute('data-pages-total');

      #spinnerHTML() {
        return `
          <div class="d-flex justify-content-center">
            <span class="loader"></span>
          </div>`;
      }

      #iconHTML() {
        return `<ion-icon name="chevron-down-outline"></ion-icon>`;
      }

      #getCard(card) {
        return `<figure class="anime-card">${this.#getInsideFigure(
          card
        )}</figure>`;
      }

      #getInsideFigure(card) {
        const genres = card.genres
          .map((genre) => {
            return `<a
          href="/genres/${genre.toLowerCase().split(' ').join('-')}"
          class="genre blue-under-link"
          data-genre="${genre.toLowerCase()}"
          >${genre}</a>`;
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
        return `<img class="anime-card-img"
                  src="img/anime/${card.imageCover}"
                  alt="${card.title} image"
            />
            <div class="card-info">
              <a href="/anime/${card.slug}" class="card-title">${card.title}</a>
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
                  <div class="last-line">
                    <span class="added-at">
                      Added on
                      <span class="added-date">${card.addedAt
                        .toString()
                        .slice(0, 21)}</span>
                    </span>
                    <a class="read-more blue-under-link" href="/anime/${
                      card.slug
                    }">Read more...</a>
                  </div>
                </div>`;
      }

      renderSpinner(anime, currentPage) {
        this.#spinnerContainer.innerHTML = this.#spinnerHTML();
      }

      hideSpinner() {
        this.#spinnerContainer.classList.add('hidden');
      }

      revealSpiner() {
        this.#spinnerContainer.classList.remove('hidden');
      }

      revealData(updateState) {
        updateState(this.#sortMenuNode, this.#totalPagesNum);
      }

      attachSortEvent(doSorting) {
        this.#sortMenuNode.addEventListener('change', function (e) {
          doSorting();
        });
      }

      render(animes) {
        const cards = animes
          .map((anime) => {
            return this.#getCard(anime);
          })
          .join('');
        this.#animeCardsContainer.innerHTML = cards;
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
          this.#animeCardsContainer.append(fig);
        });
      }

      attachInfScrollEvent(observerForEnd) {
        observerForEnd(this.#spinnerContainer);
      }
    }

    return new OverviewViewer();
  }
};

export default createClass();
