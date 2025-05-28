class CommentsContainer extends HTMLElement {
  private postId: string = "";
  private commentSubmittedHandler: ((event: CustomEvent) => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): string[] {
    return ["post-id"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "post-id" && newValue !== oldValue) {
      this.postId = newValue;
      this.loadAndDisplayComments();
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.loadAndDisplayComments();
  }

  disconnectedCallback() {
    // Eliminar el listener cuando el componente se desconecta
    this.removeEventListeners();
  }

  removeEventListeners() {
    // Eliminar el listener anterior si existe
    if (this.commentSubmittedHandler) {
      // Eliminar el listener del documento
      document.removeEventListener(
        "comment-submitted",
        this.commentSubmittedHandler as EventListener
      );

      // Eliminar el listener del shadowRoot
      this.shadowRoot?.removeEventListener(
        "comment-submitted",
        this.commentSubmittedHandler as EventListener
      );
      this.commentSubmittedHandler = null;
    }
  }

  setupEventListeners() {
    // Eliminar listeners anteriores para evitar duplicados
    this.removeEventListeners();

    // Crear un nuevo handler y guardarlo para poder eliminarlo después
    this.commentSubmittedHandler = ((event: CustomEvent) => {
      const commentsList = this.shadowRoot?.querySelector("comments-list");
      if (commentsList) {
        // Obtener los comentarios actuales
        let currentComments = [];
        try {
          const commentsAttr = commentsList.getAttribute("comments");
          currentComments = commentsAttr ? JSON.parse(commentsAttr) : [];
        } catch (error) {
          console.error("Error parsing comments:", error);
          currentComments = [];
        }

        // Añadir el nuevo comentario
        currentComments.unshift(event.detail);

        // Actualizar el atributo de comentarios
        commentsList.setAttribute("comments", JSON.stringify(currentComments));
        // Save updated comments to localStorage
        localStorage.setItem(`comments_${this.postId}`, JSON.stringify(currentComments));
      }
    }) as EventListener;

    // Añadir el nuevo listener al documento completo
    document.addEventListener(
      "comment-submitted",
      this.commentSubmittedHandler as EventListener
    );

    // También agregar el listener en el shadowRoot por si acaso
    this.shadowRoot?.addEventListener(
      "comment-submitted",
      this.commentSubmittedHandler as EventListener
    );
  }

  async loadAndDisplayComments() {
    const storedComments = localStorage.getItem(`comments_${this.postId}`);

    if (storedComments) {
      try {
        const comments = JSON.parse(storedComments);
        const commentsList = this.shadowRoot?.querySelector("comments-list");
        if (commentsList) {
          commentsList.setAttribute("comments", JSON.stringify(comments));
        }
        console.log("Loaded comments from localStorage for postId:", this.postId);
        return; // Exit if comments were loaded from localStorage
      } catch (error) {
        console.error("Error parsing comments from localStorage:", error);
        // If parsing fails, proceed to fetch from JSON
      }
    }

    // If no comments in localStorage or parsing failed, fetch from JSON
    try {
      const response = await fetch("/data/Feed.json");
      const data = await response.json();

      if (this.postId && data.posts) {
        const post = data.posts.find((p: any) => p.photo === this.postId);

        if (post && post.comments) {
          const commentsList = this.shadowRoot?.querySelector("comments-list");
          if (commentsList) {
            const commentsToSave = Array.isArray(post.comments) ? post.comments : JSON.parse(post.comments);
            localStorage.setItem(`comments_${this.postId}`, JSON.stringify(commentsToSave));
            commentsList.setAttribute("comments", JSON.stringify(commentsToSave));
            console.log("Loaded comments from JSON and saved to localStorage for postId:", this.postId);
          }
        }
      }
    } catch (error) {
      console.error("Error loading comments from JSON:", error);
    }
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            flex-direction: column;
            padding: 2rem;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 2px 4px rgba(83, 84, 237, 0.1);
            max-width: 730px;
            margin: 0 auto;
          }
          .divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(83, 83, 237, 0.39), transparent);
            margin: 1rem 0;
          }
        </style>
        <comment-form></comment-form>
        <div class="divider"></div>
        <comments-list></comments-list>
      `;
    }
  }
}

export default CommentsContainer;
