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
        } else {
          errorMessage.style.display = "none";
        }
      }
    });
  }

  setupEventListeners() {
    const signUpButton = this.querySelector("primary-button");
    const signUpFormFields = this.querySelector("signup-form-fields") as any;

    signUpButton?.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = this.querySelector("#signup-form") as HTMLFormElement;
      const checkbox = this.querySelector('input[name="terms"]') as HTMLInputElement;

      if (!form || !signUpFormFields) return;

      const formData = new FormData(form);
      const degree = signUpFormFields.getDegree();
      const semester = signUpFormFields.getSemester();

      // Validate form using SignUpActions
      const validation = SignUpActions.validateSignUpForm(formData, degree, semester, checkbox);
      if (!validation.isValid) {
        const errorMessage = this.querySelector("#error-message") as HTMLElement;
        if (errorMessage) {
          errorMessage.textContent = validation.error || "An error occurred";
          errorMessage.style.display = "block";
        }
        return;
      }

      // If validation passes, initiate sign up
      await SignUpActions.initiateSignUp({
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        password: formData.get("password") as string,
        degree,
        semester,
      });
    });
  }
}

export default SignUpComponent;
