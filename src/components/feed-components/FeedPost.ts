import { Post } from '../../types/feed/feeds.types';

class FeedPost extends HTMLElement {
  post: Post;
  liked: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.post = {
      photo: '',
      name: '',
      career: '',
      semestre: '',
      message: '',
      tag: '',
      likes: 0,
      date: '',
      share: '',
      comments: ''
    };
  }

  static get observedAttributes(): string[] {
    return [
      'photo',
      'name',
      'career',
      'semestre',
      'message',
      'tag',
      'likes',
      'date',
      'share',
      'comments'
    ];
  }

  attributeChangedCallback(
    propName: keyof Post,
    oldValue: string | number,
    newValue: string | number
  ) {
    if (propName === 'likes') {
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
        <link rel="stylesheet" href="/styles/components/feed/FeedPost.css">
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
                <svg class="like-icon ${this.liked ? "liked" : ""}" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
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
                <p class="share-count"> Shared</p>
              </button>
            </div>
          </div>
        </div>
      `;

      const likeIcon = this.shadowRoot.querySelector(".like-icon");
      likeIcon?.addEventListener("click", () => {
        this.liked = !this.liked;
        this.render();
      });

      const commentIcon = this.shadowRoot.querySelector(".comment-icon");
      commentIcon?.addEventListener("click", () => {
        commentIcon.classList.toggle("clicked");
      });

      const shareIcon = this.shadowRoot.querySelector(".share-icon");
      shareIcon?.addEventListener("click", () => {
        shareIcon.classList.toggle("clicked");
      });
    }
  }
}

export default FeedPost; 