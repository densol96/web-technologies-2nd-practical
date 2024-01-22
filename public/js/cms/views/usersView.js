import BaseView from './baseView.js';

class adminUsersViewer extends BaseView {
  #singleUserHTML(user) {
    return `
      <tr>
        <td class="user-username-table">${user.username}</td>
        <td class="user-email-table">${user.email}</td>
        <td class="user-joined-table">${user.registrationDate}</td>
        <td class="user-approved-table">
          <ion-icon class="table-icon checked-icon" name="${
            user.active ? 'chevron-down-circle-outline' : 'close-circle-outline'
          }"></ion-icon>
        </td>
        <td class="user-role-table">${user.role}</td>
        <td class="user-email-confirm-table">
          <ion-icon class="table-icon checked-icon" name="${
            user.emailConfirmed
              ? 'chevron-down-circle-outline'
              : 'close-circle-outline'
          }"></ion-icon>
        </td>
        <td class="review-action-table">
          <a class="view-btn" href="/users/${user._id}">
            <ion-icon class="table-icon edit-icon" name="eye-outline"></ion-icon>
          </a>
          <span class="delimiter">/</span>
          <a class="edit-btn" href="/admin/users/edit/${user._id}">
            <ion-icon class="table-icon edit-icon" name="create-outline"></ion-icon>
          </a>
        </td>
      </tr>
      `;
  }

  render(users) {
    if (!this._wholeSection) return;
    if (users.length === 0) {
      this._dataContainer.innerHTML = '';
    }
    const html = users
      .map((user) => {
        return this.#singleUserHTML(user);
      })
      .join('');
    this._dataContainer.innerHTML = html;
  }
}

const createClass = () => {
  if (window.location.pathname.startsWith('/admin/users')) {
    return new adminUsersViewer();
  }
};

export default createClass();
