import AdminViewer from './baseView.js';

class adminAnimesViewer extends AdminViewer {
  // RENDERING
  #singleAnimeHTML(anime) {
    let ratingHtmlString;
    if (anime.reviewsTotal > 0) {
      ratingHtmlString = `<ion-icon class="ani-rate-admin-icon" name="star"></ion-icon> <span class="admin-num-rate">${anime.rating
        .toString()
        .slice(0, 3)}</span>`;
    } else {
      ratingHtmlString = `<span class="no-rating-span">Not rated yet</span>`;
    }
    return `
        <tr>
          <td class="anime-title-table">${anime.title}</td>
          <td class="anime-released-table">${anime.releaseYear}</td>
          <td class="anime-reviews-table">${anime.reviewsTotal}</td>
          <td class="anime-rating-table">${ratingHtmlString}</td>
          <td class="anime-released-table">${anime.addedAt
            .toString()
            .slice(0, 21)}</td>
          <td class="anime-age-table">${anime.ageAdvice}</td>
          <td class="anime-duration-table">${anime.duration}</td>
          <td class="review-action-table">
              <a class="view-btn" href="/anime/${anime.slug}">
                  <ion-icon class="table-icon edit-icon" name="eye-outline"></ion-icon>
              </a>
              <span class="delimiter">/</span>
              <a class="edit-btn" href="/admin/animes/edit/${anime._id}">
                  <ion-icon class="table-icon edit-icon" name="create-outline"></ion-icon>
              </a>
              <span class="delimiter">/</span>
              <button class="delete-btn" data-doc-id="${anime._id}">
                  <ion-icon class="table-icon delete-icon" name="trash-outline"></ion-icon>
              </button>
          </td>
        </tr>
        `;
  }

  render(animes) {
    // first check: if no table(no reviews in DB) -> do not do anything -> keep the current warning message 'no-reveiws'
    if (!this._wholeSection) return;
    if (animes.length === 0) {
      this._dataContainer.innerHTML = '';
    }
    const html = animes
      .map((anime) => {
        return this.#singleAnimeHTML(anime);
      })
      .join('');
    this._dataContainer.innerHTML = html;
  }
}

const createClass = () => {
  if (window.location.pathname.startsWith('/admin/animes')) {
    return new adminAnimesViewer();
  }
};

export default createClass();
