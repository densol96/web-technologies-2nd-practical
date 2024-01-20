class meReviewsViewer {
  #tableBody = document.querySelector('.reviews-table-body');
  #prevPageBtn = document.querySelector('.prev-page');
  #nextPageBtn = document.querySelector('.next-page');

  // DATA FOT STATE
  #curUsername = document
    .querySelector('.me-layout')
    ?.getAttribute('data-user-username');
  #pagesTotal = document
    .querySelector('.pagination')
    ?.getAttribute('data-pages-total');
  #currentPage = document.querySelector('.update-cur-page');

  revealState(action) {
    action(this.#curUsername, +this.#pagesTotal);
  }

  initBtnsEventsListeners(nextPageAction, prevPageAction) {
    if (this.#nextPageBtn) {
      this.#nextPageBtn.addEventListener('click', nextPageAction);
    }
    if (this.#prevPageBtn) {
      this.#prevPageBtn.addEventListener('click', prevPageAction);
    }
  }

  #singleReviewHTML(review) {
    return `
            <tr>
                <td class="review-title-table">
                  <a class="cms-link" href="/anime/${review.anime.slug}">
                    ${review.anime.title}
                  </a>
                </td>
                <td class="review-comment-table">
                  ${review.comment}
                </td>
                <td class="review-rating-table">
                  <p class="rev-rate">
                    ${[1, 2, 3, 4, 5]
                      .map((val) => {
                        return val <= review.rating
                          ? '<ion-icon class="rev-icon" name="star"></ion-icon>'
                          : '<ion-icon class="rev-icon" name="star-outline"></ion-icon>';
                      })
                      .join('')}
                  </p>
                </td>
                <td class="review-date-table">${review.addedAt
                  .toString()
                  .slice(0, 21)}</td>
                <td class="review-action-table">
                  <a class="edit-btn" href="/edit/${review._id}">
                    <ion-icon
                      class="table-icon edit-icon"
                      name="create-outline"
                    ></ion-icon>
                  </a>
                  <span class="delimiter"> / </span>
                  <button class="delete-btn" data-review-id=${review._id}>
                    <ion-icon
                      class="table-icon delete-icon"
                      name="trash-outline"
                    ></ion-icon>
                  </button>
                </td>
              </tr>
            `;
  }

  deleteBtnEvents(action) {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        action(e.target.closest('button').getAttribute('data-review-id'));
      });
    });
  }

  render(reviews) {
    const html = reviews
      .map((review) => {
        return this.#singleReviewHTML(review);
      })
      .join('');
    this.#tableBody.innerHTML = html;
  }

  hideNextBtn() {
    this.#nextPageBtn.classList.add('hidden');
  }

  hidePrevBtn() {
    this.#prevPageBtn.classList.add('hidden');
  }

  showNextBtn() {
    this.#nextPageBtn.classList.remove('hidden');
  }

  showPrevBtn() {
    this.#prevPageBtn.classList.remove('hidden');
  }

  updateCurrentPage(currentCounter) {
    this.#currentPage.innerText = `${currentCounter}`;
  }
}

const createClass = () => {
  if (window.location.pathname.startsWith('/me/reviews')) {
    return new meReviewsViewer();
  }
};

export default createClass();
