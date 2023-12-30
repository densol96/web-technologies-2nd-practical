import { showAlert } from '../alerts.js';

export const initSignUp = () => {
  const signUserUp = async (username, email, password, passwordConfirm) => {
    try {
      const result = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/sign-up',
        data: {
          username,
          email,
          password,
          passwordConfirm,
        },
      });
      console.log(result);
    } catch (err) {
      console.log(err);
      // showAlert('error', err.response.data.message);
    }
  };
  const signUpBtn = document.querySelector('.sign-up-btn');
  const username = document.querySelector('#username');
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const passwordConfirm = document.querySelector('#confirm');
  const eventHandler = (e) => {
    e.preventDefault();
    signUserUp(
      username.value,
      email.value,
      password.value,
      passwordConfirm.value
    );
  };
  signUpBtn.addEventListener('click', eventHandler);
};
