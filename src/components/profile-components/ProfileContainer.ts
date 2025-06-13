import { Post } from "../../types/feed/feeds.types";
import { AppDispatcher } from "../../flux/Dispatcher";
import { PostActionTypes } from "../../types/feed/PostActionTypes";
import { store, State } from "../../flux/Store";

class ProfileContainer extends HTMLElement {
  private posts: Post[] = [];
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  connectedCallback() {
    this.subscribeToStore();
    this.setupEventListeners();
    
    // Load profile posts when component is first mounted
    store.loadProfilePosts();
    
    // Listen for profile updates
    document.addEventListener('profile-updated', () => {
      console.log("ProfileContainer: 'profile-updated' event received. Loading posts.");
      store.loadProfilePosts();
    });

    // Listen for navigation events to reload posts when returning to profile
    document.addEventListener('navigate', (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail === '/profile') {
        console.log("ProfileContainer: 'navigate' to profile event received. Loading posts.");
        store.loadProfilePosts();
      }
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
  }

  private handleStoreChange(state: State) {
    this.posts = store.getProfilePosts();
    this.render();
  }

  private setupEventListeners() {
    // Add any additional event listeners if needed
  }

  render() {
    const postsHTML = this.posts
      .map(
        (post: Post) => `
      <profile-post
        ${post.id ? `id="${post.id}"` : ""}
        photo="${post.photo}"
        name="${post.name}"
        date="${post.date}"
        career="${post.career}"
        semestre="${post.semestre}"
        message="${post.message}"
        tag="${post.tag}"
        likes="${post.likes}"
        share="${post.share}"
        comments="${JSON.stringify(post.comments)}"
        image="${post.image || ''}"
      ></profile-post>
    `
      )
      .join("");

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
                    ${postsHTML}
                </div>
            <floating-btn></floating-btn>
            <post-modal></post-modal>
            </div>
        `;
  }
}

export default ProfileContainer;
