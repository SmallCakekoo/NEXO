class FloatingButtonAdd extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="/styles/components/FloatingActionButton.css">
      <button class="fab" title="Crear Publicación">
        <img src="https://api.iconify.design/lucide:plus.svg?color=white" alt="Plus Icon">
      </button>
    `;

    const button = this.shadowRoot!.querySelector("button")!;
    button.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-modal"));
    });
  }
}

export default FloatingButtonAdd;
