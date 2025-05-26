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
    this.setupLoginHandler();
  }

  setupLoginHandler() {
    const loginButton = this.querySelector('primary-button');
    loginButton?.addEventListener('click', () => {
      const form = this.querySelector('#login-form') as HTMLFormElement;
      if (!form) return;
      const usernameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
      const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
      const username = usernameInput?.value.trim();
      const password = passwordInput?.value;
      if (!username || !password) {
        alert('Please enter both username and password.');
        return;
      }
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u:any) => u.username === username && u.password === password);
      if (!user) {
        alert('Invalid username or password.');
        return;
      }
      // Set logged in user
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      // Navigate to feed
      const event = new CustomEvent('navigate', {
        detail: '/feed',
        composed: true
      });
      document.dispatchEvent(event);
    });
  }
}

export default LoginComponent;
