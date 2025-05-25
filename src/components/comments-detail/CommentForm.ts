class CommentForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const publishButton = this.shadowRoot?.querySelector(".publish-button");
    const commentInput = this.shadowRoot?.querySelector(".comment-input") as HTMLTextAreaElement;

    publishButton?.addEventListener("click", () => {
      const commentText = commentInput?.value || "";

      if (!commentText.trim()) {
        alert("Please write a comment before publishing.");
        return;
      }

      // Crear un objeto de comentario con datos completos
      const newComment = {
        photo: "https://picsum.photos/seed/user/200/300", // URL de foto por defecto
        name: "Rosa Elvira", // Nombre del usuario actual
        career: "Medicine", // Carrera del usuario actual
        date: new Date().toLocaleDateString(), // Fecha actual
        message: commentText // El texto del comentario
      };
      
      // Disparar un evento con los datos del comentario
      const commentEvent = new CustomEvent("comment-submitted", {
        detail: newComment,

        composed: true
      });
      
      document.dispatchEvent(commentEvent);
      commentInput.value = "";
      this.showNotification("¡Comentario publicado con éxito!");
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .form-title {
          font-size: 18px;
          font-weight: 600;
          margin-top: 10px;
          color: #191919;
          position: relative;
          padding-bottom: 3px;
          text-align: center;
        }
        
        .form-title::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 3px;
          background-color: #5354ed;
          border-radius: 2px;
        }
        
        .comment-input {
          width: 100%;
          min-height: 120px;
          border: 1px solid #f0f2fa;
          border-radius: 10px;
          padding: 14px;
          font-family: inherit;
          font-size: 15px;
          margin: 20px 0;
          resize: vertical;
          background-color: white;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .comment-input:focus {
          outline: none;
          border-color: #5354ed;
          box-shadow: 0 0 0 3px rgba(83, 84, 237, 0.15);
        }
        
        .button-container {
          display: flex;
          justify-content: flex-end;
        }
        
        

        .publish-button {
          background-color: #5354ed;
          color: white;
          font-size: 14px;
          border: 2px solid black;
          padding: 10px 24px;
          border-radius: 50px;
          cursor: pointer;
          outline: none;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .publish-button:hover {
          filter: brightness(1.2);
          transform: scale(1.05);
          -webkit-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
          -moz-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
          box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
        }

        .publish-button:active {
          transform: scale(0.95);
          -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
          -moz-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
          box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
          filter: brightness(0.8);
        }
        
        .publish-button svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
      </style>
      
      <h3 class="form-title">Write a comment</h3>
      <textarea class="comment-input" placeholder="What do you think about this?"></textarea>
      <div class="button-container">
        <button class="publish-button">
          Publish
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;
  }

  showNotification(message: string) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "comment-notification";
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "#5354ed";
    notification.style.color = "white";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    notification.style.zIndex = "1000";
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transition = "opacity 0.5s ease";
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
}

export default CommentForm;
