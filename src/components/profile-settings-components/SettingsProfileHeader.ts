class SettingsProfileHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

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

    fileInput?.addEventListener("change", () => {
      alert("Image uploaded successfully! (simulation)");
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    overflow-x: hidden;
                }

                .banner {
                    width: 100vw;
                    height: 200px;
                    background-color: #FFA500;
                    position: relative;
                    overflow: hidden;
                    left: 50%;
                    right: 50%;
                    margin-left: -50vw;
                    margin-right: -50vw;
                }

                .banner-illustrations {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                
                .banner-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                  @media (max-width: 768px) {
                    .banner-image {
                        content: url('/assets/images/bannerimgsmall.png');
                    }
                }

                .profile-section {
                    text-align: center;
                    margin-top: -50px;
                    position: relative;
                    
                }

                .profile-picture-container {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border: 4px solid white;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                    cursor: pointer;
                    overflow: hidden;
                }

                .profile-picture {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    background-color: white;
                    transition: filter 0.3s ease;
                }

                .profile-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    color: white;
                    font-size: 0.8rem;
                    font-weight: bold;
                }

                .profile-picture-container:hover .profile-overlay {
                    opacity: 1;
                }

                .profile-picture-container:hover .profile-picture {
                    filter: brightness(0.8);
                }

                #profile-upload {
                    display: none;
                }

                .x-button {
                    position: absolute;
                    right: 30%;
                    top: 30px;
                    background: #6366F1;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 3;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .x-button:hover {
                    transform: scale(1.1) rotate(90deg);
                    background: #5354ED;
                    box-shadow: 3px 3px 15px -6px rgba(0, 0, 0, 0.4);
                }

                .x-button:active {
                    transform: scale(0.95);
                    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                }

                .x-button svg {
                    width: 20px;
                    height: 20px;
                    fill: white;
                    transition: all 0.3s ease;
                }

                .x-button:hover svg {
                    fill: #ffffff;
                }

                .profile-info {
                    background-color: white;
                    padding: 20px;
                }

                h1 {
                    margin: 10px 0;
                    color: #1F2937;
                    font-size: 1.5rem;
                }

                .career {
                    color: #6B7280;
                    margin: 5px 0;
                }

                .bio {
                    color: #4B5563;
                    margin: 15px 0;
                    font-size: 0.9rem;
                }
            </style>
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
