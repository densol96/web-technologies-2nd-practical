// NAVIGATION
const navBtn = document.querySelector('.btn-mobile-nav');
const navMenu = document.querySelector('.nav-menu');

navBtn.addEventListener('click', function (e) {
  navMenu.classList.toggle('open');
});

// SHOW SUMMARY ON AN ANIME PAGE
const showMoreBtn = document.querySelector('.show-more');
const summary = document.querySelector('.summary');
const icons = document.querySelectorAll('.show-icon');
const buttonDiv = document.querySelector('.center-button');

showMoreBtn.addEventListener('click', function (e) {
  summary.classList.toggle('open-sum');
  icons.forEach((icon) => {
    icon.classList.toggle('hidden-icon');
  });
});

// CHECK IF IT ACTUALLY OVERFLOWS, CAUSE IF NOT - NO NEED FOR SHOW BUTTON
if (!(summary.scrollHeight > summary.clientHeight)) {
  summary.classList.add('open-sum');
  buttonDiv.style.display = 'none';
}

// LEAVE A COOL STAR RATING
const ratingStars = document.querySelectorAll('.rate-icons-star');
const fillStars = function (upTo) {
  ratingStars.forEach((star) => {
    if (+star.getAttribute('data-value') <= upTo) {
      star.setAttribute('name', 'star');
    }
  });
};

const unfillStars = function () {
  ratingStars.forEach((star) => {
    star.setAttribute('name', 'star-outline');
  });
};

ratingStars.forEach((star) => {
  star.addEventListener('mouseover', function (e) {
    const activeStar = document.querySelector('.active');
    if (!activeStar) {
      const upToVal = +e.target.getAttribute('data-value');
      fillStars(upToVal);
    }
  });
});

ratingStars.forEach((star) => {
  star.addEventListener('mouseout', function (e) {
    const activeStar = document.querySelector('.active');
    if (!activeStar) {
      unfillStars();
    }
  });
});

ratingStars.forEach((star) => {
  star.addEventListener('click', function (e) {
    const prevActive = document.querySelector('.active');
    if (prevActive === e.target) {
      prevActive.classList.remove('active');
      unfillStars();
      return;
    }
    if (prevActive) {
      prevActive.classList.remove('active');
    }
    unfillStars();
    const chosenStar = e.target;
    const upTo = +e.target.getAttribute('data-value');
    fillStars(upTo);
    chosenStar.classList.add('active');
  });
});
