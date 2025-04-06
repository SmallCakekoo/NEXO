class ProfileContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot!.innerHTML = `
     <link rel="stylesheet" href="/styles/components/profile/ProfileContainer.css">
            <div class="profile-container">
                <div class="posts-container">
                    <post-card></post-card>
                    <post-card></post-card>
                    <post-card></post-card>
                </div>
                <floating-action-button></floating-action-button>
            </div>
        `;
  }

  setupEventListeners() {
    const fab = this.shadowRoot!.querySelector("floating-action-button");
    fab?.addEventListener("new-post-click", () => {
      console.log("New post button clicked");
    });
  }
}

export default ProfileContainer;
