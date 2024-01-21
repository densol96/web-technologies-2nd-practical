const redirectTo = (route, waitTimeSec) => {
  // const redirectStop = document.querySelector('#err-no-redirect');
  // if (redirectStop) return;
  setTimeout(() => {
    window.location.href = route;
  }, 1000 * waitTimeSec);
};

export default redirectTo;
