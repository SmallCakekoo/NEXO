import { FeedActions } from "../../flux/FeedActions";
import { store } from "../../flux/Store";
import { PostActions } from "../../flux/PostActions";

class PostModal extends HTMLElement {
  private isRendered: boolean = false;
  private isOpen: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.isRendered = true;
    this.setupStoreSubscription();
  }

  setupStoreSubscription() {
    store.subscribe((state) => {
      // Solo actualizar si el estado del modal ha cambiado
      if (this.isRendered && state.postModal.isOpen !== this.isOpen) {
        this.isOpen = state.postModal.isOpen;
        if (this.isOpen) {
          this.openModal();
        } else {
          this.closeModal();
        }
      }
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        * {
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .modal-overlay {
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
          display: none;
        }

        .modal-overlay.visible {
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
          width: 550px;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1001;
          opacity: 0;
          transition: all 0.3s ease;
          display: none;
        }

        .modal.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .modal-header {
          background: var(--nexopurple, #5354ED);
          color: white;
          padding: 25px 30px;
          font-size: 28px;
          font-weight: bold;
          font-style: italic;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn img {
          width: 24px;
          height: 24px;
          filter: brightness(0) invert(1);
          transition: transform 0.2s ease;
        }

        .close-btn:hover img {
          transform: scale(1.1);
        }

        .modal-body {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 25px;
          position: relative;
        }

        .textarea-container {
          position: relative;
          width: 100%;
        }

        textarea {
          width: 100%;
          height: 120px;
          padding: 20px;
          padding-bottom: 60px;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          font-size: 16px;
          resize: none;
          transition: border-color 0.2s ease;
          background: #FFFFFF;
        }

        textarea:focus {
          outline: none;
          border-color: var(--nexopurple, #5354ED);
        }

        textarea::placeholder {
          color: #9E9E9E;
          font-size: 16px;
        }

        .categories {
          display: flex;
          justify-content: flex-start;
          gap: 40px;
          padding: 0 10px;
        }

        .category {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .category input[type="radio"] {
          appearance: none;
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border: 2px solid var(--nexopurple, #5354ED);
          border-radius: 50%;
          margin: 0;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category input[type="radio"]:checked {
          background-color: var(--nexopurple, #5354ED);
          border-width: 7px;
        }

        .category label {
          font-size: 16px;
          color: #000000;
          cursor: pointer;
          font-weight: 500;
        }

        .upload-box {
          border: 2px dashed var(--nexopurple, #5354ED);
          border-radius: 50px;
          padding: 15px;
          text-align: center;
          color: var(--nexopurple, #5354ED);
          cursor: pointer;
          transition: all 0.2s ease;
          font-style: italic;
          opacity: 0.6;
          font-size: 16px;
        }

        .upload-box:hover {
          opacity: 1;
          background-color: rgba(83, 84, 237, 0.05);
        }

        .publish-btn {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background-color: var(--nexopurple, #5354ED);
          color: white;
          font-size: 14px;
          border: 2px solid black;
          padding: 7px 30px;
          border-radius: 50px;
          cursor: pointer;
          outline: none;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
        }

        .publish-btn:hover {
          filter: brightness(1.2);
          transform: scale(1.05);
          -webkit-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
          -moz-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
          box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
        }

        .publish-btn:active {
          transform: scale(0.95);
          -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
          -moz-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
          box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
          filter: brightness(0.8);
        }

        .publish-btn img {
          width: 18px;
          height: 18px;
          filter: brightness(0) invert(1);
          margin-left: 8px;
        }

        input[type="file"] {
          display: none;
        }

        @media (max-width: 600px) {
          .modal {
            width: 90%;
            margin: 20px;
          }

          .categories {
            gap: 20px;
          }
        }
      </style>

      <div class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            New Post
            <button class="close-btn">
              <img src="https://api.iconify.design/lucide:x.svg" alt="Close">
            </button>
          </div>
          <div class="modal-body">
            <div class="textarea-container">
              <textarea id="post-content" placeholder="Write something"></textarea>
              <button class="publish-btn">
                Post
                <img src="https://api.iconify.design/lucide:send.svg" alt="Send">
              </button>
            </div>
            <div class="categories">
              <div class="category">
                <input type="radio" id="daily-life" name="category" value="Daily Life" checked>
                <label for="daily-life">Daily Life</label>
              </div>
              <div class="category">
                <input type="radio" id="carpool" name="category" value="Carpool">
                <label for="carpool">Carpool</label>
              </div>
              <div class="category">
                <input type="radio" id="academics" name="category" value="Academics">
                <label for="academics">Academics</label>
              </div>
            </div>
            <label class="upload-box" for="file-upload">
              Upload Image
              <input type="file" id="file-upload" accept="image/*">
            </label>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeButton = this.shadowRoot?.querySelector(".close-btn");
    const overlay = this.shadowRoot?.querySelector(".modal-overlay");
    const publishButton = this.shadowRoot?.querySelector(".publish-btn");
    const textarea = this.shadowRoot?.querySelector("#post-content") as HTMLTextAreaElement;
    const fileUpload = this.shadowRoot?.querySelector("#file-upload") as HTMLInputElement;
    const categories = this.shadowRoot?.querySelectorAll(
      'input[name="category"]'
    ) as NodeListOf<HTMLInputElement>;

    if (!closeButton || !overlay || !publishButton || !textarea || !fileUpload || !categories) {
      return;
    }

    // Cerrar modal con el botón X
    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      FeedActions.closePostModal();
    });

    // Cerrar modal haciendo clic fuera
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        FeedActions.closePostModal();
      }
    });

    // Publicar post
    publishButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Preview de imagen
    fileUpload.addEventListener("change", (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Aquí podrías agregar una vista previa de la imagen si lo deseas
      }
    });
  }

  openModal() {
    console.log("PostModal: Abriendo modal");
    const overlay = this.shadowRoot?.querySelector(".modal-overlay") as HTMLDivElement;
    const modal = this.shadowRoot?.querySelector(".modal") as HTMLDivElement;

    if (!overlay || !modal) {
      console.error("PostModal: No se encontraron los elementos del modal al intentar abrir");
      return;
    }

    overlay.style.display = "block";
    modal.style.display = "block";

    // Dar tiempo al navegador para procesar el cambio de display
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
      modal.classList.add("visible");
    });
  }

  closeModal() {
    const overlay = this.shadowRoot?.querySelector(".modal-overlay") as HTMLDivElement;
    const modal = this.shadowRoot?.querySelector(".modal") as HTMLDivElement;

    if (!overlay || !modal) {
      console.error("PostModal: No se encontraron los elementos del modal al intentar cerrar");
      return;
    }

    overlay.classList.remove("visible");
    modal.classList.remove("visible");

    setTimeout(() => {
      overlay.style.display = "none";
      modal.style.display = "none";
    }, 300);
  }

  private async handleSubmit() {
    const content = (this.shadowRoot!.querySelector('textarea') as HTMLTextAreaElement).value;
    const category = (this.shadowRoot!.querySelector('input[name="category"]:checked') as HTMLInputElement)?.value;
    const imageInput = this.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];

    if (!content || !category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await PostActions.uploadPostImage(imageFile);
      }

      await store.createPost({
        content,
        category,
        image: imageUrl,
        createdAt: new Date().toISOString()
      });

      this.closeModal();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  }
}

export default PostModal;
