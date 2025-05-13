class Divider extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="display:flex; align-items:center; margin: 16px 0;">
        <hr style="flex-grow:1; border-top:1px solid #ccc;" />
        <span style="margin: 0 8px; color:#999;">or</span>
        <hr style="flex-grow:1; border-top:1px solid #ccc;" />
      </div>
    `;
  }
}
customElements.define('custom-divider', Divider);

export default Divider;