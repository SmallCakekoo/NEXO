class PostCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <style>
                .post-card {
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    margin: 15px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .post-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 12px;
                    object-fit: cover;
                }

                .post-info {
                    flex-grow: 1;
                }

                .user-name {
                    font-weight: 600;
                    color: #1F2937;
                    margin: 0;
                }

                .post-meta {
                    color: #6B7280;
                    font-size: 0.85rem;
                    margin: 2px 0;
                }

                .post-content {
                    color: #4B5563;
                    margin: 15px 0;
                    font-size: 0.95rem;
                }

                .tag {
                    display: inline-block;
                    padding: 4px 12px;
                    background: #EEF2FF;
                    color: #6366F1;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    margin-right: 8px;
                }

                .post-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #E5E7EB;
                }

                .action-button {
                    display: flex;
                    align-items: center;
                    background: none;
                    border: none;
                    color: #6B7280;
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 5px 10px;
                }

                .action-button svg {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                }

                .action-button:hover {
                    color: #6366F1;
                }
            </style>
            <div class="post-card">
                <div class="post-header">
                    <img class="user-avatar" src="https://picsum.photos/seed/picsum/200/300" alt="User avatar">
                    <div class="post-info">
                        <p class="user-name">Rosa Elvira</p>
                        <p class="post-meta">Medicine 2nd</p>
                    </div>
                </div>
                <p class="post-content">
                    Did anyone else stump against a guy using boots in the stairs???
                </p>
                <div>
                    <span class="tag">Daily Life</span>
                </div>
                <div class="post-actions">
                    <button class="action-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        19 likes
                    </button>
                    <button class="action-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                        </svg>
                        Share
                    </button>
                    <button class="action-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                        Comment
                    </button>
                </div>
            </div>
        `;
  }
}

export default PostCard;
