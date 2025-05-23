class CommentsDetailPage extends HTMLElement {
  private liked: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const backButton = this.shadowRoot?.querySelector("back-button");
    const likeButton = this.shadowRoot?.querySelector(".just-likes");
    const commentInput = this.shadowRoot?.querySelector("comment-form");

    // Handle back button to preserve scroll position
    backButton?.addEventListener("click", () => {
      sessionStorage.setItem("returnToFeed", "true");
    });

    // Handle like button toggle
    likeButton?.addEventListener("click", () => {
      this.liked = !this.liked;
      const likeIcon = this.shadowRoot?.querySelector(".like-icon");
      const likesCount = this.shadowRoot?.querySelector(".likes-count");

      if (likeIcon) {
        if (this.liked) {
          likeIcon.classList.add("liked");
          if (likesCount) {
            likesCount.textContent = "20 Likes";
          }
        } else {
          likeIcon.classList.remove("liked");
          if (likesCount) {
            likesCount.textContent = "19 Likes";
          }
        }
      }
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
          min-height: 100vh;
          background-color: white;
          --nexopurple: #5354ed;
          --nexowhite: white;
        }
        
        h1 {
          color: #5354ed;
          text-align: center;
          margin: 2rem 0;
          font-size: 2.2rem;
          font-weight: 700;
        }
        
        .container {
          max-width: 850px;
          margin: 20px 16px 40px 16px;
          padding: 25px 20px;
          background-color: #f8f9fd;
          border-radius: 20px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .back-button-container {
          margin: 1rem 0;
        }
        
        .post-container {
          background-color: white;
          border-radius: 16px;
          padding: 1.5rem 1.5rem 0.2rem 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(83, 84, 237, 0.1);
          width: 740px;
          height: 240px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .attributes-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .user-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .profile-container {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .name-container {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .profile-picture {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .name {
          font-weight: 600;
          margin: 0;
        }

        .date {
          color: #5354ed;
          font-size: 0.9rem;
          margin: 0;
        }

        .the-career {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.2rem;
        }

        .career, .semestre {
          font-size: 0.75rem;
          color: black;
          font-weight: bold;
          align-items: flex-start;
          padding: 0;
          margin: 0;
        }

        .message-container {
          margin-top: 1rem;
        }
        
        .post-content {
          font-size: 1.1rem;
          line-height: 1.6;
          margin: 0;
        }
        
        .footer {
          display: flex;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid #f0f0f0;
        }
        
        .align-likes, .align-share {
          display: flex;
          align-items: center;
        }
        
        .just-likes, .just-share {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .just-likes:hover, .just-share:hover {
          background-color: rgba(83, 84, 237, 0.1);
        }
        
        .like-icon {
          stroke: #5354ed;
          fill: none;
          transition: all 0.2s ease;
        }
        
        .like-icon.liked {
          fill: #5354ed;
          stroke: #5354ed;
        }

        .share-icon path {
          transition: fill 0.3s ease;
          fill: #5354ed;
        }
        
        .likes-count, .share-count {
          margin: 0;
          font-size: 0.85rem;
          font-weight: bold;
          color: #6b7280;
          cursor: pointer;
        }

        .tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 0.85rem;
          font-size: 0.7rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          background-color: rgb(255, 255, 255);
          border: 2px solid rgba(31, 31, 241, 0.57);
          color: rgba(31, 31, 241, 0.57);
          text-align: center;
          margin: 1rem 0;
          position: relative;
          z-index: 1;
        }
      </style>
      
      <nav-bar></nav-bar>
      
      <div class="container">
        <div class="back-button-container">
          <back-button></back-button>
        </div>
        
        <div class="post-container">
          <div class="attributes-container">
            <div class="user-container">
              <div class="profile-container">
                <img class="profile-picture" src="https://i.pravatar.cc/150?img=3" alt="Juan Telón">
                <div class="name-container">
                  <p class="name">Juan Telón</p>
                  <p class="date">16/03/25</p>
                </div>
              </div>

              <div class="the-career">
                <p class="career">Multimedia Engineering</p>
                <p class="semestre">Semester 6</p>
              </div>
            </div>

            <div class="message-container">
              <p class="post-content">Did anyone else stumble against a guy using boots in the stairs???</p>
            </div>
          </div>

          <p class="tag">Daily Life</p>
          <div class="footer">  
            <div class="align-likes">
              <button class="just-likes">
                <svg class="like-icon ${this.liked ? "liked" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-width="2"/>
                </svg>
                <p class="likes-count">19 Likes</p>
              </button>
            </div>  

            <div class="align-share">
              <button class="just-share">
                <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
                </svg>
                <p class="share-count">Share</p>
              </button>
            </div>
          </div>
        </div>
        
        <comments-container></comments-container>
      </div>
    `;
  }
}

export default CommentsDetailPage;
