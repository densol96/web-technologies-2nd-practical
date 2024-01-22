import { showAlert } from '../../alerts.js';
import { redirectTo } from '../../helper.js';

const spinner = `
                <div class="d-flex justify-content-center">
                  <span class="loader"></span>
                </div>
                `;

const initAdminEditUser = () => {
  const usernameInput = document.querySelector('#username');
  const emailInput = document.querySelector('#email');
  const emailIsPublicCheck = document.querySelector('#email-checkbox');
  const emailConfirmedCheck = document.querySelector(
    '#email-confirmed-checkbox'
  );
  const avatar = document.querySelector('#avatar');
  const userRoleRadio = document.querySelector('#user');
  const adminRoleRadio = document.querySelector('#admin');
  const ban = document.querySelector('#ban');
  const activeCheck = document.querySelector('#active');
  const saveBtn = document.querySelector('.admin-save-user-changes');
  const form = document.querySelector('.edit-user-form');
  const id = saveBtn.getAttribute('data-user-id');

  const applyChanges = async (data) => {
    saveBtn.innerHTML = spinner;
    try {
      const result = await axios({
        method: 'PATCH',
        url: `http://127.0.0.1:3000/api/v1/admin/users/edit/${id}`,
        data,
      });
      console.log(result);
      showAlert('success', result.data.name, [
        result.data.message,
        'Refreshing the page..',
      ]);
      redirectTo('/admin/users', 2);
    } catch (err) {
      showAlert(
        'error',
        err.response.data.name,
        err.response.data.errors
          ? err.response.data.errors
          : err.response.data.message
      );
    }
    saveBtn.innerHTML = `<span class="form-btn-text">Save changes</span>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', usernameInput.value);
    formData.append('email', emailInput.value);
    formData.append('emailIsPublic', emailIsPublicCheck.checked);
    formData.append('emailConfirmed', emailConfirmedCheck.checked);
    formData.append('avatar', avatar.files[0]);
    formData.append('role', userRoleRadio.checked ? 'user' : 'admin');
    formData.append('ban', ban.value ? ban.value : undefined);
    formData.append('active', activeCheck.checked);
    applyChanges(formData);
  });
};
export default initAdminEditUser;
