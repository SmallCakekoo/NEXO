import { AuthActions } from "../flux/AuthActions";
import { store } from "../flux/Store";
import { loginUser } from "../services/Firebase/FirebaseConfig";
import { db } from "../services/Firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

class LoginComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <style>
      section {
        width: 80%;
        max-width: 35.625rem; 
        margin: 3rem auto;
        padding: 1.5rem;
        background: #FBFBFD;
        border-radius: 0.5rem;
        border: 0.063rem solid #000000; 
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
    </section>
    `;
    this.setupLoginHandler();
  }

  setupLoginHandler() {
    const loginButton = this.querySelector("primary-button");
    loginButton?.addEventListener("click", async () => {
      const form = this.querySelector("#login-form") as HTMLFormElement;
      if (!form) return;
      const usernameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
      const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
      const username = usernameInput?.value.trim();
      const password = passwordInput?.value;

      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }

      // Use Firebase Auth and Firestore for login
      const result = await loginUser(username, password);
      if (!result.isLoggedIn) {
        alert("Usuario o contraseña inválidos.");
        return;
      }

      // Fetch user profile from Firestore
      if (!result.user || !result.user.user) {
        alert("No user credential returned from Firebase.");
        return;
      }
      const userCredential = result.user.user;
      const userDoc = await getDoc(doc(db, "users", userCredential.uid));
      if (!userDoc.exists()) {
        alert("No user profile found in Firestore.");
        return;
      }
      const userProfile = userDoc.data();

      // Use AuthActions for login
      AuthActions.loginSuccess(userProfile);
      // Navigation to feed will be handled automatically in the Store
    });
  }
}

export default LoginComponent;

