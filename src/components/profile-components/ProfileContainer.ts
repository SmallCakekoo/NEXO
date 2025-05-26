import { Post } from "../../types/feed/feeds.types";
import { fetchProfilePosts } from "../../services/ProfileService";

class ProfileContainer extends HTMLElement {
  private posts: Post[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadPosts();
    this.setupEventListeners();
    // Listen for profile updates
    document.addEventListener('profile-updated', () => {
      this.loadPosts();
    });
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

  // Sets up event listeners for the floating action button and new posts
  setupEventListeners() {
    const fab = this.shadowRoot!.querySelector("floating-btn");
    fab?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-modal"));
    });

    // Escuchar el evento de nueva publicación
    document.addEventListener("post-published", ((event: CustomEvent) => {
      // Always get the latest loggedInUser
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      } catch (e) {}
      const name = user?.username || "Unknown User";
      const career = user?.degree || "Unknown Career";
      const semestre = user?.semester || "";
      const photo = user?.profilePic || (event.detail.image ? URL.createObjectURL(event.detail.image) : `https://picsum.photos/seed/picsum/200/300`);

      // Crear un nuevo post con el nombre de usuario actual
      const newPost: Post = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        photo: photo,
        name: name,
        date: new Date().toLocaleDateString(),
        career: career,
        semestre: semestre,
        message: event.detail.content,
        tag: event.detail.category,
        likes: 0,
        share: "0",
        comments: [],
      };

      // Save to localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      // Añadir el nuevo post al inicio del array
      this.posts.unshift(newPost);
      this.render();
    }) as EventListener);
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
