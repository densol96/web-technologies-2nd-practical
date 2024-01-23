import BaseView from './baseView.js';

class adminReviewsViewer extends BaseView {
  // RENDERING
  #singleReviewHTML(review) {
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
                  <button class="delete-btn" data-doc-id="${review._id}">
                    <ion-icon
                      class="table-icon delete-icon"
                      name="trash-outline"
                    ></ion-icon>
                  </button>
                </td>
              </tr>
          `;
  }

  render(reviews) {
    // first check: if no table(no reviews in DB) -> do not do anything -> keep the current warning message 'no-reveiws'
    if (!this._wholeSection) return;
    if (reviews.length === 0) {
      this._dataContainer.innerHTML = '';
    }
    const html = reviews
      .map((review) => {
        return this.#singleReviewHTML(review);
      })
      .join('');
    this._dataContainer.innerHTML = html;
  }
}

const createClass = () => {
  if (window.location.pathname.startsWith('/admin/reviews')) {
    return new adminReviewsViewer();
  }
};

export default createClass();
