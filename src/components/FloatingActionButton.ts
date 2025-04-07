class FloatingActionButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/styles/components/FloatingActionButton.css">
            <button class="fab">
                <svg viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
            </button>
        `;
  }

  addEventListeners() {
    const fab = this.shadowRoot!.querySelector(".fab");
    fab?.addEventListener("click", () => {
      const event = new CustomEvent("new-post-click");
      this.dispatchEvent(event);
    });
  }
}

export default FloatingActionButton;
