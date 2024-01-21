class adminReviewsViewer {
  // Table body where tr with data about review will be stored
  #dataContainer = document.querySelector('.reviews-table-body');
  // wrapper around the function
  #wholeSection = document.querySelector('.cms-content');
  // pagination inside CMS and udnerneath the table
  #pagination = document.querySelector('.pagination');
  // SORTING BY
  #sortDropDown = document.querySelector('.drop-down');

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
  anyReviews() {
    return this.#wholeSection;
  }

  revealPagesTotal(action) {
    action(this.#pagesTotal);
  }

  // EVENTS
  addSortByEvent(action) {
    this.#sortDropDown?.addEventListener('change', (e) => {
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
    this.#searchByUserBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      action(this.#usernameInputField.value);
    });
  }

  addShowAllBtnEvent(action) {
    this.#showAllBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.#usernameInputField.value = '';
      action();
    });
  }

  addDeleteBtnsEvent(action) {
    const btns = document.querySelectorAll('.delete-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // want to pass the button to the function to know exactly which btn out of many delets was called
        action(e.target.closest('button').getAttribute('data-review-id'));
      });
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
                <td class="review-title-table">
                  <a href="/anime/${
                    review.anime.slug
                  }" class="anime-link cms-link" target="_blank">
                    ${review.anime.title}
                  </a>
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
                <td class="review-approved-table">
                  <ion-icon
                      class="table-icon checked-icon"
                      name="${
                        review.checked
                          ? 'chevron-down-circle-outline'
                          : 'close-circle-outline'
                      }"
                    ></ion-icon>
                </td>
                <td class="review-action-table">
                  <a class="edit-btn" href="/admin/reviews/edit/${review._id}">
                    <ion-icon
                      class="table-icon edit-icon"
                      name="create-outline"
                    ></ion-icon>
                  </a>
                  <span class="delimiter"> / </span>
                  <button class="delete-btn" data-review-id="${review._id}">
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
              <span class="no-message-text">No reviews found</span>
            </p>
          </div>
          `;
  }

  render(data) {
    // first check: if no table(no reviews in DB) -> do not do anything -> keep the current warning message 'no-reveiws'
    if (!this.#wholeSection) return;
    if (data.length === 0) {
      this.#dataContainer.innerHTML = '';
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

  hidePagination() {
    this.#pagination?.classList.add('hidden');
  }

  showPagination() {
    this.#pagination?.classList.remove('hidden');
  }
}

const createClass = () => {
  if (window.location.pathname.startsWith('/admin/reviews')) {
    return new adminReviewsViewer();
  }
};

export default createClass();
