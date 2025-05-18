class ForgotPasswordLink extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .container {
          width: 16.5625rem; /* 265px */
          margin-top: -1.125rem; /* -18px */
          margin-bottom: 1rem; /* 16px */
          text-align: right;
        }

        a {
          font-family: Roboto, sans-serif;
          font-size: 0.875rem; /* 14px */
          font-style: italic;
          color: #535353;
          text-decoration: underline;
        }

        @media (max-width: 35.875rem) {
          .container {
            width: 100%;
            text-align: left;
            margin: 0;
          }

          a {
            font-size: 0.8125rem; /* 13px */
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
