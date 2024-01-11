import { showAlert, hideAlert } from '../alerts.js';
import redirectTo from './redirectTo.js';

const spinner = `
                <div class="d-flex justify-content-center">
                  <span class="loader"></span>
                </div>
                `;

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

export const initLogIn = () => {
  const emailField = document.querySelector('#email');
  const passwordField = document.querySelector('#password');
  const loginBtn = document.querySelector('.login-btn');
  const forgotBtn = document.querySelector('.forgot-btn');
  const form = document.querySelector('.form-content');

  const clearInput = () => {
    email.value = '';
    password.value = '';
  };

  const logUserIn = async (email, password) => {
    loginBtn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
          email,
          password,
        },
      });
      clearInput();
      showAlert('success', 'Login successful!', 'You are being redirected...');
      redirectTo('/overview', 1);
    } catch (err) {
      console.log(err);
      showAlert('error', 'Authentication failed!', err.response.data.message);
    }
    loginBtn.innerHTML = `<span class="form-btn-text">Login</span>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.submitter.classList.contains('forgot-btn')) {
      console.log(true);
    } else {
      logUserIn(emailField.value, passwordField.value);
    }
  });
};

export const initForgotPassword = () => {
  const btn = document.querySelector('.send-reset-token');
  const email = document.querySelector('#email');
  const form = document.querySelector('.psswd-reset-form');

  const requestResetLink = async (email) => {
    btn.innerHTML = spinner;

    try {
      const result = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/forgot-password',
        data: {
          email,
        },
      });
      showAlert('success', 'Success!', result.data.message);
    } catch (err) {
      showAlert('error', 'Something went wrong..', err.response.data.message);
    }

    btn.innerHTML = `<span class="form-btn-text">Send reset token</span>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    requestResetLink(email.value);
  });
};

export const initResetPassword = () => {
  const newPassword = document.querySelector('#new');
  const confirmPassword = document.querySelector('#confirm');
  const form = document.querySelector('.passwd-reset-form');
  const btn = document.querySelector('.send-reset-token');

  const resetPassword = async (username, password, confirm) => {
    btn.innerHTML = spinner;
  };
};
