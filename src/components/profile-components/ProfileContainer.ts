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
            <style>
                :host {
                    display: block;
                    width: 100%;
                    min-height: 100vh;
                }

                .profile-container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .posts-container {
                background-color: #EFF0FD;
                border-radius: 30px;
                    padding: 20px;
                }

                @media (max-width: 568px) {
                    .profile-container {
                        max-width: 100%;
                    }

                    .posts-container {
                        margin: 0 10px;
                        padding: 10px;
                    }
                }
            </style>
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
      // Aquí la lógica para manejar la creación de un nuevo post
      console.log("New post button clicked");
    });
  }
}

export default ProfileContainer;
