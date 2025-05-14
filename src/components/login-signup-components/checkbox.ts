class CustomCheckbox extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .checkbox-container {
          display: flex;
          align-items: center;
          font-family: Roboto, sans-serif;
          font-size: 12px;
          color: #666666;
          gap: 10px;
          margin: 15px;
        }

            input[type="checkbox"] {
        all: unset;
        width: 18px;
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
        width: 4.5px;
        height: 9px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
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
