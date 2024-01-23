class adminViewer {
  // Table body where tr with data about review will be stored
  _dataContainer = document.querySelector('.admin-cms-table-body');
  // wrapper around the table
  _wholeSection = document.querySelector('.cms-content');
  // pagination inside CMS and udnerneath the table
  _pagination = document.querySelector('.pagination');
  // SORTING BY
  _sortDropDown = document.querySelector('.drop-down');

  // AUTHOR AKA USER
  _searchInputField = document.querySelector('.search-input-field-admin');
  _searchBtn = document.querySelector('.search-btn-admin');

  // SHOW ALL
  _showAllBtn = document.querySelector('.show-all-btn-admin');

  //PAGINATION
  _prevBtn = document.querySelector('.prev-page');
  _nextBtn = document.querySelector('.next-page');
  _currentPage = document.querySelector('.update-cur-page');

  // META DATA
  _pagesTotal = +document
    .querySelector('.pagination')
    ?.getAttribute('data-pages-total');

  // ---------- METHODS ------------------

  // INIT STUFF
  anyDocs() {
    return this._wholeSection;
  }

  revealPagesTotal(action) {
    action(this._pagesTotal);
  }

  // EVENTS
  addSortByEvent(action) {
    this._sortDropDown?.addEventListener('change', (e) => {
      const index = this._sortDropDown.selectedIndex;
      const sortBy = this._sortDropDown[index].value;
      action(sortBy);
    });
  }

  addNextPageEvent(action) {
    this._nextBtn?.addEventListener('click', action);
  }

  addPrevPageEvent(action) {
    this._prevBtn?.addEventListener('click', action);
  }

  addSearchEvent(action) {
    this._searchBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      action(this._searchInputField.value);
    });
  }

  addShowAllBtnEvent(action) {
    this._showAllBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this._searchInputField.value = '';
      action();
    });
  }

  addDeleteBtnsEvent(action) {
    const btns = document.querySelectorAll('.delete-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        // want to pass the button to the function to know exactly which btn out of many delets was called
        // need to update pug reveiws too
        action(e.target.closest('button').getAttribute('data-doc-id'));
      });
    });
  }

  // RENDERING
  noReviewsFoundHTML() {
    return `
          <div class="admin-no-comment">
            <p class="no-comment-message">
              <ion-icon name="close-circle-outline"></ion-icon>
              <span class="no-message-text">No reviews found</span>
            </p>
          </div>
          `;
  }

  // render still required
  renderCheck() {
    // first check: if no table(no reviews in DB) -> do not do anything -> keep the current warning message 'no-reveiws'
    if (!this._wholeSection) return;
    if (data.length === 0) {
      this._dataContainer.innerHTML = '';
    }
  }

  hidePrevBtn() {
    this._prevBtn?.classList.add('hidden');
  }

  hideNextBtn() {
    this._nextBtn?.classList.add('hidden');
  }

  showPrevBtn() {
    this._prevBtn?.classList.remove('hidden');
  }

  showNextBtn() {
    this._nextBtn?.classList.remove('hidden');
  }

  updateCurrentPage(num) {
    if (this._currentPage) this._currentPage.textContent = num;
  }

  hidePagination() {
    this._pagination?.classList.add('hidden');
  }

  showPagination() {
    this._pagination?.classList.remove('hidden');
  }
}
export default adminViewer;
