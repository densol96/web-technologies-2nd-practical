import { showAlert } from '../../alerts.js';
import { redirectTo } from '../../helper.js';

const initStarEffect = () => {
  const stars = document.querySelectorAll('.rate-icons-star');
  let rating = document
    .querySelector('.admin-int-edit')
    .getAttribute('data-cur-rating');

  const markActive = (rating) => {
    const shouldBeActive = document.querySelector(
      `.rate-icons-star[data-value="${rating}"]`
    );
    shouldBeActive.classList.add('active');
  };

  const fillStars = (upTo) => {
    stars.forEach((star) => {
      if (+star.getAttribute('data-value') <= upTo)
        star.setAttribute('name', 'star');
    });
  };

  const unfillStars = () => {
    stars.forEach((star) => {
      star.setAttribute('name', 'star-outline');
    });
  };

  const clickEvent = (e) => {
    unfillStars();
    const oldActive = document.querySelector('.active');
    if (oldActive) oldActive.classList.remove('active');
    const newActive = e.target;
    if (oldActive !== newActive) {
      newActive.classList.add('active');
    }
    const newActiveValue = +newActive.getAttribute('data-value');
    if (e.target === oldActive) return unfillStars;
    fillStars(newActiveValue);
  };

  const mouseOverEvent = (e) => {
    if (!document.querySelector('.active'))
      fillStars(e.target.getAttribute('data-value'));
  };

  const mouseOutEvent = (e) => {
    if (!document.querySelector('.active')) unfillStars();
  };

  markActive(rating);
  stars.forEach((star) => {
    star.addEventListener('click', clickEvent);
    star.addEventListener('mouseover', mouseOverEvent);
    star.addEventListener('mouseout', mouseOutEvent);
  });
};

const sendData = async (e) => {
  e.preventDefault();
  const rating = +document
    .querySelector(`.rate-icons-star.active`)
    ?.getAttribute('data-value');
  const comment = document.querySelector('#comment').value;
  const checked = document.querySelector('#checked').checked;

  const id = e.target.getAttribute('data-id-review');
  try {
    const result = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/review/${id}`,
      data: {
        rating,
        comment,
        checked,
      },
    });

    showAlert('success', 'Success', result.data.message);
    redirectTo('/admin/reviews', 2);
  } catch (err) {
    showAlert('error', 'Invalid input', err.response.data.errors);
  }
};

export const initAdminEditReview = () => {
  const btn = document.querySelector('.send-comment');
  initStarEffect();
  btn.addEventListener('click', sendData);
};
