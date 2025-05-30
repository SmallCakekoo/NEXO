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

      <style>
        :host {
  display: block;
  margin: 0;
  width: 255px;
  background: #f2f4ff;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 15px;
  filter: drop-shadow(0 0 0.5rem rgba(158, 158, 158, 0.249));
}
img {
  width: 250px;
  height: auto;

  display: block;
  margin: 0 auto;
}
p {
  margin: 0;
  font-size: 0.9rem;
  text-align: start;
  margin-top: 30px;
  margin-bottom: 60px;
  margin-left: 1.2em;
  margin-right: 1.2rem;
}

@media (max-width: 480px) {
  :host {
    width: 90%;
    padding: 12px;
  }

  img {
    width: 100%;
    max-width: 300px;
  }

  p {
    text-align: center;
    margin: 20px 36px 40px;
    font-size: 1rem;
  }
}

      </style>
      <div class= image>
        <img src="${this.image}" alt="" />
      </div>
     
      <p>${this.text}</p>
    `;
  }
}

export default LandingCards;
