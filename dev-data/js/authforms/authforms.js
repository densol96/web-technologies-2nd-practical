import { showAlert, hideAlert } from '../alerts.js';

export const initSignUp = () => {
  const signUpBtn = document.querySelector('.sign-up-btn');
  const username = document.querySelector('#username');
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const passwordConfirm = document.querySelector('#confirm');

  const clearInput = () => {
    username.value = '';
    email.value = '';
    password.value = '';
    passwordConfirm.value = '';
  };

  const signUserUp = async (username, email, password, passwordConfirm) => {
    const spinner = `
                    <div class="d-flex justify-content-center">
                      <span class="loader"></span>
                    </div>
                    `;
    signUpBtn.innerHTML = spinner;
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
      showAlert('success', result.data.name, result.data.message);
      clearInput();
    } catch (err) {
      console.log(err);
      showAlert('error', err.response.data.name, err.response.data.errors);
    }
    signUpBtn.innerHTML = `<span class="form-btn-text">Create Account</span>`;
  };

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
