export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, name, infos) => {
  hideAlert();
  // succes or error
  let msgArray;
  console.log(typeof infos);
  if (typeof infos === 'string') {
    msgArray = [infos];
  } else {
    msgArray = infos;
  }
  console.log(msgArray);
  const html = `<div class="alert alert-${type}">
                  <h2 class="alert-name alert-${type}-heading">
                    <ion-icon name="alert-circle-outline"></ion-icon>${name}
                  </h2>
                  ${msgArray
                    .map((info) => {
                      return `<div class="alert-details">
                    <p class="alert-info">
                      <ion-icon name="${
                        type === 'error' ? 'close-circle-outline' : ''
                      }"></ion-icon>
                      ${info}
                    </p>`;
                    })
                    .join('')}
                  </div>
                  <div class="close-alert-btn">X</div>
                </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
  setTimeout(() => {
    document.querySelector('.alert').classList.add('opened');
  }, 100);
  const closeAlertBtn = document.querySelector('.close-alert-btn');
  let alertTimerID;
  closeAlertBtn.addEventListener('click', (e) => {
    hideAlert();
    clearTimeout(alertTimerID);
  });
  alertTimerID = setTimeout(hideAlert, 6000);
};
