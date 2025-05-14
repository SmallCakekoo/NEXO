import '../components/login-signup-components/header-title';
import '../components/login-signup-components/form-field-signup';
import '../components/login-signup-components/primary-button';
import '../components/login-signup-components/divider';
import '../components/login-signup-components/social-buttons';
import '../components/login-signup-components/checkbox';

class SignUpComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav-bar></nav-bar> 

      <section style="
        width: 570px;
        margin: 40px auto;
        padding: 24px;
        background: #ddddfb;
        border-radius: 8px;
        box-shadow: 0 0 6px rgba(0,0,0,0.1);
        border: 1px solid #5354ed;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      ">
        <header-title title="Sign Up" subtitle="Enter your info"></header-title>
        <signup-form-fields></signup-form-fields>
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
