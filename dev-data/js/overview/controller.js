import * as model from './model.js';
import animesViewer from './views/animesViewer.js';

// function checkSelectedOption(dropdown, pagesTotal) {
//   const selectedIndex = dropdown.selectedIndex;
//   const selectedText = dropdown.options[selectedIndex].text;
//   const selectedValue = dropdown.options[selectedIndex].value;
//   model.state.sortBy = selectedValue;
//   model.state.pagesTotal = pagesTotal;
//   console.log(model.state);
// }

// const handlePrevPage = async function () {
//   if (model.state.page > 1) {
//     model.state.page--;
//     await model.loadAnimes();
//     animesViewer.render(model.state.animes, model.state.page);
//   }
// };

// const handleNextPage = async function () {
//   if (model.state.page < model.state.pagesTotal) {
//     model.state.page++;
//     await model.loadAnimes();
//     animesViewer.render(model.state.animes, model.state.page);
//   }
// };

// const handleNewSorting = async function () {
//   model.state.page = 1;
//   animesViewer.updateState(checkSelectedOption);
//   await model.loadAnimes();
//   animesViewer.render(model.state.animes, model.state.page);
// };

// const init = () => {
//   animesViewer.addEventListeners(
//     handlePrevPage,
//     handleNextPage,
//     handleNewSorting
//   );
//   animesViewer.updateState(checkSelectedOption);
// };

const initOverview = () => {
  function checkSelectedOption(dropdown, pagesTotal) {
    const selectedIndex = dropdown.selectedIndex;
    const selectedText = dropdown.options[selectedIndex].text;
    const selectedValue = dropdown.options[selectedIndex].value;
    model.state.sortBy = selectedValue;
    model.state.pagesTotal = pagesTotal;
    console.log(model.state);
  }

  const handLeLoadOnScroll = async () => {
    animesViewer.renderSpinner();
    model.state.page++;
    await model.loadAnimes();
    animesViewer.renderOnScroll(model.state.animes);
    console.log('FROM HANDLE:', model.state.page, model.state.pagesTotal);
    if (model.state.page >= model.state.pagesTotal) {
      animesViewer.hideSpinner();
    }
  };

  const setUpObserver = (endOf) => {
    function handleIntersection(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && model.state.page < model.state.pagesTotal) {
          handLeLoadOnScroll();
        }
      });
    }
    const options = {
      root: null,
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(endOf);
  };

  const init = () => {
    animesViewer.updateState(checkSelectedOption);
    animesViewer.attachInfScrollEvent(setUpObserver);
  };

  init();
};

export default initOverview;
