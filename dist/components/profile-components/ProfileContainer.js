class ProfileContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }
    // This is static for now, but it will be dynamic in the future jiji
    render() {
        this.shadowRoot.innerHTML = `
     <link rel="stylesheet" href="/styles/components/profile/ProfileContainer.css">
            <div class="profile-container">
                <div class="posts-container">
                    <post-card></post-card>
                    <post-card></post-card>
                    <post-card></post-card>
                </div>
            <floating-btn></floating-btn>
            </div>
        `;
    }
    // Sets up event listeners for the floating action button, but it's not working for now.
    setupEventListeners() {
        const fab = this.shadowRoot.querySelector("floating-action-button");
        fab?.addEventListener("new-post-click", () => {
            console.log("New post button clicked");
        });
    }
}
export default ProfileContainer;
//# sourceMappingURL=ProfileContainer.js.map