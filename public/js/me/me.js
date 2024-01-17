import { showAlert } from '../alerts.js';
import redirectTo from '../authforms/redirectTo.js';
import {
  SECURITY_CHANGE_API_ROUTE,
  SETTINGS_CHANGE_API_ROUTE,
} from '../helper.js';

const spinner = `
                <div class="d-flex justify-content-center">
                  <span class="loader"></span>
                </div>
                `;

export const initMeSecurity = () => {
  const currentPassword = document.querySelector('#current');
  const newPassword = document.querySelector('#new');
  const confirmPassword = document.querySelector('#confirm');
  const form = document.querySelector('.username-email-reset-form');
  const btn = document.querySelector('.send-reset-token');

  const clearInput = () => {
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  };

  const submitForm = async (current, newP, confirm) => {
    btn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'PATCH',
        url: SECURITY_CHANGE_API_ROUTE,
        data: {
          password: current,
          newPassword: newP,
          confirmNewPassword: confirm,
        },
      });
      showAlert('success', result.data.name, result.data.messages);
      redirectTo('/login', 2);
    } catch (err) {
      showAlert('error', err.response.data.name, err.response.data.message);
    }
    clearInput();
    btn.innerHTML = `<span class="form-btn-text">Change password</span>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(currentPassword.value, newPassword.value, confirmPassword.value);
  });
};

export const initMeSettings = () => {
  const username = document.querySelector('#username');
  const email = document.querySelector('#email');
  const avatar = document.querySelector('#avatar');
  const overlay = document.querySelector('.img-container-comment');
  const form = document.querySelector('.username-email-reset-form');
  const btn = document.querySelector('.form-btn');

  avatar.addEventListener('change', (e) => {
    overlay.classList.add('uploaded');
  });

  const applyChanges = async (data) => {
    btn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'PATCH',
        url: SETTINGS_CHANGE_API_ROUTE,
        data,
      });
      showAlert('success', result.data.name, [
        result.data.message,
        'Refreshing the page..',
      ]);
      redirectTo('/me/settings', 2);
    } catch (err) {
      console.log('💥 ERR');
      showAlert(
        'error',
        err.response.data.name,
        err.response.data.errors
          ? err.response.data.errors
          : err.response.data.message
      );
    }
    btn.innerHTML = `<span class="form-btn-text">Save settings</span>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username.value);
    formData.append('email', email.value);
    formData.append('avatar', avatar.files[0]);
    applyChanges(formData);
  });
};
