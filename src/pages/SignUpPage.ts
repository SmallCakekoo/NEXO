import { store } from "../flux/Store";
import { SignUpActions } from "../flux/SignUpActions";
import { AppDispatcher } from "../flux/Dispatcher";
import { SignUpActionsType } from "../flux/Actions";

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
          margin: 0.5rem 0 1rem 0;
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
        <div class="error-message" id="error-message"></div>
        <signup-form-fields></signup-form-fields>
        <custom-checkbox></custom-checkbox>
        <primary-button text="Sign Up"></primary-button>
        <custom-divider></custom-divider>
        <social-buttons></social-buttons>
      </section>
    `;

    this.setupEventListeners();
    this.setupStoreSubscription();
  }

  setupStoreSubscription() {
    store.subscribe((state) => {
      const errorMessage = this.querySelector("#error-message") as HTMLElement;
      const signUpFormFields = this.querySelector("signup-form-fields") as any;

      if (errorMessage) {
        if (state.signUp.error) {
          errorMessage.textContent = state.signUp.error;
          errorMessage.style.display = "block";
          // Restore form values when there's an error
          if (signUpFormFields) {
            signUpFormFields.restoreFormValues();
          }
        } else {
          errorMessage.style.display = "none";
        }
      }
    });
  }

  setupEventListeners() {
    const signUpButton = this.querySelector("primary-button");
    const signUpFormFields = this.querySelector("signup-form-fields") as any;

    signUpButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = this.querySelector("#signup-form") as HTMLFormElement;
      const checkbox = this.querySelector('input[name="terms"]') as HTMLInputElement;

      if (!form || !signUpFormFields) return;

      const formData = new FormData(form);
      const username = formData.get("username") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const password = formData.get("password") as string;
      const degree = signUpFormFields.getDegree();
      const semester = signUpFormFields.getSemester();

      // Validar que todos los campos estén completos
      if (!username || !email || !phone || !password || !degree || !semester) {
        const errorMessage = this.querySelector("#error-message") as HTMLElement;
        if (errorMessage) {
          errorMessage.textContent = "Por favor, complete todos los campos";
          errorMessage.style.display = "block";
        }
        return;
      }

      // Validar el checkbox de términos
      if (!checkbox?.checked) {
        const errorMessage = this.querySelector("#error-message") as HTMLElement;
        if (errorMessage) {
          errorMessage.textContent = "Debe aceptar los términos de uso";
          errorMessage.style.display = "block";
        }
        return;
      }

      // Si todas las validaciones pasan, iniciar el proceso de registro
      SignUpActions.initiateSignUp({
        username,
        email,
        phone,
        password,
        degree,
        semester,
      });
    });
  }
}

export default SignUpComponent;
