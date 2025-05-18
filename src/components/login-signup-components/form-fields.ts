class FormFields extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        input[type="text"],
        input[type="password"] {
          width: 16.56rem; /* 265px */
          padding: 0.3125rem 1rem; /* 5px 16px */
          margin-bottom: 1.4375rem; /* 23px */
          border: 0.125rem solid #5354ED; /* 2px */
          border-radius: 1.875rem; /* 30px */
          outline: none;
          font-size: 0.875rem; /* 14px */
          font-family: Roboto, sans-serif;
          transition: border-color 0.3s ease;
          color: black;
        }

        input:focus {
          border-color: #BD02FF;
        }

        @media (max-width: 35.875rem) {
          input[type="text"],
          input[type="password"] {
            width: 100%;
            font-size: 0.8125rem; /* 13px */
            padding: 0.3125rem 0.75rem; /* 5px 12px */
          }
        }
      </style>

      <form id="login-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
      </form>
    `;
  }
}

customElements.define('form-fields', FormFields);
export default FormFields;
