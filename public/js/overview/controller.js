import * as model from './model.js';
import overviewView from './overviewViewer.js';

const initOverview = () => {
  const updateState = (dropdown, pagesTotal) => {
    const selectedIndex = dropdown.selectedIndex;
    const selectedText = dropdown.options[selectedIndex].text;
    const selectedValue = dropdown.options[selectedIndex].value;
    model.state.sortBy = selectedValue;
    model.state.pagesTotal = pagesTotal;
  };

  const handleNewSorting = async () => {
    model.state.page = 1;
    overviewView.revealSpiner();
    overviewView.revealData(updateState);
    await model.loadAnimes();
    overviewView.render(model.state.animes);
  };

  const handleLoadOnScroll = async () => {
    overviewView.renderSpinner();
    model.state.page++;
    await model.loadAnimes();
    overviewView.renderOnScroll(model.state.animes);
    if (model.state.page >= model.state.pagesTotal) {
      overviewView.hideSpinner();
    }
  };

  const setUpObserver = (endOf) => {
    function handleIntersection(entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && model.state.page < model.state.pagesTotal) {
          handleLoadOnScroll();
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
    overviewView.revealData(updateState);
    overviewView.attachInfScrollEvent(setUpObserver);
    overviewView.attachSortEvent(handleNewSorting);
  };

  init();
};

export default initOverview;

// PREVIOUS PAGINATION IMPLEMENTATION
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
//     overviewView.render(model.state.animes, model.state.page);
//   }
// };

// const handleNextPage = async function () {
//   if (model.state.page < model.state.pagesTotal) {
//     model.state.page++;
//     await model.loadAnimes();
//     overviewView.render(model.state.animes, model.state.page);
//   }
// };

// const init = () => {
//   overviewView.addEventListeners(
//     handlePrevPage,
//     handleNextPage,
//     handleNewSorting
//   );
//   overviewView.updateState(checkSelectedOption);
// };
