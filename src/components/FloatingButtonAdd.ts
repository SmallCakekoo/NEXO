class FloatingButtonAdd extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="/styles/components/FloatingActionButton.css">
      <button class="fab" title="Crear publicación" aria-label="Crear publicación">
        <svg viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
    `;

    const button = this.shadowRoot!.querySelector("button")!;
    button.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-modal"));
    });
  }
}

export default FloatingButtonAdd;
