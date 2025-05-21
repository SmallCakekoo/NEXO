class SocialButtons extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
      .social-container {
        display: flex; 
        justify-content: center; 
        gap: 2rem; /* 32px */
        flex-wrap: wrap;
      }  
    
      .social {
        height: 3.33rem; 
        width: 3.33rem;
        background-color: #5354ed;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease-out;
        transform: scale(1); 
      }

      .social img {
        width: 1.875rem; 
        height: 1.875rem;
      }

      .social-text {
        margin-top: 1.563rem; 
        margin-bottom: 1.563rem;
        text-align: center;
        font-family: 'TTRounds2', sans-serif !important;
        font-size: 0.875rem; 
        color: #666666;
      }

      @font-face {
        font-family: 'TTRounds2';
        src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF') format('woff2');
        font-weight: bold;
        font-style: normal;
      }

      .social:hover {
        background-color: #BD02FF;
        transform: scale(1.05);
      }

      .mobile-only {
        display: none;
      }

      @media (max-width: 430px) {
        .social-container {
          gap: 1.25rem; 
        }

        .social {
          width: 2.188rem; 
          height: 2.188rem;
        }

        .social img {
          width: 1.25rem; 
          height: 1.25rem;
        }

        .social-text {
          font-size: 0.813rem; 
          margin-top: 2.188rem; 
        }

        .mobile-only {
          display: flex;
        }
      }
    </style>
    
    <div class="social-container">
      <!-- Always visible -->
      <button class="social">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/new-post.png" alt="email icon" />
      </button>
      <button class="social">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="instagram icon" />
      </button>

      <!-- Visible only on mobile -->
      <button class="social mobile-only">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/twitterx--v2.png" alt="x icon" />
      </button>
      <button class="social mobile-only">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="linkedin icon" />
      </button>
      <button class="social mobile-only">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok.png" alt="tiktok icon" />
      </button>
    </div>

    <p class="social-text">Link with any of these social media platforms</p>
    `;
  }
}

customElements.define('social-buttons', SocialButtons);
export default SocialButtons;
