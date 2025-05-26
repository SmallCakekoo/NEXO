import { Post } from "../../types/feed/feeds.types";
import { fetchPosts } from "../../services/FeedService";
import { store, State } from "../../flux/Store";
import { AppDispatcher } from "../../flux/Dispatcher";
import { PostActionTypes } from "../../types/feed/PostActionTypes";

// An interface to extend windows
interface WindowWithPostContainer extends Window {
  postContainerConnected?: boolean;
}

export class PostContainer extends HTMLElement {
  private filteredPosts: Post[] = [];
  private currentFilter: string = "All";
  private tagSelectedListener: ((event: Event) => void) | null = null;
  private postPublishedListener: ((event: Event) => void) | null = null;
  private isListenerAttached: boolean = false;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  async connectedCallback() {
        console.log("se Lee1")
    // Check if a connected instance of this component already exists
    const windowWithPC = window as WindowWithPostContainer;
    if (windowWithPC.postContainerConnected) {
      this.subscribeToStore();
      return;
    }

    this.subscribeToStore();

    // Load posts from the service
    try {
      console.log("se Lee2")
      const response = await fetchPosts(); 
                  console.log(response)
      if (response.posts && response.posts.length > 0) {
        // Store posts in localStorage
        localStorage.setItem('posts', JSON.stringify(response.posts));
        
        // Dispatch action to update store
        AppDispatcher.dispatch({
          type: PostActionTypes.LOAD_POSTS,
          payload: response.posts
        });

        // Update local state
        this.filteredPosts = response.posts;
        this.render();
  
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    }

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
    // Clean up event listeners
    if (this.tagSelectedListener) {
      document.removeEventListener("tagSelected", this.tagSelectedListener);
    }
    if (this.postPublishedListener) {
      document.removeEventListener("post-published", this.postPublishedListener);
    }
    // Unsubscribe from store
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore() {
    // Subscribe to store changes
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
    // Initial state load
    this.handleStoreChange(store.getState());
  }

  // Helper method to apply the current filter
  private applyCurrentFilter(): void {
    const allPosts = store.getState().posts;
    if (this.currentFilter === "All") {
      this.filteredPosts = [...allPosts];
    } else {
      this.filteredPosts = allPosts.filter((post) => post.tag === this.currentFilter);
    }
    this.render();
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

    // Get current posts from localStorage
    const currentPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    
    // Check if post with same ID already exists
    const postExists = currentPosts.some((post: Post) => post.id === newPost.id);
    if (!postExists) {
      // Add the new post to the array
      currentPosts.unshift(newPost);
      
      // Update localStorage
      localStorage.setItem('posts', JSON.stringify(currentPosts));
      
      // Dispatch action to update store
      AppDispatcher.dispatch({
        type: PostActionTypes.ADD_POST,
        payload: newPost
      });
    }
  }

  filterPosts(tag: string) {
    this.currentFilter = tag;
    this.applyCurrentFilter();
  }

  // Handler for store changes
  private handleStoreChange(state: State): void {
    this.applyCurrentFilter();
  }

  // Function to remove duplicates from an array of posts based on ID
  private removeDuplicatePosts(posts: Post[]): Post[] {
    const seenPostIds = new Set<string>();
    return posts.filter((post) => {
      if (!post.id) return true;
      if (seenPostIds.has(post.id)) {
        return false;
      }
      seenPostIds.add(post.id);
      return true;
    });
  }

  render() {
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
        ${this.filteredPosts.length > 0
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
                      comments='${JSON.stringify(post.comments)}'
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

  private initAnimations() {
    const posts = this.shadowRoot?.querySelectorAll('feed-post');
    posts?.forEach((post, index) => {
      post.classList.add('post-animated');
      (post as HTMLElement).style.animationDelay = `${index * 0.1}s`;
    });
  }
}


console.log("se cargó este archivo")
