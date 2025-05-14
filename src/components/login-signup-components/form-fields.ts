class FormFields extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        input[type="text"],
        input[type="password"] {
          width: 265px;
          padding: 5px 16px;
          margin-bottom: 23px;
          border: 2px solid #5354ED;
          border-radius: 30px;
          outline: none;
          font-size: 14px;
          font-family: Roboto, sans-serif;
          transition: border-color 0.3s ease;
          color: black;
        }

        input:focus {
          border-color: #BD02FF;
        }
      </style>

      <form id="login-form" style="display: flex; flex-direction: column; gap: 12px;">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
      </form>
    `;
  }
}

customElements.define('form-fields', FormFields);
export default FormFields;
