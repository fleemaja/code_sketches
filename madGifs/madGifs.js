const submitBtn = document.querySelector('input[type="submit"]');

const txt = "In 356 B.C., Phillip of Macedonia, the ruler of a province in northern Greece, became the father of a bouncing baby $$noun-1$$ named Alexander. Alexander's teacher was Aristotle, the famous $$noun-2$$. When he was twenty years old, his father was murdered by $$celebrity-1$$, after which he became $$noun-3$$ of all Macedonia. In 334, he invaded Persia and defeated $$celebrity-2$$ at the battle of $$a-place$$. Later, at Arbela, he won his most important victory, over Darius the Third. This made him $$noun-4$$ $$silly-word$$ over all Persians. Then he marched to India, and many of his $$plural-1$$ died. After that, Alexander began drinking too much $$type-of-liquid$$, and at the age of 33, he died of an infection in the $$part-of-the-body$$. His last words are reported to have been, 'There are no more $$plural-2$$ to conquer.'";

const main = document.querySelector('.main');

function generateResults(e) {
  e.preventDefault();
  const re = /\$\$(.*?)\$\$/g;
  let filledTxt = txt;
  let m;
  do {
    m = re.exec(txt);
    if (m) {
      const regex = new RegExp(m[1], 'g');
      const inputVal = document.getElementById(m[1]).value;
        filledTxt = filledTxt.replace(regex, `<span class='hl'>${inputVal}</span>`);
    }
  } while (m);

  filledTxt = filledTxt.replace(/\$/g, '');
  main.innerHTML = filledTxt;
}

submitBtn.addEventListener('click', generateResults);

const textInputs = document.querySelectorAll('input[type="text"]');

const form = document.querySelector('form');

form.addEventListener('keyup', checkForm);

function checkForm() {
  submitBtn.disabled = false;
  textInputs.forEach((input) => {
    if (input.value == "") {
      submitBtn.disabled = true;
    }
  });
}
