import { Post } from "../../types/feed/feeds.types";
import { fetchPosts } from "../../services/feed.service";

// Global declaration for AOS
declare global {
  interface Window {
    AOS: {
      init(params?: any): void;
      refresh(): void;
    };
  }
}

class PostContainer extends HTMLElement {
  private posts: Post[] = [];
  private filteredPosts: Post[] = [];
  private currentFilter: string = "All"; // Track the current filter
  private tagSelectedListener: ((event: Event) => void) | null = null;
  private postPublishedListener: ((event: Event) => void) | null = null;
  private isListenerAttached: boolean = false; // Flag to track if listener is attached

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    console.log("PostContainer component mounted.");
    await this.loadPosts();
    
    // Only set up event listeners if they're not already attached
    if (!this.isListenerAttached) {
      // Create the tagSelected event listener
      this.tagSelectedListener = (event: Event) => {
        const customEvent = event as CustomEvent<{ tag: string }>;
        const selectedTag = customEvent.detail.tag;
        console.log("Post container received tag:", selectedTag);
        this.currentFilter = selectedTag; // Update the current filter
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
        const newPostData = customEvent.detail;
        console.log("New post received:", newPostData);
        this.addNewPost(newPostData);
      };
      
      // Add the event listeners
      document.addEventListener("tagSelected", this.tagSelectedListener);
      document.addEventListener("post-published", this.postPublishedListener);
      
      // Mark listeners as attached
      this.isListenerAttached = true;
      console.log("Event listeners attached");
    }
  }
  
  disconnectedCallback() {
    console.log("PostContainer component unmounted.");
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
    console.log("Event listeners removed");
  }

  async loadPosts(): Promise<void> {
    try {
      // Only fetch posts from server if we don't have any posts yet
      if (this.posts.length === 0) {
        const data = await fetchPosts();
        this.posts = data.posts;
        // Initialize filteredPosts with all posts
        this.filteredPosts = [...this.posts];
      }
      this.render();
      // Inicializar las animaciones después de renderizar
      this.initAnimations();
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  addNewPost(postData: {
    content: string;
    category: string;
    image: File | null;
    createdAt: string;
  }): void {
    // Create a new post object with the data from the modal
    const newPost: Post = {
      photo: postData.image 
        ? URL.createObjectURL(postData.image) 
        : "https://picsum.photos/800/450?random=" + Math.floor(Math.random() * 100),
      name: "Current User", // This would come from user context in a real app
      date: new Date().toLocaleDateString(),
      career: "Student", // This would come from user context in a real app
      semestre: "Current", // This would come from user context in a real app
      message: postData.content,
      tag: postData.category,
      likes: 0,
      share: "0",
      comments: "0"
    };

    console.log("Adding new post with tag:", newPost.tag);
    console.log("Current filter:", this.currentFilter);

    // Generate a unique ID for this post based on content and timestamp
    const postId = `${newPost.message}-${postData.createdAt}`;
    
    // Check if this post already exists to prevent duplicates
    // We'll check multiple properties to ensure uniqueness
    const isDuplicate = this.posts.some(post => {
      // Check if the message content and date match
      const contentMatch = post.message === newPost.message;
      const dateMatch = post.date === newPost.date;
      
      // If both match, it's likely a duplicate
      return contentMatch && dateMatch;
    });
    
    if (!isDuplicate) {
      console.log("Adding new post to feed");
      
      // Add the new post to the beginning of the posts array
      this.posts.unshift(newPost);
      
      // Apply the current filter to determine if the new post should be shown
      if (this.currentFilter === "All" || this.currentFilter === newPost.tag) {
        // Add to filtered posts if it matches the current filter
        this.filteredPosts.unshift(newPost);
        console.log("New post added to filtered posts");
      } else {
        console.log("New post not added to filtered posts due to filter mismatch");
      }
      
      // Re-render the component
      this.render();
      
      // Initialize animations for the new post
      setTimeout(() => this.initAnimations(), 50);
    } else {
      console.log("Duplicate post detected, not adding to feed");
    }
  }

  filterPosts(tag: string) {
    console.log("Filtering posts by tag:", tag);
    this.currentFilter = tag; // Update the current filter
    
    // Log all posts and their tags for debugging
    console.log("All posts and their tags:");
    this.posts.forEach((post, index) => {
      console.log(`Post ${index}: tag="${post.tag}"`);
    });
    
    this.filteredPosts = tag === "All" 
      ? this.posts 
      : this.posts.filter((post) => post.tag === tag);
    
    console.log("Filtered posts count:", this.filteredPosts.length);
    console.log("Filtered posts:", this.filteredPosts);
    
    this.render();
    // Reset animations after filtering
    setTimeout(() => this.initAnimations(), 100);
  }

  initAnimations() {
    // Use animate.css classes directly
    if (this.shadowRoot) {
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
  }

  render() {
    console.log("Rendering posts:", this.filteredPosts);
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
            <style>
              /* Importar estilos de animate.css */
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
                          (post, index) => `
                            <feed-post 
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

    // Inicializar animaciones después de renderizar
    setTimeout(() => this.initAnimations(), 50);
  }
}

export default PostContainer;