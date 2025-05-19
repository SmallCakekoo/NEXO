class CustomCheckbox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .checkbox-container {
          display: flex;
          align-items: center;
          font-family: Roboto, sans-serif;
          font-size: 0.75rem; 
          color: #666666;
          gap: 0.625rem; 
          margin-bottom: 0.3125rem; 
          margin-top: 0.5rem;
          margin-left: 0.625rem;
        }

        input[type="checkbox"] {
          all: unset;
          width: 1.125rem;
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
          width: 0.28125rem; 
          height: 0.5625rem; 
          border-right: 0.125rem solid white; 
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

        @media (max-width: 430px) {
          .checkbox-container {
            font-size: 0.6875rem; 
            gap: 0.5rem; 
          }

          input[type="checkbox"] {
            width: 1rem; 
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
