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
                h2 { color: #4f46e5; }
            </style>

            <nav-bar></nav-bar>  
            <h2>Feed Section</h2>
            <p>Contenido del feed...</p>
            <teacher-oldcard></teacher-oldcard>
        `;
  }
}

export default FeedPage;
