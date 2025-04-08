class FeedPage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: block;
            position: relative;
          }
        </style>
        <floating-btn></floating-btn>
        <post-modal></post-modal>
      `;
    }
  }
  
export default FeedPage;
  