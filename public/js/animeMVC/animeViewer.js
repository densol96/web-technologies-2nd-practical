class AnimeViewer {
  // Summary
  #showMoreBtn = document.querySelector('.show-more');
  #summary = document.querySelector('.summary');
  #icons = document.querySelectorAll('.show-icon');
  #summaryContainer = document.querySelector('.summary');
  // Review
  #ratingStars = document.querySelectorAll('.rate-icons-star');
  #postReviewBtn = document.querySelector('.send-comment');
  #postForm = document.querySelector('.leave-review');
  #comment = document.querySelector('#comment');
  //Other reviews
  #allComments = document.querySelector('.all-comments');
  #loadMoreBtn = document.querySelector('.load-more-comments');
  #animeId = document
    .querySelector('.anime-layout')
    .getAttribute('data-anime-id');
  #pagesTotal = this.#allComments.getAttribute('data-pages-total');

  // Handle SUMMARY section of the page
  #hideCheck() {
    this.#summary.classList.add('open-sum');
    this.#showMoreBtn.classList.add('hidden');
  }

  // API TO CONTROLLER - 1
  initSummaryListener() {
    if (!(this.#summary.scrollHeight > this.#summary.clientHeight)) {
      return this.#hideCheck();
    }
    this.#showMoreBtn.addEventListener('click', (e) => {
      this.#summary.classList.toggle('open-sum');
      this.#icons.forEach((icon) => {
        icon.classList.toggle('hidden-icon');
      });
    });
  }

  // HANDLE PRETTY STARS EFFECT
  #fillStars(upTo) {
    this.#ratingStars.forEach((star) => {
      if (+star.getAttribute('data-value') <= upTo) {
        star.setAttribute('name', 'star');
      }
    });
  }

  #unfillStars = function () {
    this.#ratingStars.forEach((star) => {
      star.setAttribute('name', 'star-outline');
    });
  };

  // STARS-PRETTY EFFECT
  #initMouseOverStars() {
    this.#ratingStars.forEach((star) => {
      star.addEventListener('mouseover', (e) => {
        const activeStar = document.querySelector('.active');
        if (!activeStar) {
          const upToVal = +e.target.getAttribute('data-value');
          this.#fillStars(upToVal);
        }
      });
    });
  }

  #initMouseOutStars() {
    this.#ratingStars.forEach((star) => {
      star.addEventListener('mouseout', (e) => {
        const activeStar = document.querySelector('.active');
        if (!activeStar) {
          this.#unfillStars();
        }
      });
    });
  }

  #initClickStars() {
    this.#ratingStars.forEach((star) => {
      star.addEventListener('click', (e) => {
        const prevActive = document.querySelector('.active');
        if (prevActive === e.target) {
          prevActive.classList.remove('active');
          this.#unfillStars();
          return;
        }
        if (prevActive) {
          prevActive.classList.remove('active');
        }
        this.#unfillStars();
        const chosenStar = e.target;
        const upTo = +e.target.getAttribute('data-value');
        this.#fillStars(upTo);
        chosenStar.classList.add('active');
      });
    });
  }

  // API TO CONTROLLER -2
  initStarsListeners() {
    this.#initMouseOverStars();
    this.#initMouseOutStars();
    this.#initClickStars();
  }

  // post Review Event
  initPostReview(action) {
    if (!this.#postForm) return;
    this.#postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = document
        .querySelector('.rate-icons-star.active')
        ?.getAttribute('data-value');
      const commentText = this.#comment.value;
      action(this.#comment.value, +rating);
    });
  }

  // LOAD MORE COMMENTS FUNCTIONALITY REQUIRED UI METHODS
  revealState(action) {
    action(this.#animeId, +this.#pagesTotal);
  }

  initLoadCommsListener(action) {
    this.#loadMoreBtn.addEventListener('click', (e) => {
      action(this.#animeId);
    });
  }

  hideBtn() {
    this.#loadMoreBtn.classList.add('hidden');
  }

  #singleCommentHTML(comment) {
    return `
      <figure class="single-comment">
        <div class="img-container-comment">
          <img
            class="profile-pic-comment"
            src="/img/users/${comment.user.avatar}"
            alt="Profile picture"
          />
        </div>
        <div class="comment-message">
          <p class="comment-rate">
            ${[1, 2, 3, 4, 5]
              .map((el) => {
                return `<ion-icon class="rev-icon" name="${
                  el <= comment.rating ? 'star' : 'star-outline'
                }"></ion-icon>`;
              })
              .join('')}
          </p>
          <p class="text-comment">
            ${comment.comment}
          </p>
          <div class="posted-by-general">
            <span class="posted-by">Posted by</span>
            <a href="#" class="blue-under-link">${comment.user.username}</a>
            <span class="posted-by">at</span>
            <span class="posted-by-date">${comment.createdAt
              .toString()
              .slice(0, 21)}</span>
          </div>
        </div>
      </figure>
      `;
  }

  render(reviews) {
    const allComsHTML = reviews
      .map((review) => {
        return this.#singleCommentHTML(review);
      })
      .join('');

    this.#allComments.insertAdjacentHTML('beforeend', allComsHTML);
  }
}

const createClass = function () {
  if (window.location.pathname.startsWith('/anime')) {
    return new AnimeViewer();
  }
};

export default createClass();
