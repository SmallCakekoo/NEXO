import { Post } from "../../types/feed/feeds.types";
import { fetchPosts } from "../../services/FeedService";
import { store, State } from "../../flux/Store";
import { AppDispatcher } from "../../flux/Dispatcher";
import { PostActionTypes } from "../../types/feed/PostActionTypes";

// An interface to extend windows
interface WindowWithPostContainer extends Window {
  postContainerConnected?: boolean;
}

const windowWithPC = window as WindowWithPostContainer;

export class PostContainer extends HTMLElement {
  private filteredPosts: Post[] = [];
  private currentFilter: string = "All";
  private tagSelectedListener: ((event: Event) => void) | null = null;
  private postPublishedListener: ((event: Event) => void) | null = null;
  private profileUpdatedListener: ((event: Event) => void) | null = null;
  private isListenerAttached: boolean = false;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  connectedCallback() {
    this.subscribeToStore();
    this.setupEventListeners();
    this.loadPosts();
  }

  disconnectedCallback() {
    // Clean up event listeners
    if (this.tagSelectedListener) {
      document.removeEventListener("tagSelected", this.tagSelectedListener);
    }
    if (this.postPublishedListener) {
      document.removeEventListener("post-published", this.postPublishedListener);
    }
    if (this.profileUpdatedListener) {
      document.removeEventListener("profile-updated", this.profileUpdatedListener);
    }
    // Unsubscribe from store
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
  }

  private setupEventListeners() {
    // Only set up event listeners if they're not already attached
    if (!this.isListenerAttached) {
      // Listen for tag selection
      this.tagSelectedListener = (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        const tag = customEvent.detail;
        this.filterPostsByTag(tag);
      };
      document.addEventListener("tagSelected", this.tagSelectedListener);

      // Listen for new posts
      this.postPublishedListener = () => {
        this.loadPosts();
      };
      document.addEventListener("post-published", this.postPublishedListener);

      // Listen for profile updates
      this.profileUpdatedListener = () => {
        this.loadPosts();
      };
      document.addEventListener("profile-updated", this.profileUpdatedListener);

      this.isListenerAttached = true;
      windowWithPC.postContainerConnected = true;
    }
  }

  private handleStoreChange(state: State) {
    // Update filtered posts based on store state
    this.filteredPosts = store.getFilteredPosts(state.selectedTag);
    this.render();
  }

  private filterPostsByTag(tag: string) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    this.filteredPosts = tag
      ? posts.filter((post: Post) => post.tag === tag)
      : posts;
    this.render();
  }

  private async loadPosts() {
    try {
      const response = await fetchPosts();
      this.filteredPosts = store.getFilteredPosts(store.getState().selectedTag);
      this.render();
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  private render() {
    if (!this.shadowRoot) return;

    const postsHTML =
      this.filteredPosts.length > 0
        ? this.filteredPosts
            .map((post) => {
              const escapedPhoto = post.photo ? post.photo.replace(/"/g, "&quot;") : "";
              const escapedName = post.name ? post.name.replace(/"/g, "&quot;") : "";
              const escapedDate = post.date ? post.date.replace(/"/g, "&quot;") : "";
              const escapedCareer = post.career ? post.career.replace(/"/g, "&quot;") : "";
              const escapedSemestre = post.semestre ? post.semestre.replace(/"/g, "&quot;") : "";
              const escapedMessage = post.message ? post.message.replace(/"/g, "&quot;") : "";
              const escapedTag = post.tag ? post.tag.replace(/"/g, "&quot;") : "";
              const escapedShare = post.share ? post.share.replace(/"/g, "&quot;") : "";

              return `
              <feed-post
                ${post.id ? `id="${post.id}"` : ""}
                photo="${escapedPhoto}"
                name="${escapedName}"
                date="${escapedDate}"
                career="${escapedCareer}"
                semestre="${escapedSemestre}"
                message="${escapedMessage}"
                tag="${escapedTag}"
                likes="${post.likes || 0}"
                share="${escapedShare}"
                comments='${JSON.stringify(post.comments || [])}'
              ></feed-post>
            `;
            })
            .join("")
        : `
        <div class="no-posts">
          <p class="no-posts-title">No hay posts en la categoría "${store.getState().selectedTag}"</p>
          <p class="subtitle">Intenta seleccionar otra categoría o crear un nuevo post</p>
        </div>
      `;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
        }

        .posts-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .no-posts {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border-radius: 15px;
          margin: 20px auto;
          max-width: 690px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .no-posts p {
          margin: 0;
          color: #1f2937;
        }

        .no-posts-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4a4a4a;
          margin-bottom: 10px !important;
        }

        .no-posts .subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        @media (max-width: 576px) {
          .posts-container {
            padding: 10px;
          }

          .no-posts {
            margin: 10px;
            padding: 30px 15px;
          }

          .no-posts-title {
            font-size: 1.2rem;
          }

          .no-posts .subtitle {
            font-size: 0.9rem;
          }
        }
      </style>
      <div class="posts-container">
        ${postsHTML}
      </div>
    `;
  }
}

export default PostContainer;

console.log("se cargó este archivo");
