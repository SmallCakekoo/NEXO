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

  async connectedCallback() {
    // Subscribe to store changes
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));

    // Initial load of posts
    const response = await fetchPosts();
    if (response.posts) {
      this.filteredPosts = response.posts;
      this.render();
    }

    // Only set up event listeners if they're not already attached
    if (!this.isListenerAttached) {
      // Create the tagSelected event listener
      this.tagSelectedListener = (event: Event) => {
        const customEvent = event as CustomEvent<{ tag: string }>;
        const selectedTag = customEvent.detail.tag;
        console.log("PostContainer: Filtering by tag:", selectedTag);
        this.currentFilter = selectedTag;
        this.filterPosts(selectedTag);
      };

      // Create the post-published event listener
      this.postPublishedListener = (event: Event) => {
        console.log("PostContainer: 'post-published' event received.", event);
        const customEvent = event as CustomEvent<{
          content: string;
          category: string;
          image: File | null;
          createdAt: string;
        }>;
        this.addNewPost(customEvent.detail);
      };

      // Create the profile-updated event listener
      this.profileUpdatedListener = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (
          customEvent.detail &&
          typeof customEvent.detail === "object" &&
          "type" in customEvent.detail
        ) {
          if (customEvent.detail.type === "photo") {
            // Reload posts to reflect the new profile photo
            this.loadPosts();
          }
        }
      };

      // Add the event listeners
      document.addEventListener("tagSelected", this.tagSelectedListener);
      document.addEventListener("post-published", this.postPublishedListener);
      document.addEventListener("profile-updated", this.profileUpdatedListener);

      // Mark listeners as attached
      this.isListenerAttached = true;
      windowWithPC.postContainerConnected = true;
    }
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

  private handleStoreChange(state: any) {
    // Solo actualizar si el tag seleccionado ha cambiado o hay nuevos posts
    const shouldUpdate =
      this.currentFilter !== state.selectedTag ||
      JSON.stringify(this.filteredPosts) !==
        JSON.stringify(store.getFilteredPosts(this.currentFilter));

    if (shouldUpdate) {
      this.currentFilter = state.selectedTag;
      this.filteredPosts = store.getFilteredPosts(this.currentFilter);
      this.render();
    }
  }

  private filterPosts(tag: string) {
    if (this.currentFilter === tag) return;

    this.currentFilter = tag;
    this.filteredPosts = store.getFilteredPosts(tag);
    this.render();
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
          <p class="no-posts-title">No hay posts en la categoría "${this.currentFilter}"</p>
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

  addNewPost(postData: {
    content: string;
    category: string;
    image: File | null;
    createdAt: string;
  }): void {
    // Get current user info from localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch (e) {
      alert("Error getting user information. Cannot create post.");
      return;
    }

    if (!user) {
      alert("You must be logged in to create a post.");
      return;
    }

    const name = user?.username || "Unknown User";
    const career = user?.degree || "Unknown Career";
    const semestre = user?.semester || "";
    let photo = user?.profilePic;
    if (!photo && postData.image) {
      photo = URL.createObjectURL(postData.image);
    } else if (!photo) {
      photo = `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`;
    }

    // Create a new post object with the data from the modal
    const newPost: Post = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      photo: photo,
      name: name,
      date: new Date().toLocaleDateString(),
      career: career,
      semestre: semestre,
      message: postData.content,
      tag: postData.category,
      likes: 0,
      share: "0",
      comments: [],
    };

    // Get current posts from localStorage
    const currentPosts = JSON.parse(localStorage.getItem("posts") || "[]");

    // Check if post with same ID already exists
    const postExists = currentPosts.some((post: Post) => post.id === newPost.id);
    if (!postExists) {
      // Add the new post to the array
      currentPosts.unshift(newPost);

      // Update localStorage
      localStorage.setItem("posts", JSON.stringify(currentPosts));

      // Dispatch action to update store
      AppDispatcher.dispatch({
        type: PostActionTypes.ADD_POST,
        payload: newPost,
      });
    }
  }

  private async loadPosts() {
    const response = await fetchPosts();
    if (response.posts) {
      this.filteredPosts = response.posts;
      this.render();
    }
  }
}

export default PostContainer;

console.log("se cargó este archivo");
