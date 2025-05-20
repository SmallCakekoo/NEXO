class ProfileHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
        this.addEventListeners();
    }
    // Adds event listener to the "edit" button to trigger navigation
    addEventListeners() {
        const editButton = this.shadowRoot.querySelector(".edit-button");
        editButton?.addEventListener("click", () => {
            const navigationEvent = new CustomEvent("navigate", {
                detail: "/profile-settings",
                bubbles: true, // Allows the event to bubble up to the parent
            });
            document.dispatchEvent(navigationEvent);
        });
    }
    render() {
        this.shadowRoot.innerHTML = `
          <link rel="stylesheet" href="/styles/components/profile/ProfileHeader.css">
            <div class="banner">
                <div class="banner-illustrations">
                    <img class="banner-image" src="/assets/images/bannerimg.png" alt="Banner image">
                </div>
            </div>
            <div class="profile-section">
                <img class="profile-picture" src="https://picsum.photos/seed/picsum/200/300" alt="Profile picture"  >
                <button class="edit-button">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <div class="profile-info">
                    <h1>Rosa Elvira</h1>
                    <p class="career">Medicine</p>
                    <p class="bio">Hi! I'm Rosa (the girl of the right). I'm a medicine student that likes to have fun. Here's my insta @Rosa_Elvira</p>
                </div>
            </div>
        `;
    }
}
export default ProfileHeader;
//# sourceMappingURL=ProfileHeader.js.map