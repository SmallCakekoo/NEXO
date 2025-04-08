class PostModal extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.shadowRoot!.innerHTML = `
        <link rel="stylesheet" href="/styles/components/new-post.css">
        <div class="modal hidden" id="modal">
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
      const closeBtn = this.shadowRoot!.getElementById("close-btn")!;
      const uploadBox = this.shadowRoot!.getElementById("upload-box")!;
      const imageInput = this.shadowRoot!.getElementById("image-input") as HTMLInputElement;
  
      closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
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
        modal.classList.remove("hidden");
      });
    }
  }
  
  export default PostModal;
  