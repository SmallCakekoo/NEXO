class CustomCheckbox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .checkbox-container {
          display: flex;
          align-items: center;
          font-family: Roboto, sans-serif;
          font-size: 0.75rem; /* 12px */
          color: #666666;
          gap: 0.625rem; /* 10px */
          margin-bottom: 0.3125rem; /* 5px */
          margin-top: 0.5rem; /* 8px */
          margin-left: 0.625rem; /* 10px */
        }

        input[type="checkbox"] {
          all: unset;
          width: 1.125rem; /* 18px */
          aspect-ratio: 1;
          box-sizing: border-box;
          border: 1px solid #5a48f3;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          display: grid;
          place-content: center;
          transition: border-color 0.2s ease-in-out;
        }

        input[type="checkbox"]::before {
          content: "";
          width: 0.28125rem; /* 4.5px */
          height: 0.5625rem; /* 9px */
          border-right: 0.125rem solid white; /* 2px */
          border-bottom: 0.125rem solid white;
          transform: rotate(45deg) scale(0);
          transition: transform 0.2s ease-in-out;
          background-color: transparent;
        }

        input[type="checkbox"]:checked {
          background-color: #5a48f3;
          border-color: #5a48f3;
        }

        input[type="checkbox"]:checked::before {
          transform: rotate(45deg) scale(1);
        }

        .checkbox-text {
          text-decoration: underline;
          cursor: pointer;
        }

        @media (max-width: 35.875rem) {
          .checkbox-container {
            font-size: 0.6875rem; /* 11px */
            gap: 0.5rem; /* 8px */
          }

          input[type="checkbox"] {
            width: 1rem; /* 16px */
          }
        }
      </style>

      <label class="checkbox-container">
        <input type="checkbox" name="terms" />
        <span class="checkbox-text">I agree with terms of use</span>
      </label>
    `;
  }
}

customElements.define('custom-checkbox', CustomCheckbox);
export default CustomCheckbox;
