class FormFields extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        input[type="text"],
        input[type="password"] {
          width: 16.56rem; 
          padding: 0.3160rem 1rem; 
          margin-bottom: 1.4375rem; 
          border: 0.125rem solid #5354ED; 
          border-radius: 1.875rem; 
          outline: none;
          font-size: 0.875rem; 
          font-family: Roboto, sans-serif;
          transition: border-color 0.3s ease;
          color: black;
        }

        input:focus {
          border-color: #BD02FF;
        }

        @media (max-width: 430px) {
          input[type="text"],
          input[type="password"] {
            width: 100%;
            font-size: 0.8125rem; 
            padding: 0.3125rem 0.75rem; 
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
