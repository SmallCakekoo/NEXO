import { PostActions } from "../flux/PostActions";
import { store, State } from "../flux/Store";
import { NavigationActions } from "../flux/NavigationActions";

class CommentsDetailPage extends HTMLElement {
  private liked: boolean = false;
  private postData: any = null;
  private postId: string = "";
  private fromProfile: boolean = false;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  connectedCallback() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
    this.loadPostData();
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private handleStoreChange(state: State) {
    if (state.posts && this.postData) {
      const updatedPost = state.posts.find((post) => post.id === this.postData.id);
      if (updatedPost) {
        this.postData = updatedPost;
        this.checkUserLikeStatus();
        this.render();
      }
    }
  }

  async loadPostData() {
    const storedPost = store.getCurrentPost();
    if (storedPost) {
      this.postData = storedPost;
      this.postId = this.postData.id;
      this.fromProfile = store.getFromProfile();
      this.checkUserLikeStatus();
      
      // Load comments from Firebase
      try {
        await store.loadCommentsForPost(this.postId);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
      
      this.render();
      this.setupEventListeners();
      return;
    }

    await this.fetchPostData();
  }

  async fetchPostData() {
    try {
      if (this.postId) {
        const post = store.getPostById(this.postId);
        if (post) {
          this.postData = post;
          this.fromProfile = store.getFromProfile();
          this.checkUserLikeStatus();
          
          // Load comments from Firebase
          await store.loadCommentsForPost(this.postId);
          
          this.render();
          this.setupEventListeners();
        } else {
          console.error("Post not found");
          NavigationActions.navigate("/feed");
        }
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
      NavigationActions.navigate("/feed");
    }
  }

  private checkUserLikeStatus() {
    const state = store.getState();
    const loggedInUser = state.auth.user;
    if (loggedInUser && this.postData && this.postData.id) {
      const userLikes = store.getUserLikes(loggedInUser.username);
      this.liked = userLikes.includes(this.postData.id);
    } else {
      this.liked = false;
    }
  }

  setupEventListeners() {
    const backButton = this.shadowRoot?.querySelector("back-button");
    const likeButton = this.shadowRoot?.querySelector(".just-likes");
    const commentInput = this.shadowRoot?.querySelector("comment-form");

    backButton?.addEventListener("click", () => {
      const fromProfile = store.getFromProfile();
      const targetRoute = fromProfile ? "/profile" : "/feed";
      store.setFromProfile(false); // Reseteamos el flag
      NavigationActions.navigate(targetRoute);
    });

    likeButton?.addEventListener("click", () => {
      const state = store.getState();
      const loggedInUser = state.auth.user;
      if (!loggedInUser || !this.postData || !this.postData.id) {
        console.warn("Cannot toggle like: user not logged in or post data missing.");
        return;
      }

      const userId = loggedInUser.username;
      const postId = this.postData.id;
      const userLikes = store.getUserLikes(userId);
      const hasLiked = userLikes.includes(postId);

      if (hasLiked) {
        PostActions.unlikePost(postId, userId);
      } else {
        PostActions.likePost(postId, userId);
      }
    });
  }

  render() {
    // Valores por defecto si no hay datos
    const post = this.postData || {
      photo: "https://i.pravatar.cc/150?img=3",
      name: "Juan Telón",
      date: "16/03/25",
      career: "Multimedia Engineering",
      semestre: "Semester 6",
      message: "Did anyone else stumble against a guy using boots in the stairs???",
      tag: "Daily Life",
      likes: 19,
    };

    // Obtener el número actual de likes del store
    const currentState = store.getState();
    const updatedPost = currentState.posts?.find((p) => p.id === post.id);
    const currentLikes = updatedPost ? updatedPost.likes : post.likes;

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
          width: calc(100% - 20px);
          margin: 20px auto 40px auto;
          padding: 25px 20px;
          background-color: #f8f9fd;
          border-radius: 20px;
          box-sizing: border-box;
        }
        
        .back-button-container {
          margin: 1rem 0;
        }
        
        .post-container {
          background-color: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(83, 84, 237, 0.1);
          width: 100%;
          max-width: 740px;
          height: auto;
          min-height: 240px;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
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
          flex-wrap: wrap;
          gap: 0.5rem;
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
          word-wrap: break-word;
        }
        
        .footer {
          display: flex;
          justify-content: center;
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
          transform: scale(1.05);
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
        
        @media (max-width: 768px) {
          .container {
            width: calc(100% - 16px);
            margin: 10px auto 30px auto;
            padding: 15px 10px;
            border-radius: 15px;
          }
          
          .post-container {
            padding: 1rem;
          }
          
          .user-container {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .the-career {
            margin-top: 0.5rem;
            margin-left: 60px; /* Alinea con la imagen de perfil */
          }
          
          h1 {
            font-size: 1.8rem;
            margin: 1.5rem 0;
          }
          
          .post-content {
            font-size: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            width: calc(100% - 10px);
            margin: 5px auto 20px auto;
            padding: 10px 8px;
            border-radius: 12px;
          }
          
          .post-container {
            padding: 0.8rem;
            min-height: 200px;
          }
          
          .profile-picture {
            width: 40px;
            height: 40px;
          }
          
          .name {
            font-size: 0.9rem;
          }
          
          .date {
            font-size: 0.8rem;
          }
          
          .the-career {
            margin-left: 50px;
          }
          
          .career, .semestre {
            font-size: 0.7rem;
          }
          
          .post-content {
            font-size: 0.95rem;
            line-height: 1.5;
          }
          
          .likes-count, .share-count {
            font-size: 0.75rem;
          }
          
          .just-likes, .just-share {
            padding: 3px 6px;
          }
          
          .like-icon, .share-icon {
            width: 18px;
            height: 18px;
          }
          
          .tag {
            font-size: 0.65rem;
            padding: 3px 10px;
          }
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
                <img class="profile-picture" src="${post.photo}" alt="${post.name}">
                <div class="name-container">
                  <p class="name">${post.name}</p>
                  <p class="date">${post.date}</p>
                </div>
              </div>

              <div class="the-career">
                <p class="career">${post.career}</p>
                <p class="semestre">${post.semestre}</p>
              </div>
            </div>

            <div class="message-container">
              <p class="post-content">${post.message}</p>
            </div>
          </div>

          <p class="tag">${post.tag}</p>
          <div class="footer">  
            <div class="align-likes">
              <button class="just-likes">
                <svg class="like-icon ${this.liked ? "liked" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-width="2"/>
                </svg>
                <p class="likes-count">${currentLikes} Likes</p>
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
        
        <comments-container post-id="${this.postId}"></comments-container>
      </div>
    `;
  }
}

export default CommentsDetailPage;

