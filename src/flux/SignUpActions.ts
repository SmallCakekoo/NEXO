import { AppDispatcher } from "./Dispatcher";
import { SignUpActionsType } from "./Actions";

export class SignUpVerification {
  static validateForm(
    username: string,
    email: string,
    phone: string,
    password: string,
    degree: string,
    semester: string
  ): { isValid: boolean; error?: string } {
    // Check if all fields are filled
    if (!username || !email || !phone || !password || !degree || !semester) {
      return { isValid: false, error: "Please fill in all fields" };
    }

    // Check for duplicate username or email
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const duplicate = users.find((u: any) => u.username === username || u.email === email);
    if (duplicate) {
      return { isValid: false, error: "Username or email already exists" };
    }

    return { isValid: true };
  }

  static saveUser(userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
    degree: string;
    semester: string;
  }): void {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      ...userData,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
}

export class SignUpActions {
  static setError(error: string): void {
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP_ERROR,
      payload: { error },
    });
  }

  static validateSignUpForm(formData: FormData, degree: string, semester: string, checkbox: HTMLInputElement | null): { isValid: boolean; error?: string } {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    // Validate that all fields are complete
    if (!username || !email || !phone || !password || !degree || !semester) {
      return { isValid: false, error: "Please complete all fields" };
    }

    // Validate terms checkbox
    if (!checkbox?.checked) {
      return { isValid: false, error: "You must accept the terms of use" };
    }

    return { isValid: true };
  }

  static initiateSignUp(userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
    degree: string;
    semester: string;
  }): void {
    // Validate the form data
    const validation = SignUpVerification.validateForm(
      userData.username,
      userData.email,
      userData.phone,
      userData.password,
      userData.degree,
      userData.semester
    );

    if (!validation.isValid) {
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: validation.error },
      });
      return;
    }

    // Dispatch sign up action
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP,
      payload: userData,
    });

    try {
      // Save user data
      SignUpVerification.saveUser(userData);

      // Set logged in user
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      // Dispatch success action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_SUCCESS,
      });

      // Navigate to feed page instead of login
      const navigationEvent = new CustomEvent("navigate", {
        detail: "/feed",
        composed: true,
      });
      document.dispatchEvent(navigationEvent);
    } catch (error) {
      // Dispatch error action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: "An error occurred during sign up" },
      });
    }
  }
}
