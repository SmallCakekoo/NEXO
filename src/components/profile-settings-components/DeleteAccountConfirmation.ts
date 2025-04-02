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
            <style>
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    transition: background-color 0.3s ease;
                    font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, sans-serif;
                }

                :host(.visible) {
                    background-color: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                }

                .confirmation-dialog {
                    background-color: white;
                    border-radius: 24px;
                    width: 90%;
                    max-width: 480px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    opacity: 0;
                    transform: translateY(20px) scale(0.98);
                    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                }

                .dialog-header {
                    background: linear-gradient(135deg, #4F46E5, #6366F1);
                    padding: 24px 20px;
                    text-align: center;
                    position: relative;
                }

                .warning-icon {
                    width: 56px;
                    height: 56px;
                    background-color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .warning-icon svg {
                    width: 32px;
                    height: 32px;
                    fill: #EF4444;
                }

                .dialog-header h2 {
                    color: white;
                    font-size: 22px;
                    margin: 0;
                    padding: 0;
                    font-weight: 600;
                    line-height: 1.3;
                }

                .dialog-content {
                    padding: 24px 20px;
                }

                .message {
                    color: #4B5563;
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 24px;
                    text-align: center;
                }

                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }

                .btn {
                    background-color: #5354ED;
                    color: white;
                    font-size: 14px;
                    border: 2px solid black;
                    padding: 7px 30px;
                    border-radius: 50px;
                    cursor: pointer;
                    outline: none;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.2s ease-in-out;
                }

                .confirm-btn {
                    background-color: #5354ED;
                }

                .cancel-btn {
                    background-color: white;
                    color: black;
                }

                .btn:hover {
                    filter: brightness(1.2);
                    transform: scale(1.05);
                    -webkit-box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
                    -moz-box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
                    box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
                }

                .btn:active {
                    transform: scale(0.95);
                    -webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
                    -moz-box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
                    box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
                    filter: brightness(0.8);
                }

                @media (max-width: 480px) {
                    .action-buttons {
                        flex-direction: column;
                    }
                    .btn {
                        width: 100%;
                    }
                }
            </style>
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
