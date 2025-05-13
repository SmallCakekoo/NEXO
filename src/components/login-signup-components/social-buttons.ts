class SocialButtons extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="display: flex; justify-content: center; gap: 12px;">
        <button>GMAIL</button>
        <button>INSTA</button>
      </div>
    `;
  }
}
customElements.define('social-buttons', SocialButtons);

export default SocialButtons;
