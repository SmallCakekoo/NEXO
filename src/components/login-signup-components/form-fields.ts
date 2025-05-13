class FormFields extends HTMLElement {
  connectedCallback() {
    const mode = this.getAttribute('mode') || 'login';
    this.innerHTML = `
      <form id="${mode}-form" style="display: flex; flex-direction: column; gap: 12px;">
        ${mode === 'signup' ? `
          <input placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Phone number" />
        ` : `
          <input placeholder="Username" />
        `}
        <input type="password" placeholder="Password" />
        ${mode === 'signup' ? `
          <input placeholder="Gender" />
          <select>
            <option>Select role</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        ` : ''}
      </form>
    `;
  }
}
customElements.define('form-fields', FormFields);

export default FormFields;