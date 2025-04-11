class PostModal extends HTMLElement {
  private isPublishing: boolean = false; // Flag to track if we're currently publishing
  private lastPublishTime: number = 0; // Track the timestamp of the last publish
  private lastPublishedContent: string = ""; // Track the last published content
  private publishButton: HTMLElement | null = null; // Reference to the publish button
  private static instance: PostModal | null = null; // Singleton instance
  private isListenerAttached: boolean = false; // Flag to track if event listeners are attached

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    
    // Implement singleton pattern to ensure only one instance exists
    if (PostModal.instance) {
      return PostModal.instance;
    }
    PostModal.instance = this;
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
      * {
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.titulo {
  font-family: "TTRoundsNeue", sans-serif;
  font-weight: 700;
  font-style: italic;
  font-size: clamp(24px, 2vw, 32px);
}

@font-face {
  font-family: "TTRoundsNeue";
  src: url("/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF") format("truetype");
  font-weight: 700;
  font-style: italic;
}

body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-size: clamp(12px, 2vw, 16px);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(1px);
}

.overlay.visible {
  opacity: 1;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  display: flex;
  flex-direction: column;
  background: white;
  width: clamp(379px, 50vw, 664px);
  height: clamp(380px, 60vw, 405px);
  border-radius: 27px;
  overflow: hidden;
  text-align: center;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.hidden {
  display: none !important;
}

.floating-btn {
  position: fixed;
  bottom: clamp(20px, 6vh, 60px);
  right: clamp(20px, 6vw, 70px);
  width: clamp(42px, 5vw, 60px);
  height: clamp(42px, 5vw, 60px);
  border-radius: 50%;
  background-color: #5354ed;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 999;
}

.floating-btn:hover {
  background-color: #bd02ff;
}

.floating-btn img {
  width: 23px;
  height: 23px;
}

.close-btn img {
  width: 15px;
  height: auto;
}

.modal-header {
  background: #5354ed;
  color: white;
  padding-top: 35px;
  padding-bottom: 35px;
  padding-left: clamp(20px, 2vw, 37px);
  padding-right: clamp(20px, 2vw, 37px);
  display: flex;
  height: clamp(57px, 7vh, 86px);
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1);
}

.publish-btn {
  background: white;
  color: black;
  border: 2px solid black;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  width: 137px;
  font-size: clamp(14px, 2vw, 14px);
  height: 34px;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}
.publish-btn:hover {
  background-color: #ddddfb;
  transform: translateY(-2px);
}

.publish-btn:active {
  transform: translateY(0);
}

.publish-btn img {
  width: 18px;
  margin-left: 7px;
}

.modal-body {
  padding: 15px;
}

textarea {
  width: clamp(323px, 40vw, 555px);
  height: 114px;
  padding: 5px;
  margin: 15px;
  border: 1px solid #000000;
  border-radius: 5px;
  font-size: clamp(12px, 2vw, 16px);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

textarea:focus {
  outline: none;
  border-color: #5354ed;
  box-shadow: 0 0 5px rgba(83, 84, 237, 0.5);
}

.categories {
  display: flex;
  justify-content: space-around;
  margin-top: clamp(5px, 1vw, 35px);
}

.category {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: clamp(12px, 2vw, 16px);
  transition: transform 0.2s ease;
}

.category:hover {
  transform: translateY(-2px);
}

.category input {
  display: none;
}

.category label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.category input:checked + label::before {
  background: #bd02ff url("https://api.iconify.design/lucide:check.svg?color=white") center/cover
    no-repeat;
  border: 2px solid #bd02ff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 70%;
}

.category label::before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #5354ed;
  border-radius: 50%;
  margin-right: 6px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.category input:checked + label::before::after {
  content: "✔";
  color: white;
  display: block;
  text-align: center;
}

.upload-box {
  border: 2px dashed #5354ed;
  border-radius: 50px;
  padding: 0 clamp(12px, 2vw, 20px);
  margin-top: clamp(20px, 3vw, 35px);
  margin-left: clamp(10px, 2vw, 23px);
  font-size: clamp(18px, 2vw, 24px);
  font-style: italic;
  color: #b9b9ff;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  height: clamp(43px, 10vh, 67px);
  width: clamp(325px, 45vw, 583.75px);
  font-family: "TTRoundsNeue", sans-serif;
  font-weight: 700;
  overflow: hidden;
  transition:
    border-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}

.upload-box:hover {
  border-color: #bd02ff;
  color: #9595ff;
  transform: translateY(-3px);
}

input[type="file"] {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

      </style>
      <div class="overlay" id="overlay"></div>
      <div class="modal" id="modal">
        <div class="modal-header">
          <button class="close-btn" id="close-btn">
            <img src="https://api.iconify.design/lucide:x.svg?color=white" alt="X">
          </button>
          <p class="titulo">New Post</p>
          <button class="publish-btn" id="publish-btn">
              Publish
              <img src="https://api.iconify.design/lucide:send.svg" alt="Send">
          </button>
        </div>

        <div class="modal-body">
          <textarea id="post-content" placeholder="Write something" rows="8"></textarea>

          <div class="categories">
            <div class="category">
                <input type="radio" id="Daily Life" name="category" checked>
                <label for="Daily Life">Daily Life</label>
            </div>
            <div class="category">
                <input type="radio" id="Carpool" name="category">
                <label for="Carpool">Carpool</label>
            </div>
            <div class="category">
                <input type="radio" id="Academics" name="category">
                <label for="Academics">Academics</label>
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
    this.publishButton = this.shadowRoot!.getElementById("publish-btn")!;
    const textarea = this.shadowRoot!.getElementById("post-content") as HTMLTextAreaElement;

    // Por defecto, ocultar el modal y el overlay
    modal.style.display = "none";
    overlay.style.display = "none";

    // Only set up event listeners if they're not already attached
    if (!this.isListenerAttached) {
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
      
      // Add event listener for the publish button
      this.publishButton.addEventListener("click", () => {
        this.handlePublish(textarea, imageInput, uploadBox);
      });
      
      // Mark listeners as attached
      this.isListenerAttached = true;
      console.log("PostModal event listeners attached");
    }
  }

  // Handle the publish action
  private handlePublish(
    textarea: HTMLTextAreaElement,
    imageInput: HTMLInputElement,
    uploadBox: HTMLElement
  ): void {
    // Prevent multiple rapid clicks
    const now = Date.now();
    if (now - this.lastPublishTime < 500) { // 500ms debounce
      console.log("Ignoring rapid publish attempt");
      return;
    }
    
    // Prevent concurrent publishing
    if (this.isPublishing) {
      console.log("Already publishing a post, ignoring this click");
      return;
    }
    
    this.isPublishing = true;
    this.lastPublishTime = now;
    
    try {
      const content = textarea.value.trim();
    
      if (!content) {
        alert("Post content cannot be empty.");
        return;
      }
      
      // Check if this is the same content as the last published post
      if (content === this.lastPublishedContent) {
        console.log("Same content as last published post, ignoring");
        return;
      }
      
      // Get selected category
      const selectedCategory = this.shadowRoot!.querySelector<HTMLInputElement>(
        'input[name="category"]:checked'
      )?.id || "Daily Life";
    
      // Get uploaded image (if any)
      const imageFile = imageInput.files?.[0] || null;
    
      const newPost = {
        content,
        category: selectedCategory,
        image: imageFile,
        createdAt: new Date().toISOString(),
      };
    
      console.log("Dispatching post-published event");
      
      // Store the content of this post
      this.lastPublishedContent = content;
      
      // Dispatch event to send post elsewhere
      document.dispatchEvent(new CustomEvent("post-published", {
        detail: newPost,
        bubbles: true,
        composed: true,
      }));
      
      // Reset and close modal
      textarea.value = "";
      imageInput.value = "";
      uploadBox.textContent = "Upload Image";
      uploadBox.style.color = "#b9b9ff";
      uploadBox.style.fontStyle = "italic";
      
      this.closeModal();
    } finally {
      // Always reset the publishing flag
      this.isPublishing = false;
    }
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