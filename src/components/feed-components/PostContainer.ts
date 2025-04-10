import { Post } from "../../types/feed/feeds.types";
import { fetchPosts } from "../../services/feed.service";

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
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  filterPosts(tag: string) {
    console.log("Filtering posts by tag:", tag);
    this.filteredPosts = tag === "All" ? this.posts : this.posts.filter((post) => post.tag === tag);
    this.render();
  }

  render() {
    console.log("Rendering posts:", this.filteredPosts);
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
            <div>
                ${
                  this.filteredPosts.length > 0
                    ? `${this.filteredPosts
                        .map(
                          (post) => `
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
                          <style>
                            .end-message {
                              text-align: center;
                              padding: 1.5rem;
                              margin-top: 1rem;
                              color: #6c757d;
                              font-style: italic;
                            }
                          </style>
                        </div>`
                    : `<div class="empty-state"> 
                        <h3>No posts yet</h3>
                        <p>Be the first to share something interesting</p>
                         <style>
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
                         </style>
                       </div>`
                }
            </div>
        `;
  }
}

export default PostContainer;
