class ForgotPasswordLink extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="text-align: right; margin-bottom: 16px;">
        <a href="#" style="color: #4f46e5; font-size: 0.9rem;">Forgot password?</a>
      </div>
    `;
  }
}
customElements.define('forgot-password', ForgotPasswordLink);

export default ForgotPasswordLink;