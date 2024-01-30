import { getMarkupFilters } from './getMarkup/getMarkupFilters';
import { renderPageOne } from './render/renderPageOne';
import { showElementToPage, hidesElementFromPage } from './elementManagement';
import { loadsWorkoutSectionElements } from './render/renderingWorkoutSection';

const renderBtnListEl = document.querySelector('.render-btn-list-pagination');
const nowPage = document.querySelector('.render-pagination-btn-active');
const btnList = document.querySelectorAll('.render-pagination-btn');
const filterListBtn = document.querySelector('.render-page-one-list-btn');
const listBtnEl = document.querySelectorAll('.render-page-one-btn');
const listWorkoutRef = document.querySelector('.render-page-one-list');
const formSearchRef = document.querySelector('.form-search');

listWorkoutRef.addEventListener('click', loadsFirstPageElements);

const bodyWidth = getComputedStyle(document.querySelector('body')).width;
const limit = parseInt(bodyWidth) < 768 ? 8 : 12;
const params = {
  limit,
  page: 1,
  filter: 'Muscles',
};

const limitElements = parseInt(bodyWidth) < 768 ? 8 : 9;
const paramsObj = {
  page: 1,
  limit: limitElements,
};

const filterGroup = e => {
  if (e.target.nodeName === 'BUTTON') {
    listBtnEl.forEach(i => i.classList.remove('render-page-one-btn-active'));
    e.target.classList.add('render-page-one-btn-active');
    params.filter = e.target.textContent.trimStart().trimEnd();
    params.page = 1;
    renderPageOne(getMarkupFilters(params));

    // ------------------------------------------

    hidesElementFromPage(formSearchRef);
    if (paramsObj['muscles'] || paramsObj['bodypart'] || paramsObj['equipment'])
      clearsElementsObj(paramsObj);
    paramsObj.page = 1;
    renderBtnListEl.removeEventListener('click', loadsNextPageElements);
    listWorkoutRef.addEventListener('click', loadsFirstPageElements);
    renderBtnListEl.addEventListener('click', pagination);
  }
};

const pagination = e => {
  params.page = parseInt(e.target.textContent);
  renderPageOne(getMarkupFilters(params));
};

renderBtnListEl.addEventListener('click', pagination);
filterListBtn.addEventListener('click', filterGroup);

// ------------------------------------------------------------------

function loadsFirstPageElements(e) {
  if (!e.target.closest('.render-page-one-item')) return;

  paramsObj[e.target.dataset.filter] = e.target.dataset.name;

  console.log(paramsObj);
  console.log(e.target.dataset.filter);

  loadsWorkoutSectionElements(paramsObj);

  showElementToPage(formSearchRef);

  renderBtnListEl.addEventListener('click', loadsNextPageElements);
  renderBtnListEl.removeEventListener('click', pagination);
  listWorkoutRef.removeEventListener('click', loadsFirstPageElements);
}

function loadsNextPageElements(e) {
  if (!e.target.closest('.render-pagination-btn')) return;

  paramsObj.page = e.target.textContent;

  loadsWorkoutSectionElements(paramsObj);
}

function clearsElementsObj(obj) {
  delete obj.muscles;
  delete obj.bodypart;
  delete obj.equipment;
}
