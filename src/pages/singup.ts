import '../components/login-signup-components/header-title';
import '../components/login-signup-components/form-fields';
import '../components/login-signup-components/primary-button';
import '../components/login-signup-components/divider';
import '../components/login-signup-components/social-buttons';
import '../components/login-signup-components/checkbox';

class SignUpComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section style="
        width: 400px;
        margin: 40px auto;
        padding: 24px;
        background: #f7f7fc;
        border-radius: 8px;
        box-shadow: 0 0 6px rgba(0,0,0,0.1);
      ">
        <header-title title="Sign Up" subtitle="Enter your info"></header-title>
        <form-fields mode="signup"></form-fields>
        <custom-checkbox></custom-checkbox>
        <primary-button text="Sign Up"></primary-button>
        <custom-divider></custom-divider>
        <social-buttons></social-buttons>
      </section>
    `;
  }
}

customElements.define('sign-up-component', SignUpComponent);

export default SignUpComponent;
