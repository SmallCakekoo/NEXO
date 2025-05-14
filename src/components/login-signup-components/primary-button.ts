class PrimaryButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Submit';
    this.innerHTML = `
    <style>
    .primary {
  background-color: #5354ed;
  color: white;
  font-size: 14px;
  border: 2px solid black;
  padding: 7px 47px;
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.primary:hover {
  filter: brightness(1.2);
  transform: scale(1.05);
  -webkit-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
  box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
}

.primary:active {
  transform: scale(0.95);
  -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  -moz-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
  filter: brightness(0.8);
}
    </style>
      <button class="primary">${text}</button>
    `;
  }
}
customElements.define('primary-button', PrimaryButton);

export default PrimaryButton;