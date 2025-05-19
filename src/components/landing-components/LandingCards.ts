export enum Cards {
  text = 'text',
  image = 'image',
}

class LandingCards extends HTMLElement {
  text = '';
  image = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return Object.values(Cards); 
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    switch (name) {
      case Cards.text:
        this.text = newValue ?? '';
        break;
      case Cards.image:
        this.image = newValue ?? '';
        break;
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 260px;
          background:#f2f4ff;
          border:2px solid #000;
          border-radius:12px;
          padding:24px;
          text-align:center;
        }
        img {
          width:120px;
          height:auto;
          margin-bottom:16px;
        }
        p {
          margin:0;
          font-size:.95rem;
        }
      </style>

      <img src="${this.image}" alt="" />
      <p>${this.text}</p>
    `;
  }
}

customElements.define('landing-cards', LandingCards);
export default LandingCards;
