import { Post } from "../../types/feed/feeds.types";
import { fetchPosts } from "../../services/feed.service";

class PostContainer extends HTMLElement {
  private posts: Post[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    console.log("PostContainer component mounted.");
    await this.loadPosts();
  }

  async loadPosts(): Promise<void> {
    try {
      const data = await fetchPosts();
      this.posts = data.posts;
      this.render();
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  render() {
    console.log("Rendering posts:", this.posts);
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
            <div>
                ${
                  this.posts.length > 0
                    ? this.posts
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
                        .join("")
                    : "<p>There are no posts yet.</p>"
                }
            </div>
        `;
  }
}

export default PostContainer;
