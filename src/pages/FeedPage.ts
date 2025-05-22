class FeedPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
          }
        </style>
        <nav-bar></nav-bar> 
        <tag-filters-bar></tag-filters-bar>
        <post-container></post-container>
        <floating-btn></floating-btn>
        <post-modal></post-modal>
      `;
  }
}

export default FeedPage;
