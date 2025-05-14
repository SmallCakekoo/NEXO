import '../components/login-signup-components/header-title';
import '../components/login-signup-components/form-fields';
import '../components/login-signup-components/primary-button';
import '../components/login-signup-components/divider';
import '../components/login-signup-components/social-buttons';
import '../components/login-signup-components/forgot-password';

class LoginComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <nav-bar></nav-bar>  
    <section style="
        width: 570px;
        margin: 40px auto;
        padding: 24px;
        background: #ddddfb;
        border-radius: 8px;
        border: 1px solid #5354ed;
        box-shadow: 0 0 6px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 55px;
      "

      >
        <header-title title="Login" subtitle="Enter your profile info"></header-title>
        <form-fields mode="login"></form-fields>
        <forgot-password></forgot-password>
        <primary-button text="Login"></primary-button>
        <custom-divider></custom-divider>
        <social-buttons></social-buttons>
      </section>
    `;
  }
}

customElements.define('login-component', LoginComponent);

export default LoginComponent;