import { Post } from "../../types/feed/feeds.types";
import { fetchProfilePosts } from "../../services/ProfileService";
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
    
    // Listen for profile updates
    document.addEventListener('profile-updated', () => {
      this.loadPosts();
    });

    // Listen for navigation events to reload posts when returning to profile
    document.addEventListener('navigate', (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail === '/profile') {
        this.loadPosts();
      }
    });

    // Listen for post-published event from the modal
    document.addEventListener("post-published", (event: Event) => {
      console.log("ProfileContainer: 'post-published' event received.", event);
      const customEvent = event as CustomEvent<{
        content: string;
        category: string;
        image: File | null;
        createdAt: string;
      }>;
      this.addNewPost(customEvent.detail);
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
    this.handleStoreChange(store.getState());
  }

  private handleStoreChange(state: State) {
    this.loadPosts();
  }

  async loadPosts() {
    try {
      // Always get the latest loggedInUser
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      } catch (e) {}
      const username = user?.username;
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      // Filter posts by the current username
      this.posts = posts.filter((p: any) => p.name === username);
      this.render();
    } catch (error) {
      console.error("Error loading posts:", error);
      this.render();
    }
  }

  // Sets up event listeners for the floating action button
  setupEventListeners() {
    const fab = this.shadowRoot!.querySelector("floating-btn");
    fab?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-modal"));
    });
  }

  async addNewPost(postData: {
    content: string;
    category: string;
    image: File | null;
    createdAt: string;
  }): Promise<void> {
    console.log("ProfileContainer: addNewPost called with data:", postData);
    
    // Get current user info from localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    } catch (e) {
      console.error("ProfileContainer: Error getting user from localStorage:", e);
      alert("Error getting user information. Cannot create post.");
      return;
    }
    
    if (!user) {
      console.error("ProfileContainer: No logged in user found");
      alert("You must be logged in to create a post.");
      return;
    }

    const name = user?.username || "Unknown User";
    const career = user?.degree || "Unknown Career";
    const semestre = user?.semester || "";
    let photo = user?.profilePic;
    // Handle potential image file upload (though not implemented in modal yet, keep for future)
    if (!photo && postData.image) {
        // For now, we can't easily save a File object to localStorage.
        // If image upload is implemented, this would need to handle converting File to data URL or similar.
        console.warn("Image file upload not fully supported for localStorage persistence in ProfileContainer.");
        photo = "https://via.placeholder.com/150"; // Placeholder for uploaded image
    } else if (!photo) {
        photo = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`; // Fallback random avatar
    }
    console.log("ProfileContainer: User photo:", photo);

    // Create a new post object with the data from the modal
    const newPost: Post = {
      // Generate a unique ID (more robust than just timestamp)
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      photo: photo,
      name: name,
      date: new Date().toLocaleDateString(), // Use locale date string for consistent format
      career: career,
      semestre: semestre,
      message: postData.content,
      tag: postData.category,
      likes: 0,
      share: "0", // Default share count
      comments: [], // New posts start with no comments
    };

    console.log("ProfileContainer: New post object created:", newPost);
    
    // Get current posts from localStorage
    // Note: ProfileContainer should only manage *profile* posts, filtered by user.
    // The 'posts' key in localStorage is used by FeedContainer for *all* posts.
    // To keep it simple for now and avoid separate storage, we'll add to the main 'posts' key,
    // but ideally, profile posts might be stored separately or filtered consistently.
    const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    console.log("ProfileContainer: Current posts from localStorage:", allPosts);
    
    // Check if post with same ID already exists (unlikely with robust ID, but good practice)
    const postExists = allPosts.some((post: Post) => post.id === newPost.id);
    if (!postExists) {
      // Add the new post to the beginning of the array
      allPosts.unshift(newPost);
      console.log("ProfileContainer: Adding new post to allPosts array:", allPosts);
      
      // Update localStorage for all posts
      localStorage.setItem('posts', JSON.stringify(allPosts));
      console.log("ProfileContainer: All posts updated in localStorage");
      
      // Also add to the ProfileContainer's local posts array
      // Since loadPosts filters by username, we can just reload the posts
      this.loadPosts(); // This will refetch from localStorage and filter
      console.log("ProfileContainer: Calling loadPosts to update view");
    } else {
      console.warn("ProfileContainer: Post with same ID already exists, not adding:", newPost.id);
    }
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
