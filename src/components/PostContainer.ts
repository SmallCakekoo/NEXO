import { Post, PostsResponse } from '../types/feeds.types';
import { fetchPosts } from '../services/feed.service';

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
                ${this.posts.length > 0
                    ? this.posts.map(
                        (post) => `
                            <div tag="${post.tag}">
                                <img src="${post.photo}" alt="Foto de ${post.name}" />
                                <p><strong>${post.name}</strong> (${post.degree} - ${post.semestre})</p>
                                <p>${post.message}</p>
                                <span>Likes: ${post.likes}</span>
                            </div>`
                    ).join("")
                    : "<p>There are no posts yet.</p>"}
            </div>
        `;
    }
}

export default PostContainer;