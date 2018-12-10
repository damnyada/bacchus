import { html as beautify } from 'js-beautify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/builder.css';

const popTemplate = require('../template/templ-pop.hbs');
const premiumTemplate = require('../template/templ-premium.hbs');

const NEWS_DOMAIN = 'http://static.evino.com.br/BR/upload/news/';
let code = '';

function clearElement(el) {
  el.innerHTML = '';  // eslint-disable-line
}

function getPreheader() {
  return document.getElementById('preheader');
}

function getMainSlices() {
  return document.querySelectorAll('.main.slice');
}

function getSlices() {
  return document.getElementsByClassName('slice');
}

function download(doc) {
  const file = beautify(doc, { indent_size: 2 });
  const hiddenElement = document.createElement('a');

  hiddenElement.href = `data:attachment/text,${encodeURI(file)}`;
  hiddenElement.target = '_blank';
  hiddenElement.download = 'index.html';
  hiddenElement.click();
}

function fillSlices() {
  let firstSlice = '';
  const allSlices = getSlices();
  let i;
  let num;

  // fill slice numbers
  if (allSlices[0].children[1].value !== '') {
    firstSlice = allSlices[0].children[1].value.match(/(.+)(\d{2})(\.\w+)/);

    for (i = 1; i < allSlices.length; i += 1) {
      num = parseInt(firstSlice[2], 10) + i;
      num = num < 10 ? String(`0${num}`) : String(num);

      allSlices[i].children[1].value = firstSlice[1] + num + firstSlice[3];
    }
  }
}

function changeSlices(qtd) {
  const totalSlices = qtd > 20 ? 20 : qtd;
  const mainSlices = getMainSlices();
  const sliceWrapper = document.getElementById('row-wrapper');
  let fields = '';
  let i;

  if (totalSlices > mainSlices.length) {
    // add rows to HTML
    for (i = mainSlices.length + 1; i <= totalSlices; i += 1) {
      fields = `
        <h5>Row ${i}</h5>
        <input class="form-control form-control-sm" type="text" name="image" placeholder="Image">
        <input class="form-control form-control-sm" type="text" name="rilt" placeholder="Rilt">
        <input
          class="form-control form-control-sm"
          type="text"
          name="href"
          placeholder="Link"
          value="https://www.evino.com.br"
        />
        <button type="button" class="enable-extra btn btn-warning btn-sm btn-build">+</button>
        <div class="extra">
          <h5>Double slice</h5>
          <input class="form-control form-control-sm" type="text" placeholder="Image">
          <input class="form-control form-control-sm" type="text" placeholder="Rilt">
          <input class="form-control form-control-sm" type="text" placeholder="Link" value="https://www.evino.com.br">
        </div>
      `;

      const div = document.createElement('div');
      div.className = 'main slice';
      div.innerHTML = fields;

      document.getElementById('row-wrapper').appendChild(div);
    }
  } else if (totalSlices < mainSlices.length) {
    // delete rows from HTML
    for (i = mainSlices.length - 1; i >= totalSlices; i -= 1) {
      sliceWrapper.removeChild(mainSlices[i]);
    }
  }
}

// parse FTP URL and outputs final images address
function parseLink(link) {
  let newLink = link;
  const regex = /http:\/\/media\.evino\.com\.br\/data|ftp(?:s)?:\/\/(?:red\.production@)?media\.evino\.com\.br:\d+\/data/;

  if (link.indexOf('media.evino.com.br') > 0) {
    newLink = link.replace(regex, 'http://static.evino.com.br');
  }
  return newLink;
}

function build(template) {
  const allSlices = getSlices();
  const preheader = getPreheader();
  const newsletter = {};

  code = document.createElement('div');
  const result = document.getElementById('result');
  let iframe = '';
  let count = 0;

  clearElement(result);

  if (preheader.children[1].value !== '') {
    newsletter.preheader = {
      image: parseLink(preheader.children[1].value),
      rilt: preheader.children[2].value,
      link: preheader.children[3].value,
    };
  }

  newsletter.slots = [];
  while (count < allSlices.length) {
    if (allSlices[count].lastElementChild.className === 'extra slice') {
      newsletter.slots.push({
        image: parseLink(allSlices[count].children[1].value),
        rilt: allSlices[count].children[2].value,
        link: allSlices[count].children[3].value,
        double_image: parseLink(allSlices[count + 1].children[1].value),
        double_rilt: allSlices[count + 1].children[2].value,
        double_link: allSlices[count + 1].children[3].value,
      });
      count += 2;
    } else {
      newsletter.slots.push({
        image: parseLink(allSlices[count].children[1].value),
        rilt: allSlices[count].children[2].value,
        link: allSlices[count].children[3].value,
      });
      count += 1;
    }
  }

  newsletter.footer = {
    rilt: 'Footer',
    link: allSlices[0].children[3].value,
  };

  if (template === 'premium') {
    newsletter.footer.image = `${NEWS_DOMAIN}content/footer2018/assinatura-premium.gif`;
    code.innerHTML = premiumTemplate(newsletter);
  } else {
    newsletter.footer.image = `${NEWS_DOMAIN}2018/05_Maio/2018_05_08_redday_12h/images/assinatura.gif`;
    code.innerHTML = popTemplate(newsletter);
  }

  iframe = document.createElement('iframe');
  iframe.src = `data:text/html;charset=utf-8, ${encodeURIComponent(code.innerHTML)}`;
  document.getElementById('result').appendChild(iframe);
}

document.getElementById('total-rows').addEventListener('change', function () {
  changeSlices(this.value);
});

document.getElementById('fill').addEventListener('click', () => {
  fillSlices();
});

document.getElementById('download').addEventListener('click', () => {
  download(code.innerHTML);
});

document.getElementById('premium').addEventListener('click', () => {
  build('premium');
});

document.getElementById('pop').addEventListener('click', () => {
  build();
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.className.indexOf('enable-extra') >= 0) {
    const extra = e.target.parentElement.lastElementChild.classList;
    extra.toggle('slice');
  }
});

changeSlices(1);
