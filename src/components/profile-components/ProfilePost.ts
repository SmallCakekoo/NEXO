import { Post, Comment } from "../../types/feed/feeds.types";
import { NavigationActions } from "../../flux/NavigationActions";
import { PostActions } from "../../flux/PostActions";
import { store } from "../../flux/Store";

class ProfilePost extends HTMLElement {
  post: Post;
  liked: boolean = false;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.post = {
      id: "",
      photo: "",
      name: "",
      career: "",
      semestre: "",
      message: "",
      tag: "",
      likes: 0,
      date: "",
      share: "",
      comments: [],
      image: null,
      video: null,
      mediaType: null,
    };
  }

  static get observedAttributes(): string[] {
    return [
      "id",
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
      "image",
      "video",
      "mediatype",
    ];
  }

  attributeChangedCallback(
    propName: keyof Post,
    _oldValue: string | number,
    newValue: string | number
  ) {
    if (propName === "likes") {
      this.post.likes = newValue ? Number(newValue) : 0;
    } else if (propName === "comments") {
      try {
        this.post.comments = JSON.parse(newValue as string);
      } catch {
        this.post.comments = [];
      }
    } else if (propName === "image") {
      this.post.image = newValue as string;
    } else if (propName === "video") {
      this.post.video = newValue as string;
    } else if (propName === "mediaType") {
      this.post.mediaType = newValue as "image" | "video";
    } else if (typeof newValue === "string") {
      this.post[propName] = newValue;
    }

    // Actualizar el número de comentarios
    const commentsCount = this.shadowRoot?.querySelector(".comments-count");
    if (commentsCount && this.post.comments) {
      commentsCount.textContent = `${this.post.comments.length} Comments`;
    }

    this.render();
  }

  connectedCallback() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));
    this.render();
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private handleStoreChange(state: any) {
    if (this.post.id) {
      const userLikes = store.getUserLikes(state.auth.user?.username || "");
      this.liked = userLikes.includes(this.post.id);
      this.render();
    }
  }

  render() {
    if (this.shadowRoot) {
      // Check if logged in user has liked this post using Store
      const state = store.getState();
      const loggedInUser = state.auth.user;
      let userLikedPost = false;

      if (loggedInUser && this.post.id) {
        const userLikes = store.getUserLikes(loggedInUser.username);
        userLikedPost = userLikes.includes(this.post.id);
      }

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

          .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #5354ed;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: notification-enter 0.5s forwards;
          }

          @keyframes notification-enter {
            0% {
              opacity: 0;
              transform: translate(-50%, 20px);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }

          @keyframes notification-exit {
            0% {
              opacity: 1;
              transform: translate(-50%, 0);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, 20px);
            }
          }

          .notification-exit {
            animation: notification-exit 0.8s forwards;
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
              font-size: 0.75rem;
              padding: 0.3rem 0;
            }
          }
        </style>
        <div class="post">
          <div class="user-container">
            <div class="profile-container">
              <img src="${this.post.photo}" alt="Profile Picture" class="profile-picture" />
              <div class="name-container">
                <p class="name">${this.post.name}</p>
                <div class="the-career">
                  <p class="career">${this.post.career}</p>
                  <p class="semestre">${this.post.semestre}</p>
                </div>
              </div>
            </div>
            <span class="date">${this.post.date}</span>
          </div>
          <p class="message-container message">${this.post.message}</p>
          ${this.post.mediaType === 'image' && this.post.image ? `<img src="${this.post.image}" alt="Post Image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />` : ''}
          ${this.post.mediaType === 'video' && this.post.video ? `<video controls src="${this.post.video}" style="max-width: 100%; border-radius: 8px; margin-top: 10px;"></video>` : ''}
          <span class="tag">${this.post.tag}</span>
          <hr />
          <div class="footer">
            <button class="just-likes ${userLikedPost ? 'liked' : ''}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="like-icon"
              >
                <path
                  d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                  stroke="#6B7280"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="likes-count">${this.post.likes} Likes</span>
            </button>
            <button class="just-comments">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                class="comment-icon"
              >
                <path
                  d="M21 11.5C21 16.75 16.75 21 11.5 21H3L2.25 21.75L2.25 21.75L3 21H2.5C2.17 21 1.84 20.97 1.51 20.92C1.19 20.87 0.88 20.79 0.58 20.66C0.29 20.53 0.05 20.36 -0.19 20.14L-0.25 20.08L-0.25 20.08C-0.342111 19.9892 -0.424169 19.8973 -0.495254 19.8049L-0.5 19.75V19.75C-0.5 19.75 -0.5 19.75 -0.5 19.75L-0.56 19.68L-0.56 19.68C-0.65 19.56 -0.73 19.43 -0.8 19.3L-0.86 19.18C-0.93 19.04 -0.99 18.91 -1.04 18.77L-1.04 18.77C-1.12 18.5 -1.18 18.23 -1.23 17.96L-1.23 17.96C-1.29 17.63 -1.33 17.3 -1.36 16.97L-1.37 16.89L-1.37 16.89C-1.39 16.55 -1.4 16.21 -1.41 15.88L-1.41 15.88C-1.41 15.54 -1.41 15.21 -1.41 14.87V11.5C-1.41 6.25 2.84 2 8.09 2H11.5C16.75 2 21 6.25 21 11.5Z"
                  fill="#5354ED"
                  stroke="#5354ED"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="comments-count">${this.post.comments.length} Comments</span>
            </button>
            <button class="just-share">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="share-icon"
              >
                <path
                  d="M18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 6.66 16.34 8 18 8ZM6 15C7.66 15 9 13.66 9 12C9 10.34 7.66 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15ZM18 22C19.66 22 21 20.66 21 19C21 17.34 19.66 16 18 16C16.34 16 15 17.34 15 19C15 20.66 16.34 22 18 22ZM16.5 6.5L7.59 11.5L8.04 12.46L17.02 7.42L16.5 6.5ZM7.59 12.46L16.5 17.5L17.02 16.58L8.04 11.54L7.59 12.46Z"
                  fill="#5354ED"
                />
              </svg>
              <span>${this.post.share} Shares</span>
            </button>
          </div>
        </div>
      `;

      const likeButton = this.shadowRoot.querySelector(".just-likes");
      likeButton?.addEventListener("click", () => {
        const currentScrollPosition = window.scrollY;
        const state = store.getState();
        const loggedInUser = state.auth.user;

        if (!loggedInUser) {
          alert("Please log in to like posts.");
          return;
        }

        if (!this.post.id) {
          console.error("Post is missing ID, cannot like.");
          return;
        }

        const userId = loggedInUser.username;
        const postId = this.post.id;
        const userLikes = store.getUserLikes(userId);
        const hasLiked = userLikes.includes(postId);

        if (hasLiked) {
          PostActions.unlikePost(postId, userId);
        } else {
          PostActions.likePost(postId, userId);
        }

        requestAnimationFrame(() => {
          window.scrollTo(0, currentScrollPosition);
        });
      });

      const commentButton = this.shadowRoot.querySelector(".just-comments");
      commentButton?.addEventListener("click", () => {
        if (this.post.id) {
          store.saveCurrentPost(this.post);
          store.setFromProfile(true);
          NavigationActions.navigate("/comments-detail");
        }
      });

      const shareButton = this.shadowRoot.querySelector(".just-share");
      shareButton?.addEventListener("click", () => {
        navigator.clipboard
          .writeText("https://www.icesi.edu.co/")
          .then(() => {
            this.showNotification("Link copied to clipboard");
          })
          .catch((err) => {
            console.error("Error, sorry :c: ", err);
          });
      });
    }
  }

  showNotification(message: string) {
    // Create a style element for the notification styles because they were not loading
    const style = document.createElement("style");
    style.textContent = `
      .feed-post-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #5354ed;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: notification-enter 0.5s forwards;
      }
      
      @keyframes notification-enter {
        0% {
          opacity: 0;
          transform: translate(-50%, 20px);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      }
      
      @keyframes notification-exit {
        0% {
          opacity: 1;
          transform: translate(-50%, 0);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, 20px);
        }
      }
      
      .notification-exit {
        animation: notification-exit 0.8s forwards;
      }
    `;

    // Create the notification
    const notification = document.createElement("div");
    notification.className = "feed-post-notification";
    notification.textContent = message;

    // Add the styles and the notification to the body
    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Configure the disappearance
    setTimeout(() => {
      notification.classList.add("notification-exit");
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
      }, 800);
    }, 2000);
  }
}

export default ProfilePost;
