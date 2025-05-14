class SocialButtons extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
    .social-container {
      display: flex; 
      justify-content: 
      center; gap: 32px;
    }  
    
    .social {
        height: 53.31px;
        width: 53.31px;
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
        width: 30px;
        height: 30px;
      }

      .social-text {
        margin-top: 25px;
        margin-bottom: 25px;
        text-align: center;
        font-family: 'TTRounds2', sans-serif !important;
        font-size: 14px;
        color: #666666;
      }

        @font-face {
      font-family: 'TTRounds2';
      src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    .social:hover {
    background-color:  #BD02FF;
    transform: scale(1.05);
    }
      
    </style>
    
    <div class="social-container">
      <button class="social">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/new-post.png" alt="email icon" />
      </button>
      <button class="social">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="instagram icon" />
      </button>
    </div>
    <p class="social-text">Link with any of these social media platforms</p>
    `;
  }
}
customElements.define('social-buttons', SocialButtons);

export default SocialButtons;
