'use strict';

import { baseUrl, token } from './config.js';

function fetchData(searchTerm) {
  fetch(`${baseUrl}${searchTerm}&key=${token}&limit=15`)
    .then(result => result.json())
    .then(data => setupImageUrls(data.results));
}

function setupImageUrls(data) {
  thumbnails = data.map(image => image.media[0].gif.url);
  mainImages = data.map(image => image.media[0].tinygif.url);
  mainImage.setAttribute('src', mainImages[0]);
  displayGifs();
}

function displayGifs() {
  thumbnailsInner.innerHTML = parseImageElements();
  const images = thumbnailsInner.querySelectorAll('img');
  images.forEach(image => image.addEventListener('click', event => onThumbnailClick(event.target.src)));
  setCurrent(0);
}

function parseImageElements() {
  let thumnailElements = '';
  thumbnails.forEach(image => {
    thumnailElements += `<img class="thumnail" src="${image}"/>`;
  });
  return thumnailElements;
}

function setCurrent(index) {
  const current = document.querySelector('.current');
  current && current.classList.remove('current');
  thumbnailsInner.querySelector(`img:nth-of-type(${index + 1})`).classList.add('current');
}

function onThumbnailClick(sourceUrl) {
  const sourceIndex = thumbnails.indexOf(sourceUrl);
  setCurrent(sourceIndex);
  mainImage.setAttribute('src', mainImages[sourceIndex]);
}

function handleKeyPress(key) {
  const direction = { ArrowLeft: 'left', ArrowRight: 'right' }[key];
  direction && slide(direction);
}

function handleSearch(event) {
  event.preventDefault();
  const searchTerm = document.querySelector('.search-box').value;
  fetchData(searchTerm);
}

function slide(direction) {
  const currentSrc = mainImage.getAttribute('src');
  const index = mainImages.indexOf(currentSrc);
  const lastIndex = mainImages.length;
  let newIndex = direction === 'left' ? index - 1 : index + 1;

  switch (newIndex) {
    case -1:
      newIndex = lastIndex - 1;
      break;

    case lastIndex:
      newIndex = 0;
      break;

    default:
      break;
  }

  setCurrent(newIndex);
  mainImage.setAttribute('src', mainImages[newIndex]);
}

let thumbnails;
let mainImages;
const thumbnailsInner = document.querySelector('.thumbnails-inner');
const mainImage = document.querySelector('.main-image');

document.querySelector('.search-form').addEventListener('submit', event => handleSearch(event));
document.querySelectorAll('.button').forEach(button => button.addEventListener('click', event => slide(event.target.classList[0])));
document.addEventListener('keydown', event => handleKeyPress(event.key));

fetchData('puppy');
