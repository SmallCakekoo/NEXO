class BackButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["text", "target"];
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const button = this.shadowRoot?.querySelector(".back-button");
    button?.addEventListener("click", () => {
      // Obtener el destino de la navegación (por defecto '/academic')
      const target = this.getAttribute("target") || "/academic";

      // Usar un evento de navegación personalizado
      const customEvent = new CustomEvent("navigate", {
        bubbles: true,
        composed: true,
        detail: target,
      });
      document.dispatchEvent(customEvent);
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
      this.addEventListeners();
    }
  }

  render() {
    const buttonText = this.getAttribute("text") || "Back";

    this.shadowRoot!.innerHTML = `
            <style>
                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    color: #5354ED;
                    font-weight: 500;
                    padding: 8px 0;
                    transition: all 0.2s ease;
                }
                
                .back-button:hover {
                    opacity: 0.8;
                    transform: translateX(-3px);
                }
                
                .back-icon {
                    fill: #5354ED;
                }
            </style>
            <button class="back-button">
                <svg class="back-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                ${buttonText}
            </button>
        `;
  }
}

export default BackButton;
