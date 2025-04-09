class PostModal extends HTMLElement {
  //This variable stores the page scroll position when the modal is opened.
  private scrollPosition: number = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    // Ensure the modal is hidden initially
    const modal = this.shadowRoot!.querySelector("#modal") as HTMLElement;
    const overlay = this.shadowRoot!.querySelector("#overlay") as HTMLElement;

    if (modal && overlay) {
      modal.style.display = "none";
      overlay.style.display = "none";
    }

    this.setupEventListeners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
        <link rel="stylesheet" href="/styles/components/PostModal.css">
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
  }

  setupEventListeners() {
    const modal = this.shadowRoot!.getElementById("modal")!;
    const overlay = this.shadowRoot!.getElementById("overlay")!;
    const closeBtn = this.shadowRoot!.getElementById("close-btn")!;
    const uploadBox = this.shadowRoot!.getElementById("upload-box")!;
    const imageInput = this.shadowRoot!.getElementById("image-input") as HTMLInputElement;

    // Close with the X button
    closeBtn.addEventListener("click", () => {
      this.closeModal();
    });

    // Close when the overlay is clicked (outside the modal)
    overlay.addEventListener("click", () => {
      this.closeModal();
    });

    // Prevent clicks inside the modal from closing the modal (stop the propagation)
    modal.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close with the Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display !== "none") {
        this.closeModal();
      }
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
  }

  openModal() {
    const modal = this.shadowRoot!.getElementById("modal")!;
    const overlay = this.shadowRoot!.getElementById("overlay")!;

    // Show the modal and the overlay
    modal.style.display = "flex";
    overlay.style.display = "block";

    // Fix the body to prevent scroll but keep the scrollbar visible
    document.body.style.position = "fixed";
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = "100%";

    this.animateIn();
  }

  closeModal() {
    this.animateOut().then(() => {
      const modal = this.shadowRoot!.getElementById("modal")!;
      const overlay = this.shadowRoot!.getElementById("overlay")!;

      // Hide the modal and the overlay
      modal.style.display = "none";
      overlay.style.display = "none";

      // Restore the normal body position and scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, this.scrollPosition);
    });
  }

  animateIn() {
    const modal = this.shadowRoot!.getElementById("modal") as HTMLElement;
    this.shadowRoot!.host.classList.add("visible");

    if (modal) {
      // Set initial values for the animation
      modal.style.opacity = "0";
      modal.style.transform = "translate(-50%, -50%) translateY(20px) scale(0.95)";

      // Apply the animation after a brief delay
      setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.transform = "translate(-50%, -50%) scale(1)";
      }, 10);
    }
  }

  animateOut() {
    return new Promise<void>((resolve) => {
      const modal = this.shadowRoot!.getElementById("modal") as HTMLElement;
      this.shadowRoot!.host.classList.remove("visible");

      if (modal) {
        modal.style.opacity = "0";
        modal.style.transform = "translate(-50%, -50%) translateY(20px) scale(0.95)";
      }

      // Resolve the promise after completing the animation
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
}

export default PostModal;
