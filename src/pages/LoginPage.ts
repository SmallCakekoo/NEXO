class LoginComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
      section {
        width: 80%;
        max-width: 35.625rem; 
        margin: 3rem auto;
        padding: 1.5rem;
        background: #ddddfb;
        border-radius: 0.5rem;
        border: 0.063rem solid #5354ed; 
        box-shadow: 0 0 0.375rem rgba(0, 0, 0, 0.1); 
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      @media (max-width: 430px) { 
        section {
          width: 80%;
          height: auto;
          margin: 3.0625rem auto; 
          padding: 0;
          border-radius: 0;
          border: none;
          background: white;
          box-shadow: none;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
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
      }
    </style>

    <nav-bar-login-signup></nav-bar-login-signup>

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
