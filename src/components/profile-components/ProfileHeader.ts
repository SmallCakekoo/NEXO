class ProfileHeader extends HTMLElement {
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
                :host {
                    display: block;
                    width: 100%;
                    overflow-x: hidden;
                }

                .banner {
                    width: 100vw;
                    height: 200px;
                    background-color: #FFA500;
                    position: relative;
                    overflow: hidden;
                    left: 50%;
                    right: 50%;
                    margin-left: -50vw;
                    margin-right: -50vw;
                }

                .banner-illustrations {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                
                .banner-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile-section {
                    text-align: center;
                    margin-top: -50px;
                    position: relative;
                    
                }

                .profile-picture {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border: 4px solid white;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                    object-fit: cover;
                }

                .edit-button {
                    position: absolute;
                    right: 30%;
                    top: 30px;
                    background: #6366F1;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 3;
                }

                .edit-button svg {
                    width: 20px;
                    height: 20px;
                    fill: white;
                }

                .profile-info {
                    padding: 20px;
                }

                h1 {
                    margin: 10px 0;
                    color: #1F2937;
                    font-size: 1.5rem;
                }

                .career {
                    color: #6B7280;
                    margin: 5px 0;
                }

                .bio {
                    color: #4B5563;
                    margin: 15px 0;
                    font-size: 0.9rem;
                }
            </style>
            <div class="banner">
                <div class="banner-illustrations">
                    <img class="banner-image" src="/assets/images/bannerimg.png" alt="Banner image">
                </div>
            </div>
            <div class="profile-section">
                <img class="profile-picture" src="https://picsum.photos/seed/picsum/200/300" alt="Profile picture">
                <button class="edit-button">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <div class="profile-info">
                    <h1>Rosa Elvira</h1>
                    <p class="career">Medicine</p>
                    <p class="bio">Hi! I'm Rosa (the girl of the right). I'm a medicine student that likes to have fun. Here's my insta @Rosa_Elvira</p>
                </div>
            </div>
        `;
    }
}

export default ProfileHeader; 