import { LitElement, html } from 'lit-element';
import _ from 'lodash';
import $ from 'jquery';
import slick from 'slick-carousel';

import { renderFonts, ensureFonts } from './lib/typography.js';
import { renderContents } from './lib/contents.js';

import fonts__suedtirol_pro_woff from './fonts/SuedtirolPro-Regular.woff';
import fonts__suedtirol_next_woff from './fonts/SuedtirolNextTT.woff';
import fonts__suedtirol_next_woff2 from './fonts/SuedtirolNextTT.woff2';
import fonts__suedtirol_next_bold_woff from './fonts/SuedtirolNextTT-Bold.woff';
import fonts__suedtirol_next_bold_woff2 from './fonts/SuedtirolNextTT-Bold.woff2';
import fonts__kievit_regular_woff from './fonts/Kievit.woff';
import fonts__kievit_bold_woff from './fonts/Kievit-Bold.woff';

import styles__normalize from 'normalize.css/normalize.css';
import styles from './cards.scss';

import assets__arrow_left_icon from './images/arrow-left.svg';
import assets__arrow_right_icon from './images/arrow-right.svg';

const fonts = [
  {
    name: 'pages-suedtirol-next',
    woff: fonts__suedtirol_next_woff,
    woff2: fonts__suedtirol_next_woff2,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_regular_woff,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_bold_woff,
    weight: 700
  }
];

class CardsElement extends LitElement {

  constructor() {
    super();

    this.srcUrl = '';
    this.shuffleCards = 'false';
  }

  static get properties() {
    return {
      srcUrl: { attribute: 'src', type: String },
      shuffleCards: { attribute: 'shuffle', type: String }
    };
  }

  renderCard(card) {
    return `
      <div class="card">
        <div class="box">
          <div class="contains-image ${!!card.image ? 'is-defined' : ''}">
            ${!!card.image ? `
              <div class="image" style="background-image: url('${card.image.src}');"></div>
              ${!!card.image.copyright ? `
                <div class="copyright">
                  <span class="copyright-text">&copy; ${card.image.copyright}</span>
                </div>
              `: ``}
            ` : ``}
          </div>
          <div class="contains-contents">
            <div class="category">${card.category}</div>
            <div class="title">${card.title}</div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <style>
        ${renderFonts(fonts)}
        ${styles__normalize}
        ${styles}
      </style>
      <div id="wrapper">
        <div id="container">
          <div id="contents"></div>
          <div id="contains-cards">
            <div id="cards"></div>
          </div>
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    let self = this;
    let root = self.shadowRoot;

    ensureFonts(fonts);

    if (!!self.srcUrl) {
      fetch(self.srcUrl).then((response) => {
        return response.json();
      }).then((data) => {
        let contentsContainer = root.getElementById('contents');
        contentsContainer.innerHTML = renderContents(data.contents || '');

        if (!!data.items) {
          let cardsList = root.getElementById('cards');
          cardsList.innerHTML = '';

          var items = data.items;
          if (!!self.shuffleCards && self.shuffleCards === 'true') {
            items = _.shuffle(items);
          }

          _.each(items, (item) => {
            cardsList.insertAdjacentHTML('beforeend', self.renderCard(item));
          });

          $(cardsList).slick({
            arrows: true,
            prevArrow: `<button type="button" class="slick-prev">${assets__arrow_left_icon}</button>`,
            nextArrow: `<button type="button" class="slick-next">${assets__arrow_right_icon}</button>`,
            centerMode: false,
            dots: false,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
              {
                breakpoint: 1240,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2
                }
              },
              {
                breakpoint: 992,
                settings: {
                  centerMode: true,
                  centerPadding: '96px',
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 600,
                settings: {
                  centerMode: true,
                  centerPadding: '64px',
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              }
            ]
          });
        }
      });
    }
  }

}

if (!customElements.get('pages-cards')) {
  customElements.define('pages-cards', CardsElement);
}