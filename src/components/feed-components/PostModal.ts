class PostModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="/styles/components/feed/PostModal.css">
      <div class="overlay" id="overlay"></div>
      <div class="modal" id="modal">
        <div class="modal-header">
          <button class="close-btn" id="close-btn">
            <img src="https://api.iconify.design/lucide:x.svg?color=white" alt="X">
          </button>
          <p class="titulo">New Post</p>
          <button class="publish-btn">
              Publish
              <img src="https://api.iconify.design/lucide:send.svg" alt="Send">
          </button>
        </div>

        <div class="modal-body">
          <textarea placeholder="Write something" rows="8"></textarea>

          <div class="categories">
            <div class="category">
                <input type="radio" id="daily-life" name="category" checked>
                <label for="daily-life">Daily Life</label>
            </div>
            <div class="category">
                <input type="radio" id="carpool" name="category">
                <label for="carpool">Carpool</label>
            </div>
            <div class="category">
                <input type="radio" id="monitoring" name="category">
                <label for="monitoring">Monitoring</label>
            </div>
          </div>

          <div class="upload-box" id="upload-box">Upload Image</div>
          <input type="file" id="image-input" accept="image/*">
        </div>
      </div>
    `;

    const modal = this.shadowRoot!.getElementById("modal")!;
    const overlay = this.shadowRoot!.getElementById("overlay")!;
    const closeBtn = this.shadowRoot!.getElementById("close-btn")!;
    const uploadBox = this.shadowRoot!.getElementById("upload-box")!;
    const imageInput = this.shadowRoot!.getElementById("image-input") as HTMLInputElement;

    // Por defecto, ocultar el modal y el overlay
    modal.style.display = "none";
    overlay.style.display = "none";

    closeBtn.addEventListener("click", () => {
      this.closeModal();
    });

    uploadBox.addEventListener("click", () => {
      imageInput.click();
    });

    imageInput.addEventListener("change", () => {
      if (imageInput.files && imageInput.files.length > 0) {
        uploadBox.textContent = `Selected: ${imageInput.files[0].name}`;
        uploadBox.style.color = "#5c5cff";
        uploadBox.style.fontStyle = "normal";
      }
    });

    window.addEventListener("open-modal", () => {
      this.openModal();
    });

    // Cerrar modal al hacer clic en el overlay
    overlay.addEventListener("click", () => {
      this.closeModal();
    });
  }

  openModal() {
    const modal = this.shadowRoot!.getElementById("modal")!;
    const overlay = this.shadowRoot!.getElementById("overlay")!;

    // Mostrar el modal y overlay
    modal.style.display = "flex";
    overlay.style.display = "block";

    // Aplicar la animación después de un pequeño retraso para permitir que el display tome efecto
    setTimeout(() => {
      modal.classList.add("visible");
      overlay.classList.add("visible");
    }, 10);
  }

  closeModal() {
    const modal = this.shadowRoot!.getElementById("modal")!;
    const overlay = this.shadowRoot!.getElementById("overlay")!;

    // Eliminar las clases para iniciar la animación de salida
    modal.classList.remove("visible");
    overlay.classList.remove("visible");

    // Esperar a que termine la animación antes de ocultar completamente
    setTimeout(() => {
      modal.style.display = "none";
      overlay.style.display = "none";
    }, 300);
  }
}

export default PostModal;
