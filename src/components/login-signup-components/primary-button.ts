class PrimaryButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Submit';
    this.innerHTML = `
      <button style="
        background-color: #4f46e5;
        color: white;
        padding: 8px;
        border: none;
        border-radius: 6px;
        width: 100%;
        cursor: pointer;
      ">${text}</button>
    `;
  }
}
customElements.define('primary-button', PrimaryButton);

export default PrimaryButton;