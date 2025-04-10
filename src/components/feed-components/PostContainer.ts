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

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    console.log("PostContainer component mounted.");
    await this.loadPosts();
    // Listen to the tagSelected event at the document level to ensure propagation
    document.addEventListener("tagSelected", (event: Event) => {
      const customEvent = event as CustomEvent<{ tag: string }>;
      const selectedTag = customEvent.detail.tag;
      console.log("Post container received tag:", selectedTag);
      this.filterPosts(selectedTag);
    });
  }

  async loadPosts(): Promise<void> {
    try {
      const data = await fetchPosts();
      this.posts = data.posts;
      // Initialize filteredPosts with all posts
      this.filteredPosts = [...this.posts];
      this.render();
      // Inicializar las animaciones después de renderizar
      this.initAnimations();
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  filterPosts(tag: string) {
    console.log("Filtering posts by tag:", tag);
    this.filteredPosts = tag === "All" ? this.posts : this.posts.filter((post) => post.tag === tag);
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
