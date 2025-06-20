import { AppDispatcher } from "./Dispatcher";
import { SignUpActionsType } from "./Actions";
import { NavigationActions } from "./NavigationActions";
import { store } from "./Store";
import { registerUser } from "../services/Firebase/FirebaseConfig";

export class SignUpVerification {
  static validateForm(
    username: string,
    email: string,
    phone: string,
    password: string,
    degree: string,
    semester: string
  ): { isValid: boolean; error?: string } {
    return store.validateSignUpForm(username, email, phone, password, degree, semester);
  }

  static async saveUser(userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
    degree: string;
    semester: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await registerUser(
        userData.username,
        userData.email,
        userData.phone,
        userData.degree,
        userData.semester,
        userData.password
      );

      if (!result.isRegistered) {
        return { success: false, error: result.error as string };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to register user" };
    }
  }
}

export class SignUpActions {
  static setError(error: string): void {
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP_ERROR,
      payload: { error },
    });
  }

  static validateSignUpForm(
    formData: FormData,
    degree: string,
    semester: string,
    checkbox: HTMLInputElement | null
  ): { isValid: boolean; error?: string } {
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

    // Use Store's validation for email format, password requirements, phone number, and duplicates
    const validation = SignUpVerification.validateForm(
      username,
      email,
      phone,
      password,
      degree,
      semester
    );

    if (!validation.isValid) {
      return validation;
    }

    return { isValid: true };
  }

  static async initiateSignUp(userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
    degree: string;
    semester: string;
  }): Promise<void> {
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
      // Save user data using Firebase
      const result = await SignUpVerification.saveUser(userData);

      if (!result.success) {
        AppDispatcher.dispatch({
          type: SignUpActionsType.SIGN_UP_ERROR,
          payload: { error: result.error || "An error occurred during sign up" },
        });
        return;
      }

      // Dispatch success action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_SUCCESS,
      });

      // Navigate to feed page using NavigationActions
      NavigationActions.navigate("/feed");
    } catch (error) {
      // Dispatch error action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: "An error occurred during sign up" },
      });
    }
  }
}
