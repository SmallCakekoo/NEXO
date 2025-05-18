class PrimaryButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Submit';
    this.innerHTML = `
    <style>
      .primary {
        background-color: #5354ed;
        color: white;
        font-size: 0.875rem; /* 14px */
        border: 0.125rem solid black; /* 2px */
        padding: 0.4375rem 2.9375rem; /* 7px 47px */
        border-radius: 3.125rem; /* 50px */
        cursor: pointer;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.563rem; /* 25px */
        margin-bottom: 0.625rem; /* 10px */
        transition: all 0.3s ease;
      }

      .primary:hover {
        filter: brightness(1.2);
        transform: scale(1.05);
        box-shadow: 0rem 0.375rem 0rem -0.25rem rgba(0, 0, 0, 1); /* 0px 6px 0px -4px */
      }

      .primary:active {
        transform: scale(0.95);
        box-shadow: 0rem 0rem 0rem 0rem rgba(0, 0, 0, 1);
        filter: brightness(0.8);
      }

      @media (max-width: 35.875rem) { /* 768px */
        .primary {
          padding: 0.375rem 1.875rem; /* 6px 30px */
          font-size: 0.8125rem; /* 13px */
          width: 100%;
        }
      }
    </style>
    <button class="primary">${text}</button>
    `;
  }
}

customElements.define('primary-button', PrimaryButton);
export default PrimaryButton;
