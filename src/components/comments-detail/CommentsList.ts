interface Comment {
  author: string;
  date: string;
  text: string;
  image?: string;
}

class CommentsList extends HTMLElement {
  private comments: Comment[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Example data
    this.comments = [
      {
        author: "Juan Telón",
        date: "16/03/25",
        text: "Excellent post! It has helped me a lot with my studies.",
        image: "https://i.pravatar.cc/150?img=3",
      },
      {
        author: "María López",
        date: "15/03/25",
        text: "Very interesting topic. Does anyone know where I can find more information about this?",
        image: "https://i.pravatar.cc/150?img=5",
      },
      {
        author: "Carlos Rodríguez",
        date: "14/03/25",
        text: "I had the same experience. It's important to share this kind of information so others don't make the same mistakes.",
        image: "https://i.pravatar.cc/150?img=8",
      },
      {
        author: "Steven Bater",
        date: "18/03/25",
        text: "How strange, right? I never thought about that before.",
        image: "https://i.pravatar.cc/150?img=7",
      },
    ];

    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("comment-submitted", ((event: CustomEvent) => {
      this.comments.unshift(event.detail); // Adds the new comment to the top of the list
      this.render();
    }) as EventListener);
  }

  render() {
    const commentsHTML = this.comments
      .map((comment) => {
        const defaultAvatar = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22150%22%20height%3D%22150%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f0f2fa%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-size%3D%2250%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%235354ED%22%3E${comment.author.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E`;
        const userImage = comment.image || defaultAvatar;

        return `
          <div class="comment-item">
            <div class="comment-header">
              <div class="user-info">
                <img src="${userImage}" alt="${comment.author}" class="user-avatar" onerror="this.onerror=null; this.src='${defaultAvatar}';">
                <div>
                  <h4 class="user-name">${comment.author}</h4>
                  <div class="comment-date">${comment.date}</div>
                </div>
              </div>
            </div>
            <p class="comment-text">${comment.text}</p>
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
