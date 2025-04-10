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
    this.shadowRoot!.innerHTML = `
     <style>
     @import url("../colors.css");

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
  border-radius: 30px;
  padding: 20px;
}

@media (max-width: 576px) {
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
                    <feed-post
                        photo="https://picsum.photos/seed/picsum/200/300"
                        name="Rosa Elvira"
                        date="2 hours ago"
                        career="Medicine"
                        semestre="2nd"
                        message="Did anyone else stump against a guy using boots in the stairs???"
                        tag="Daily Life"
                        likes="19"
                    ></feed-post>
                    <feed-post
                        photo="https://picsum.photos/seed/picsum/200/300"
                        name="Rosa Elvira"
                        date="Yesterday"
                        career="Medicine"
                        semestre="2nd"
                        message="Looking for study partners for the anatomy exam next week. DM me if interested!"
                        tag="Daily Life"
                        likes="32"
                    ></feed-post>
                    <feed-post
                        photo="https://picsum.photos/seed/picsum/200/300"
                        name="Rosa Elvira"
                        date="Last week"
                        career="Medicine"
                        semestre="2nd"
                        message="Just finished my first lab session! So excited to continue learning."
                        tag="Academic"
                        likes="45"
                    ></feed-post>
                </div>
            <floating-btn></floating-btn>
            </div>
        `;
  }

  // Sets up event listeners for the floating action button, but it's not working for now.
  setupEventListeners() {
    const fab = this.shadowRoot!.querySelector("floating-btn");
    fab?.addEventListener("new-post-click", () => {
      console.log("New post button clicked");
    });
  }
}

export default ProfileContainer;
