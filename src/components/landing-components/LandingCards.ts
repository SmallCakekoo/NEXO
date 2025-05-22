export enum Cards {
  text = "text",
  image = "image",
}

class LandingCards extends HTMLElement {
  text = "";
  image = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return Object.values(Cards);
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case Cards.text:
        this.text = newValue ?? "";
        break;
      case Cards.image:
        this.image = newValue ?? "";
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

      <link rel="stylesheet" href="/styles/components/landing/landingCards.css">

      <div class= image>
        <img src="${this.image}" alt="" />
      </div>
     
      <p>${this.text}</p>
    `;
  }
}

export default LandingCards;
