class ForgotPasswordLink extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .container {
          width: 16.5625rem; 
          margin-top: -1.125rem; 
          margin-bottom: 1rem; 
          text-align: right;
        }

        a {
          font-family: Roboto, sans-serif;
          font-size: 0.875rem; 
          font-style: italic;
          color: #535353;
          text-decoration: underline;
        }

        @media (max-width: 430px) {
          .container {
            width: 100%;
            text-align: left;
            margin: 0;
          }

          a {
            font-size: 0.8125rem; 
          }
        }
      </style>

      <div class="container">
        <a href="#">Forgot password?</a>
      </div>
    `;
  }
}

customElements.define('forgot-password', ForgotPasswordLink);
export default ForgotPasswordLink;
