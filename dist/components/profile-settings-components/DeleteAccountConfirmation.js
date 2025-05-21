class DeleteAccountConfirmation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        // Animates the dialog into view after a short delay
        setTimeout(() => {
            const dialog = this.shadowRoot.querySelector(".confirmation-dialog");
            if (dialog) {
                dialog.style.opacity = "1";
                dialog.style.transform = "translateY(0)";
            }
            this.shadowRoot.host.classList.add("visible");
        }, 10);
    }
    render() {
        this.shadowRoot.innerHTML = `
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
    // Adds event listeners to the confirm and cancel buttons
    setupEventListeners() {
        const confirmBtn = this.shadowRoot.querySelector(".confirm-btn");
        const cancelBtn = this.shadowRoot.querySelector(".cancel-btn");
        // On confirm, animate out and dispatch a custom event (but this is static for now)
        confirmBtn?.addEventListener("click", () => {
            this.animateOut().then(() => {
                const confirmEvent = new CustomEvent("delete-account-confirmed", {
                    bubbles: true, // Allows the event to bubble up to the parent
                    composed: true, // Allows the event to be composed
                });
                this.dispatchEvent(confirmEvent);
                this.remove();
            });
        });
        // On cancel, animate out and remove
        cancelBtn?.addEventListener("click", () => {
            this.animateOut().then(() => {
                this.remove();
            });
        });
    }
    // Animates the dialog out of view
    animateOut() {
        return new Promise((resolve) => {
            const dialog = this.shadowRoot.querySelector(".confirmation-dialog");
            this.shadowRoot.host.classList.remove("visible");
            if (dialog) {
                dialog.style.opacity = "0";
                dialog.style.transform = "translateY(20px) scale(0.95)";
            }
            // Resolves the promise after the animation completes
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }
}
export default DeleteAccountConfirmation;
//# sourceMappingURL=DeleteAccountConfirmation.js.map