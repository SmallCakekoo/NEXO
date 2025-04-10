import { Post } from "../../types/feed/feeds.types";

class FeedPost extends HTMLElement {
  post: Post;
  liked: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.post = {
      photo: "",
      name: "",
      career: "",
      semestre: "",
      message: "",
      tag: "",
      likes: 0,
      date: "",
      share: "",
      comments: "",
    };
  }

  static get observedAttributes(): string[] {
    return [
      "photo",
      "name",
      "career",
      "semestre",
      "message",
      "tag",
      "likes",
      "date",
      "share",
      "comments",
    ];
  }

  attributeChangedCallback(
    propName: keyof Post,
    oldValue: string | number,
    newValue: string | number
  ) {
    if (propName === "likes") {
      this.post.likes = newValue ? Number(newValue) : 0;
    } else if (typeof newValue === "string") {
      this.post[propName] = newValue;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
        .post {
  background: white;
  border-radius: 15px;
  padding: 25px 25px 5px 25px;
  margin: 15px auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 690px;
  min-height: 190.578px;
  border: 0.125rem solid rgba(0, 0, 0, 0.56);
  display: block;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin: 0;
  gap: 0.5rem;
}

.message-container {
  font-size: 0.95rem;
  margin: 0;
}

.message {
  margin: 0;
}

.like-container {
  display: flex;
  align-items: center;
  gap: 10px;
  align-items: flex-button;
  border: none;
  background: none;
}

.profile-picture {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.name {
  color: black;
  font-weight: bold;
  margin: 0;
  font-size: 1rem;
  display: inline-block;
}

.like-icon path {
  color: #6b7280;
  transition: all 0.3s ease;
  stroke: #5354ed;
  stroke-width: 2;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 5px 10px;
}
.liked path {
  fill: #5354ed;
}

.likes-count {
  margin-bottom: 0.5rem;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  border: 2px solid rgba(31, 31, 241, 0.57);
  border-radius: 0.85rem;
  color: rgba(31, 31, 241, 0.57);
  background-color: rgb(255, 255, 255);
  font-weight: 500;
  font-size: 0.7rem;
  text-align: center;
  margin: 1rem 0;
  position: relative;
  z-index: 1;
}
.user-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  justify-content: space-between;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  align-items: flex-start;
}

.career {
  color: black;
  font-weight: bold;
  align-items: flex-start;
  padding: 0;
  margin: 0;
}

.semestre {
  color: black;
  font-weight: bold;
  padding: 0;
  margin: 0;
}

.the-career {
  text-align: right;
  display: flex;
  gap: 0.2rem;
  font-size: 14px;
}

.name-container {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.date {
  display: inline-block;
  transform: translateY(-10px);
  font-size: 0.95rem;
  color: #666;
}

.just-likes,
.just-comments,
.just-share {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: bold;
  padding: 0.5rem 0;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.just-likes:hover,
.just-comments:hover,
.just-share:hover {
  transform: scale(1.03);
}

.just-likes:active,
.just-comments:active,
.just-share:active {
  transform: scale(0.97);
}

.comment-icon path,
.share-icon path {
  transition: fill 0.3s ease;
  fill: #5354ed;
}

.just-likes:hover .comment-icon path {
  fill: #3a3b9e;
}

.just-likes:active .comment-icon path {
  fill: #2d2e7a;
}

.liked path {
  fill: #5354ed;
}

.attributes-container {
  display: flex;
  flex-direction: column;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 0;
  width: 100%;
  position: relative;
  z-index: 0;
}

.like-icon {
  transition: all 0.3s ease;
}

.like-icon:hover {
  transform: scale(1.1);
}

.just-likes:active .like-icon {
  transform: scale(0.9);
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

.liked .just-likes {
  animation: heartBeat 1s ease;
}

.liked .like-icon path {
  fill: #5354ed;
  stroke: #5354ed;
}

@media (max-width: 576px) {
  .post {
    width: 90%;
    padding: 15px 15px 5px 15px;
    margin: 10px auto;
  }

  .user-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .profile-container {
    width: auto;
    justify-content: flex-start;
  }

  .the-career {
    text-align: right;
    margin-top: 0;
    align-self: flex-start;
    min-width: fit-content;
  }

  .message-container {
    font-size: 0.9rem;
  }

  .footer {
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 10px;
  }

  .just-likes,
  .just-comments,
  .just-share {
    flex: 1;
    justify-content: center;
    padding: 0.3rem 0;
    font-size: 0.8rem;
  }

  .tag {
    font-size: 0.65rem;
    padding: 3px 10px;
    margin: 0.5rem 0;
  }

  .profile-picture {
    width: 40px;
    height: 40px;
  }

  .name {
    font-size: 0.95rem;
  }

  .date {
    font-size: 0.85rem;
    transform: translateY(0);
  }
}

        </style>
        <div class="post">
          <div class="attributes-container">
            <div class="user-container"> 
              <div class="profile-container">
                <img class="profile-picture" src="${this.post.photo}" alt="Profile Picture">
                <div class="name-container">
                  <p class="name">${this.post.name}</p>
                  <p class="date">${this.post.date}</p>
                </div>
              </div>

              <div class="the-career">
                <p class="career">${this.post.career}</p>
                <p class="semestre">${this.post.semestre}</p>
              </div>
            </div>

            <div class="message-container">
              <p class="message">${this.post.message}</p>
            </div>
          </div>

          <p class="tag">${this.post.tag}</p>
          
          <hr>
          <div class="footer">  
             <div class="align-likes">
              <button class="just-likes">
                <svg class="like-icon ${this.liked ? "liked" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-width="2"/>
                </svg>
                <p class="likes-count">${this.post.likes} Likes</p>
              </button>
            </div>  

            <div class="align-comments">
              <button class="just-comments">
                <svg class="comment-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                <p class="comments-count">Comment</p>
              </button>
            </div>

            <div class="align-share">
              <button class="just-share">
                <svg class="share-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
                </svg>
                <p class="share-count">Shared</p>
              </button>
            </div>
          </div>
        </div>
      `;

      const likeButton = this.shadowRoot.querySelector(".just-likes");
      likeButton?.addEventListener("click", () => {
        this.liked = !this.liked;
        this.render();
      });

      const commentIcon = this.shadowRoot.querySelector(".comment-icon");
      commentIcon?.addEventListener("click", () => {
        // Something to do
      });

      const shareIcon = this.shadowRoot.querySelector(".share-icon");
      shareIcon?.addEventListener("click", () => {
        // Something to do
      });
    }
  }
}

export default FeedPost;
