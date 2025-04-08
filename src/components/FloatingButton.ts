
class FloatingButton extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.shadowRoot!.innerHTML = `
        <link rel="stylesheet" href="/styles/components/new-post.css">
        <button class="floating-btn" title="Crear Publicación">
          <img src="https://api.iconify.design/lucide:plus.svg?color=white" alt="Plus Icon">
        </button>
      `;
  
      const button = this.shadowRoot!.querySelector("button")!;
      button.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("open-modal"));
      });
    }
  }
  
export default FloatingButton;
  