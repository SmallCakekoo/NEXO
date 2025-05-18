import '../components/login-signup-components/header-title';
import '../components/login-signup-components/form-fields';
import '../components/login-signup-components/primary-button';
import '../components/login-signup-components/divider';
import '../components/login-signup-components/social-buttons';
import '../components/login-signup-components/forgot-password';

class LoginComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
      section {
        width: 90%;
        max-width: 35.625rem; /* 570px */
        margin: 3rem auto;
        padding: 1.5rem;
        background: #ddddfb;
        border-radius: 0.5rem;
        border: 0.063rem solid #5354ed; /* 1px */
        box-shadow: 0 0 0.375rem rgba(0, 0, 0, 0.1); /* 6px */
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      @media (max-width: 35.875rem) { /* 768px */
        section {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          border-radius: 0;
          border: none;
          background: white;
          box-shadow: none;
        }

        header-title,
        form-fields,
        forgot-password,
        primary-button,
        custom-divider,
        social-buttons {
          width: 100%;
          padding: 0 1.5rem;
        }

        section {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          gap: 1rem;
        }
      }
    </style>

    <nav-bar></nav-bar>
    <section>
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

export default LoginComponent;
