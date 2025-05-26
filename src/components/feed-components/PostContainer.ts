import { Post } from "../../types/feed/feeds.types";
import { fetchPosts } from "../../services/FeedService";
import { store, State } from "../../flux/Store"; // Import store and State

// An interface to extend windows
interface WindowWithPostContainer extends Window {
  postContainerConnected?: boolean;
}

class PostContainer extends HTMLElement {
  private filteredPosts: Post[] = [];
  private currentFilter: string = "All";
  private tagSelectedListener: ((event: Event) => void) | null = null;
  private postPublishedListener: ((event: Event) => void) | null = null;
  private isListenerAttached: boolean = false;
  private unsubscribeStore: (() => void) | null = null; // To store the unsubscribe function

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Bind the store change handler
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  async connectedCallback() {
    // Check if a connected instance of this component already exists
    const windowWithPC = window as WindowWithPostContainer;
    if (windowWithPC.postContainerConnected) {
      this.subscribeToStore();
      return;
    }

    this.subscribeToStore();

    // Only set up event listeners if they're not already attached
    if (!this.isListenerAttached) {
      // Create the tagSelected event listener
      this.tagSelectedListener = (event: Event) => {
        const customEvent = event as CustomEvent<{ tag: string }>;
        const selectedTag = customEvent.detail.tag;
        this.currentFilter = selectedTag;
        this.filterPosts(selectedTag);
      };

      // Create the post-published event listener
      this.postPublishedListener = (event: Event) => {
        const customEvent = event as CustomEvent<{
          content: string;
          category: string;
          image: File | null;
          createdAt: string;
        }>;
        this.addNewPost(customEvent.detail);
      };

      // Add the event listeners
      document.addEventListener("tagSelected", this.tagSelectedListener);
      document.addEventListener("post-published", this.postPublishedListener);
      // Mark listeners as attached
      this.isListenerAttached = true;
      // Mark that an instance is already connected
      windowWithPC.postContainerConnected = true;
    }
  }

  disconnectedCallback() {
    // Remove the event listeners when the component is removed from the DOM
    if (this.tagSelectedListener && this.isListenerAttached) {
      document.removeEventListener("tagSelected", this.tagSelectedListener);
      this.tagSelectedListener = null;
    }

    if (this.postPublishedListener && this.isListenerAttached) {
      document.removeEventListener("post-published", this.postPublishedListener);
      this.postPublishedListener = null;
    }

    // Reset the flag
    this.isListenerAttached = false;
    // Remove the global flag
    const windowWithPC = window as WindowWithPostContainer;
    if (windowWithPC.postContainerConnected) {
      windowWithPC.postContainerConnected = false;
    }

    // Unsubscribe from the store
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
      this.unsubscribeStore = null;
    }
  }

  // Helper method to apply the current filter
  private applyCurrentFilter(): void {
    const allPosts = store.getState().posts; // Get posts from the store
    if (this.currentFilter === "All") {
      this.filteredPosts = [...allPosts];
    } else {
      this.filteredPosts = allPosts.filter((post) => post.tag === this.currentFilter);
    }
    this.render(); // Re-render after filtering
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
      user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    } catch (e) {}
    const name = user?.username || "Unknown User";
    const career = user?.degree || "Unknown Career";
    const semestre = user?.semester || "";
    const photo = user?.profilePic || (postData.image ? URL.createObjectURL(postData.image) : `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`);

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

    // TODO: Dispatch an action to add the new post to the store
    console.log("New post created, dispatch action to add to store:", newPost);
  }

  filterPosts(tag: string) {
    this.currentFilter = tag; // update the current filter
    this.applyCurrentFilter();
  }

  // Handler for store changes
  private handleStoreChange(state: State): void {
    // Update filtered posts based on the new state
    this.applyCurrentFilter();
  }

  private subscribeToStore(): void {
    if (!this.unsubscribeStore) {
      this.unsubscribeStore = store.subscribe(this.handleStoreChange);
    }
  }

  initAnimations() {
    // Use "animate.css" classes directly
    if (!this.shadowRoot) return;

    const posts = this.shadowRoot.querySelectorAll("feed-post");
    posts.forEach((post, index) => {
      setTimeout(() => {
        post.classList.add("post-animated");
      }, index * 150);
    });

    const emptyState = this.shadowRoot.querySelector(".empty-state");
    if (emptyState) {
      emptyState.classList.add("empty-animated");
      const emptyTitle = emptyState.querySelector("h3");
      const emptyText = emptyState.querySelector("p");
      if (emptyTitle) emptyTitle.classList.add("title-animated");
      if (emptyText) {
        setTimeout(() => {
          emptyText.classList.add("text-animated");
        }, 1000);
      }
    }
  }

  // Function to remove duplicates from an array of posts based on ID
  private removeDuplicatePosts(posts: Post[]): Post[] {
    // Use a set to track seen post IDs
    const seenPostIds = new Set<string>();

    // Filter posts to keep only the unique ones based on ID
    return posts.filter((post) => {
      if (!post.id) return true; // If the post doesn't have an ID, keep it
      // If we've seen this ID, it's a duplicate
      if (seenPostIds.has(post.id)) {
        return false;
      }
      // If we haven't seen this ID, add it and keep it
      seenPostIds.add(post.id);
      return true;
    });
  }

  render() {
    // Get the latest posts from the store before filtering and rendering
    const latestPosts = store.getState().posts;
    this.filteredPosts = this.removeDuplicatePosts(latestPosts.filter(post => 
      this.currentFilter === "All" ? true : post.tag === this.currentFilter
    ));

    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
            <style>
              @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
              
              .post-animated {
                animation: fadeInUp 0.8s ease forwards;
              }
              
              .empty-animated {
                animation: fadeIn 1s ease forwards;
              }
              
              .title-animated {
                animation: pulse 2s infinite;
              }
              
              .text-animated {
                animation: fadeIn 1s ease forwards;
              }
              
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translate3d(0, 30px, 0);
                }
                to {
                  opacity: 1;
                  transform: translate3d(0, 0, 0);
                }
              }
              
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              
              @keyframes pulse {
                0% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
                100% {
                  transform: scale(1);
                }
              }
              
              .end-message {
                text-align: center;
                padding: 1.5rem;
                margin-top: 1rem;
                color: #6c757d;
                font-style: italic;
                animation: zoomIn 0.8s ease forwards;
              }
              
              .empty-state {
                text-align: center;
                padding: 2rem;
                margin: 1rem 0;  
              } 
              
              .empty-state h3 {
                color: #495057;
                margin-bottom: 0.5rem;
              }
              
              .empty-state p {
                color: #6c757d;
              }
              
              @keyframes zoomIn {
                from {
                  opacity: 0;
                  transform: scale3d(0.3, 0.3, 0.3);
                }
                50% {
                  opacity: 1;
                }
              }
            </style>
            <div>
                ${
                  this.filteredPosts.length > 0
                    ? `${this.filteredPosts
                        .map(
                          (post) => `
                            <feed-post 
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
                                comments="${post.comments}"
                            ></feed-post>`
                        )
                        .join("")}
                        <div class="end-message">
                          <p>No more posts to show</p>
                        </div>`
                    : `<div class="empty-state"> 
                        <h3>No posts yet</h3>
                        <p>Be the first to share something interesting</p>
                       </div>`
                }
            </div>
        `;

    // Initialize animations after rendering
    setTimeout(() => this.initAnimations(), 100);
  }
}

export default PostContainer;
