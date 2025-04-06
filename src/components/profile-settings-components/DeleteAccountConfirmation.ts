class DeleteAccountConfirmation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Aplicar animación después de que el elemento se haya agregado al DOM
    setTimeout(() => {
      const dialog = this.shadowRoot!.querySelector(".confirmation-dialog") as HTMLElement;
      if (dialog) {
        dialog.style.opacity = "1";
        dialog.style.transform = "translateY(0)";
      }
      this.shadowRoot!.host.classList.add("visible");
    }, 10);
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/styles/components/profile-settings/DeleteAccountConfirmation.css">
            <div class="confirmation-dialog">
                <div class="dialog-header">
                    <div class="warning-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                        </svg>
                    </div>
                    <h2>¿Estás seguro de que deseas eliminar tu cuenta?</h2>
                </div>
                <div class="dialog-content">
                    <p class="message">Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos, configuraciones y actividad de la plataforma.</p>
                    <div class="action-buttons">
                        <button class="btn cancel-btn">Cancelar</button>
                        <button class="btn confirm-btn">Eliminar cuenta</button>
                    </div>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    const confirmBtn = this.shadowRoot!.querySelector(".confirm-btn");
    const cancelBtn = this.shadowRoot!.querySelector(".cancel-btn");

    confirmBtn?.addEventListener("click", () => {
      // Animate out before removing
      this.animateOut().then(() => {
        // Dispatch event for account deletion confirmation
        const confirmEvent = new CustomEvent("delete-account-confirmed", {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(confirmEvent);
        this.remove();
      });
    });

    cancelBtn?.addEventListener("click", () => {
      // Animate out before removing
      this.animateOut().then(() => {
        this.remove();
      });
    });
  }

  animateOut() {
    return new Promise<void>((resolve) => {
      const dialog = this.shadowRoot!.querySelector(".confirmation-dialog") as HTMLElement;
      this.shadowRoot!.host.classList.remove("visible");

      if (dialog) {
        dialog.style.opacity = "0";
        dialog.style.transform = "translateY(20px) scale(0.95)";
      }

      // Wait for animation to complete
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
}

export default DeleteAccountConfirmation;
