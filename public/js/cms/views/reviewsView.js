class adminReviewsViewer {
  #dataContainer = document.querySelector('.reviews-table-body');
  #wholeSection = document.querySelector('.reviews-table');
  // SORTING BY
  #sortDropDown = document.querySelector('.drop-down');
  #searchByBtn = document.querySelector('.search-review-btn');
  #searchByField = document.querySelector('.search-review-field');

  // AUTHOR AKA USER
  #usernameInputField = document.querySelector('.search-review-field');
  #searchByUserBtn = document.querySelector('.search-review-btn');

  // SHOW ALL
  #showAllBtn = document.querySelector('.show-all-reviews-btn');

  //PAGINATION
  #prevBtn = document.querySelector('.prev-page');
  #nextBtn = document.querySelector('.next-page');
  #currentPage = document.querySelector('.update-cur-page');

  // META DATA
  #pagesTotal = +document
    .querySelector('.pagination')
    ?.getAttribute('data-pages-total');

  // ---------- METHODS ------------------

  // INIT STUFF
  revealPagesTotal(action) {
    action(this.#pagesTotal);
  }

  // EVENTS
  addSortByEvent(action) {
    this.#sortDropDown.addEventListener('change', (e) => {
      const index = this.#sortDropDown.selectedIndex;
      const sortBy = this.#sortDropDown[index].value;
      action(sortBy);
    });
  }

  addNextPageEvent(action) {
    this.#nextBtn?.addEventListener('click', action);
  }

  addPrevPageEvent(action) {
    this.#prevBtn?.addEventListener('click', action);
  }

  addSearchByUserEvent(action) {
    this.#searchByUserBtn.addEventListener('click', (e) => {
      e.preventDefault();
      action(this.#usernameInputField.value);
    });
  }

  // RENDERING
  #singleDataElementHTML(review) {
    return `
            <tr>
                <td class="review-author-table">
                  <a class="user-link" href="/users/${review.user.username}">${
      review.user.username
    }</a>
                </td>
                <td class="review-comment-table">
                  ${review.comment}
                </td>
                <td class="review-title-table">${review.anime.title}</td>
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
                  <a class="edit-btn" href="/edit/${review.anime.slug}">
                    <ion-icon
                      class="table-icon edit-icon"
                      name="create-outline"
                    ></ion-icon>
                  </a>
                  <span class="delimiter"> / </span>
                  <button class="delete-btn" data-review-id=@${review._id}">
                    <ion-icon
                      class="table-icon delete-icon"
                      name="trash-outline"
                    ></ion-icon>
                  </button>
                </td>
              </tr>
          `;
  }

  #noReviewsFoundHTML() {
    return `
          <div class="no-comment admin-no-comment">
            <p class="no-comment-message">
              <ion-icon name="close-circle-outline"></ion-icon>
              <span class="no-message-text">Currently you have left no reviews.</span>
            </p>
          </div>
          `;
  }

  render(data) {
    // first check: if no table(no reviews in DB) -> do not do anything -> keep the current warning message 'no-reveiws'
    if (!this.#wholeSection) return;
    if (data.length === 0) {
      return (this.#wholeSection.innerHTML = this.#noReviewsFoundHTML());
    }
    const html = data
      .map((dataElement) => {
        return this.#singleDataElementHTML(dataElement);
      })
      .join('');
    this.#dataContainer.innerHTML = html;
  }

  hidePrevBtn() {
    this.#prevBtn?.classList.add('hidden');
  }

  hideNextBtn() {
    this.#nextBtn?.classList.add('hidden');
  }

  showPrevBtn() {
    this.#prevBtn?.classList.remove('hidden');
  }

  showNextBtn() {
    this.#nextBtn?.classList.remove('hidden');
  }

  updateCurrentPage(num) {
    if (this.#currentPage) this.#currentPage.textContent = num;
  }
}

const createClass = () => {
  if (window.location.pathname.startsWith('/admin/reviews')) {
    return new adminReviewsViewer();
  }
};

export default createClass();
