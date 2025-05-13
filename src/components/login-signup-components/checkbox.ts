class CustomCheckbox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <label style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; margin-bottom: 16px;">
        <input type="checkbox" />
        I accept terms & conditions
      </label>
    `;
  }
}
customElements.define('custom-checkbox', CustomCheckbox);

export default CustomCheckbox;