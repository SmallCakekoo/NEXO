interface Comment {
  photo: string;
  name: string;
  career: string;
  date: string;
  message: string;
}

class CommentsList extends HTMLElement {
  private comments: Comment[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): string[] {
    return ["comments"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "comments" && newValue !== oldValue) {
      try {
        this.comments = JSON.parse(newValue);
        this.render();
      } catch (error) {
        console.error("Error parsing comments:", error);
        this.comments = [];
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const commentsHTML = this.comments
      .map((comment) => {
        // Asegurarse de que todos los campos tengan valores por defecto
        const name = comment.name || "Usuario";
        const photo = comment.photo || "https://picsum.photos/seed/default/200/300";
        const date = comment.date || new Date().toLocaleDateString();
        const career = comment.career || "";
        const message = comment.message || "";

        const defaultAvatar = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22150%22%20height%3D%22150%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-size%3D%2250%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3E${name.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E`;
        const userImage = photo || defaultAvatar;

        return `
          <div class="comment-item">
            <div class="comment-header">
              <div class="user-info">
                <img src="${userImage}" alt="${name}" class="user-avatar">
                <div>
                  <h4 class="user-name">${name}</h4>
                  <div class="comment-date">${date}</div>
                </div>
              </div>
            </div>
            <p class="comment-text">${message}</p>
          </div>
        `;
      })
      .join("");

    const emptyState = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#5354ed">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
        </svg>
        <p>No comments yet</p>
        <p>Be the first to comment!</p>
      </div>
    `;

    this.shadowRoot!.innerHTML = `
      <style>
        .comments-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #191919;
          position: relative;
          padding-bottom: 1px;
        }
        
        .comments-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 70px;
          height: 3px;
          background-color: #5354ed;
          border-radius: 2px;
        }
        
        .comment-item {
          background-color: #f8f9fd;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 3px 10px rgba(83, 84, 237, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .comment-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(83, 84, 237, 0.1);
        }
        
        .comment-item:last-child {
          margin-bottom: 0;
        }
        
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
          background-color: #f8f9fd;
        }
        
        .user-name {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #191919;
        }
        
        .comment-date {
          font-size: 13px;
          color: #5354ed;
        }
        
        .comment-text {
          margin: 0;
          font-size: 15px;
          line-height: 1.5;
          color: #444;
        }
        
        .empty-state {
          text-align: center;
          padding: 30px 16px;
          color: #555;
          font-size: 15px;
          background-color: #f8f9fd;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .empty-state p:first-of-type {
          font-weight: 600;
          font-size: 16px;
          margin: 10px 0 0 0;
        }
        
        .empty-state p:last-of-type {
          margin: 0;
          color: #777;
        }
      </style>
      <h3 class="comments-title">Comments</h3>
      ${this.comments.length > 0 ? commentsHTML : emptyState}
    `;
  }
}

export default CommentsList;
