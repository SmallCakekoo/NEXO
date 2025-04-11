class CommentsDetailPage extends HTMLElement {
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
        h1 {
          color: #5354ed;
          text-align: center;
          margin-bottom: 20px;
        }
      </style>
      <nav-bar></nav-bar>
      <h1>Comentarios</h1>
    `;
  }
}

export default CommentsDetailPage;
