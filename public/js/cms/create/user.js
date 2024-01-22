import { CREATE_USER_API_ROUTE, redirectTo } from '../../helper.js';
import { showAlert } from '../../alerts.js';
const spinner = `
                <div class="d-flex justify-content-center">
                  <span class="loader"></span>
                </div>
                `;

const initAdminCreateUser = () => {
  const usernameInput = document.querySelector('#username');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const passwordConfirmInput = document.querySelector('#confirm');
  const form = document.querySelector('.form-content');
  const createBtn = document.querySelector('.sign-up-btn');

  const clearInput = () => {
    usernameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    passwordConfirmInput.value = '';
  };

  const signUserUp = async (username, email, password, passwordConfirm) => {
    createBtn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'POST',
        url: CREATE_USER_API_ROUTE,
        data: {
          username,
          email,
          password,
          passwordConfirm,
        },
      });
      console.log(result);
      showAlert('success', result.data.name, result.data.message);
      clearInput();
      redirectTo('/admin/users', 2);
    } catch (err) {
      console.log(err);
      showAlert('error', err.response.data.name, err.response.data.errors);
    }
    createBtn.innerHTML = `<span class="form-btn-text">Create User</span>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    signUserUp(
      usernameInput.value,
      emailInput.value,
      passwordInput.value,
      passwordConfirmInput.value
    );
  });
};

export default initAdminCreateUser;
