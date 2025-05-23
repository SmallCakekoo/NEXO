import { Post } from "../../types/feed/feeds.types";

class ProfileContainer extends HTMLElement {
  private posts: Post[] = [];
  private defaultPosts: Post[] = [
    {
      id: "default-1",
      photo: "https://picsum.photos/seed/picsum/200/300",
      name: "Rosa Elvira",
      date: "2 hours ago",
      career: "Medicine",
      semestre: "2nd",
      message: "Did anyone else stump against a guy using boots in the stairs???",
      tag: "Daily Life",
      likes: 19,
      share: "0",
      comments: "0",
    },
    {
      id: "default-2",
      photo: "https://picsum.photos/seed/picsum/200/300",
      name: "Rosa Elvira",
      date: "Yesterday",
      career: "Medicine",
      semestre: "2nd",
      message: "Looking for study partners for the anatomy exam next week. DM me if interested!",
      tag: "Daily Life",
      likes: 32,
      share: "0",
      comments: "0",
    },
    {
      id: "default-3",
      photo: "https://picsum.photos/seed/picsum/200/300",
      name: "Rosa Elvira",
      date: "Last week",
      career: "Medicine",
      semestre: "2nd",
      message: "Just finished my first lab session! So excited to continue learning.",
      tag: "Academic",
      likes: 45,
      share: "0",
      comments: "0",
    },
  ];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Inicializar posts con los posts por defecto
    this.posts = [...this.defaultPosts];
  }

  connectedCallback() {
    this.loadPosts();
    this.setupEventListeners();
  }

  async loadPosts() {
    try {
      const response = await fetch("/data/Feed.json");
      const data = await response.json();

      if (data.posts) {
        // Filtrar solo los posts del usuario actual (Rosa Elvira en este caso)
        const loadedPosts = data.posts.filter((post: any) => post.name === "Rosa Elvira");
        // Combinar los posts cargados con los posts por defecto
        this.posts = [...loadedPosts, ...this.defaultPosts];
        this.render();
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      // Si hay un error, asegurarse de que al menos tengamos los posts por defecto
      if (this.posts.length === 0) {
        this.posts = [...this.defaultPosts];
      }
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
      // Añadir el nuevo post al array de posts
      const newPostData = event.detail;

      // Crear un nuevo post con el nombre de usuario actual
      const newPost: Post = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        photo: newPostData.image
          ? URL.createObjectURL(newPostData.image)
          : `https://picsum.photos/seed/picsum/200/300`,
        name: "Rosa Elvira", // Nombre fijo para que aparezca en el perfil
        date: new Date().toLocaleDateString(),
        career: "Medicine",
        semestre: "2nd",
        message: newPostData.content,
        tag: newPostData.category,
        likes: 0,
        share: "0",
        comments: "0",
      };

      // Añadir el nuevo post al inicio del array
      this.posts.unshift(newPost);
      this.render();
    }) as EventListener);
  }

  render() {
    const postsHTML = this.posts
      .map(
        (post: Post) => `
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
      ></feed-post>
    `
      )
      .join("");

    this.shadowRoot!.innerHTML = `
     <style>
     @import url("../colors.css");

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
