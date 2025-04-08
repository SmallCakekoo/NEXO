class SettingsProfileHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  // Adds event listeners to the close button and the image upload
  addEventListeners() {
    const xButton = this.shadowRoot!.querySelector(".x-button");
    xButton?.addEventListener("click", () => {
      const navigationEvent = new CustomEvent("navigate", { detail: "/profile", bubbles: true });
      document.dispatchEvent(navigationEvent);
    });

    const profilePicture = this.shadowRoot!.querySelector(".profile-picture-container");
    const fileInput = this.shadowRoot!.querySelector("#profile-upload");

    profilePicture?.addEventListener("click", () => {
      (fileInput as HTMLElement).click();
    });

    // Handles the image upload (this is static and this is a simulation)
    fileInput?.addEventListener("change", () => {
      alert("Image uploaded successfully! (simulation)");
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/styles/components/profile-settings/SettingsProfileHeader.css">
            <div class="banner">
                <div class="banner-illustrations">
                    <img class="banner-image" src="/assets/images/bannerimg.png" alt="Banner image">
                </div>
            </div>
            <div class="profile-section">
                <div class="profile-picture-container">
                    <img class="profile-picture" src="https://picsum.photos/seed/picsum/200/300" alt="Profile picture">
                    <div class="profile-overlay">
                        <span>Change Image</span>
                    </div>
                    <input type="file" id="profile-upload" accept="image/*">
                </div>
                <button class="x-button">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;
  }
}

export default SettingsProfileHeader;
