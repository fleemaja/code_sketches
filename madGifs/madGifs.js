const submitBtn = document.querySelector('input[type="submit"]');
const showGridBtn = document.querySelector('.show-grid');

const txt = "In 356 B.C., Phillip of Macedonia, the ruler of a province in northern Greece, became the father of a bouncing baby $$noun-1$$ named Alexander. Alexander's teacher was Aristotle, the famous $$noun-2$$. When he was twenty years old, his father was murdered by $$celebrity-1$$, after which he became $$noun-3$$ of all Macedonia. In 334, he invaded Persia and defeated $$celebrity-2$$ at the battle of $$a-place$$. Later, at Arbela, he won his most important victory, over Darius the Third. This made him $$noun-4$$ $$silly-word$$ over all Persians. Then he marched to India, and many of his $$plural-1$$ died. After that, Alexander began drinking too much $$type-of-liquid$$, and at the age of 33, he died of an infection in the $$part-of-the-body$$. His last words are reported to have been, 'There are no more $$plural-2$$ to conquer.'";

const main = document.querySelector('.main');
const gifWindow = document.querySelector('.gifWindow');
const imgGrid = document.querySelector('.image-grid');

let hoverables = [];
let imgData = {};

function unique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) {
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

function constructImgData(imgURL, searchTerm) {
  imgData[searchTerm] = imgURL;
  imgGrid.innerHTML += `<img src="${imgURL}" title="${searchTerm}" alt="${searchTerm}" />`;
}

function getGifs(inputVals) {
  const uniqVals = unique(inputVals);
  uniqVals.forEach((uv) => {
    const url = `http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(uv)}&api_key=dc6zaTOxFJmzC&limit=1`;
    fetch(url)
      .then(blob => blob.json())
      .then(d => d['data'].length > 0 &&
            constructImgData(d['data'][0]['images']['fixed_height']['url'], uv));
  });
}

function generateResults(e) {
  e.preventDefault();
  // scroll to top
  window.scrollTo(0, 0);

  const re = /\$\$(.*?)\$\$/g;
  let filledTxt = txt;
  let m;
  const inputVals = [];
  do {
    m = re.exec(txt);
    if (m) {
      const regex = new RegExp(m[1], 'g');
      const inputVal = document.getElementById(m[1]).value;
      inputVals.push(inputVal);
        filledTxt = filledTxt.replace(regex, `<span class='hoverable fancy-highlight'>${inputVal}</span>`);
    }
  } while (m);

  filledTxt = filledTxt.replace(/\$/g, '');
  main.classList.add('story');
  main.innerHTML = filledTxt;
  gifWindow.style.display = 'block';
  getGifs(inputVals);
  activateHoverables();
  showGridBtn.style.display = 'block';
}

function activateHoverables() {
  hoverables = document.querySelectorAll('.hoverable');
  [].forEach.call(hoverables, function(h) {
    h.addEventListener('mouseover', (e) => gifWindowChange(e));
    h.addEventListener('click', (e) => gifWindowChange(e));
  });
}

submitBtn.addEventListener('click', generateResults);
showGridBtn.addEventListener('click', toggleGrid);

function toggleGrid() {
  showGridBtn.innerHTML = (showGridBtn.innerHTML == 'Hide All Gifs') ? 'Show All Gifs' : 'Hide All Gifs';
  imgGrid.style.display = (imgGrid.style.display == 'block') ? 'none' : 'block';
}

const textInputs = document.querySelectorAll('input[type="text"]');

const form = document.querySelector('form');

form.addEventListener('input', checkForm);

function checkForm() {
  submitBtn.disabled = false;
  [].forEach.call(textInputs, function(input) {
    if (input.value == "") {
      submitBtn.disabled = true;
    }
  });
}

function gifWindowChange(e) {
  // clear window
  gifWindow.innerHTML = '';
  deactivateAllHoverables();
  e.target.classList.add('active');
  const gifName = e.target.innerText;
  const gifURL = imgData[gifName];
  gifWindow.innerHTML += `<h2 class="highlight">${gifName}</h2>`;
  if (gifURL) {
    gifWindow.innerHTML += `<div><img src="${gifURL}" title="${gifName}" alt="${gifName}" /></div>`;
  } else {
    gifWindow.innerHTML += `<p class="instructions">No results found on Giphy.</p>`;
  }
}

function deactivateAllHoverables() {
  [].forEach.call(hoverables, function(h) {
    h.classList.remove('active');
  });
}
