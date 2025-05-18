import '../components/login-signup-components/header-title';
import '../components/login-signup-components/form-field-signup';
import '../components/login-signup-components/primary-button';
import '../components/login-signup-components/divider';
import '../components/login-signup-components/social-buttons';
import '../components/login-signup-components/checkbox';

class SignUpComponent extends HTMLElement {
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
          signup-form-fields,
          custom-checkbox,
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

export default SignUpComponent;
