class PrimaryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const text = this.getAttribute("text") || "Submit";
    this.shadowRoot!.innerHTML = `
    <style>
      .primary {
        background-color: #5354ed;
        color: white;
        font-size: 0.875rem; 
        border: 0.125rem solid black; 
        padding: 0.4375rem 2.9375rem; 
        border-radius: 3.125rem;
        cursor: pointer;
        outline: none;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.563rem; 
        margin-bottom: 0.625rem; 
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

      @media (max-width: 430px) { 
        .primary {
          padding: 0.375rem 1.875rem; 
          font-size: 0.8125rem; 
          width: 100%;
        }
      }
    </style>
    <button class="primary" type="button">${text}</button>
    `;

    this.shadowRoot!.querySelector(".primary")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("primary-click", { bubbles: true, composed: true }));
    });
  }
}

customElements.define("primary-button", PrimaryButton);
export default PrimaryButton;
