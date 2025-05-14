class ForgotPasswordLink extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="width: 245px; margin-top: -18px; margin-bottom: 16px; text-align: right;">
        <a href="#" style="
          font-family: Roboto, sans-serif;
          font-size: 14px;
          font-style: italic;
          color: #535353;
          text-decoration: underline;
        ">
          Forgot password?
        </a>
      </div>
    `;
  }
}
customElements.define('forgot-password', ForgotPasswordLink);

export default ForgotPasswordLink;
