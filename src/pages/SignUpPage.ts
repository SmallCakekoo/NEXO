import { store } from '../flux/Store';
import { SignUpActions } from '../flux/Actions';

class SignUpComponent extends HTMLElement {
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

        .error-message {
          color: #ff0000;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          text-align: center;
          display: none;
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
          signup-form-fields,
          custom-checkbox,
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
        <header-title title="Sign Up" subtitle="Enter your info"></header-title>
        <signup-form-fields></signup-form-fields>
        <custom-checkbox></custom-checkbox>
        <div class="error-message" id="error-message"></div>
        <primary-button text="Sign Up"></primary-button>
        <custom-divider></custom-divider>
        <social-buttons></social-buttons>
      </section>
    `;

    this.setupEventListeners();
    this.setupStoreSubscription();
    this.preventFormSubmission();
  }

  preventFormSubmission() {
    // Prevent default form submission for the sign-up form
    const form = this.querySelector('#signup-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }
  }

  setupStoreSubscription() {
    store.subscribe((state) => {
      const errorMessage = this.querySelector('#error-message') as HTMLElement;
      if (errorMessage) {
        if (state.signUp.error) {
          errorMessage.textContent = state.signUp.error;
          errorMessage.style.display = 'block';
        } else {
          errorMessage.style.display = 'none';
        }
      }
    });
  }

  setupEventListeners() {
    const signUpButton = this.querySelector('primary-button');
    const errorMessage = this.querySelector('#error-message') as HTMLElement;

    signUpButton?.addEventListener('primary-click', (event) => {
      const form = this.querySelector('#signup-form') as HTMLFormElement;
      const checkbox = this.querySelector('input[name="terms"]') as HTMLInputElement;
      
      if (!form || !checkbox) return;

      const formData = new FormData(form);
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const password = formData.get('password') as string;
      const degree = formData.get('degree') as string;
      const semester = formData.get('semester') as string;

      // Validate all fields are filled
      if (!username || !email || !phone || !password || !degree || !semester) {
        SignUpActions.signUpError('Please fill in all fields');
        alert('Please fill in all fields');
        event.preventDefault?.();
        event.stopPropagation?.();
        return false;
      }

      // Validate terms checkbox
      if (!checkbox.checked) {
        SignUpActions.signUpError('Please accept the terms of use');
        alert('Please accept the terms of use');
        event.preventDefault?.();
        event.stopPropagation?.();
        return false;
      }

      // Check for duplicate username or email
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const duplicate = users.find((u: any) => u.username === username || u.email === email);
      if (duplicate) {
        SignUpActions.signUpError('Username or email already exists');
        alert('Username or email already exists');
        event.preventDefault?.();
        event.stopPropagation?.();
        return false;
      }

      // Save user info to localStorage
      users.push({
        username,
        email,
        phone,
        password,
        degree,
        semester,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('users', JSON.stringify(users));

      // Show success alert
      alert('Registration successful!');

      // Redirect to login page
      const navigationEvent = new CustomEvent('navigate', {
        detail: '/login',
        composed: true
      });
      document.dispatchEvent(navigationEvent);
      event.preventDefault?.();
      event.stopPropagation?.();
      return false;
    });
  }
}

export default SignUpComponent;
