export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, name, errors) => {
  hideAlert();
  // succes or error
  const html = `<div class="alert alert-${type}">
                  <h2 class="alert-name alert-${type}-heading">
                    <ion-icon name="alert-circle-outline"></ion-icon>${name}
                  </h2>
                  ${errors
                    .map((error) => {
                      return `<div class="alert-details">
                    <p class="alert-info">
                      <ion-icon name="close-circle-outline"></ion-icon>
                      ${error}
                    </p>`;
                    })
                    .join()}
                  </div>
                  <div class="close-alert-btn">X</div>
                </div>`;
  console.log(html);
  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
  setTimeout(() => {
    document.querySelector('.alert').classList.add('opened');
  }, 100);
  // setTimeout(hideAlert, 6000);
};
