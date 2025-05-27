import { AppDispatcher } from './Dispatcher';
import { SignUpActionsType } from './Actions';

export class SignUpVerification {
  static validateForm(username: string, email: string, phone: string, password: string, degree: string, semester: string): { isValid: boolean; error?: string } {
    // Check if all fields are filled
    if (!username || !email || !phone || !password || !degree || !semester) {
      return { isValid: false, error: 'Please fill in all fields' };
    }

    // Check for duplicate username or email
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const duplicate = users.find((u: any) => u.username === username || u.email === email);
    if (duplicate) {
      return { isValid: false, error: 'Username or email already exists' };
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
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      ...userData,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
}

export class SignUpActions {
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
        payload: { error: validation.error }
      });
      return;
    }

    // Dispatch sign up action
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP,
      payload: userData
    });

    try {
      // Save user data
      SignUpVerification.saveUser(userData);

      // Dispatch success action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_SUCCESS
      });

      // Navigate to login page
      const navigationEvent = new CustomEvent('navigate', {
        detail: '/login',
        composed: true
      });
      document.dispatchEvent(navigationEvent);
    } catch (error) {
      // Dispatch error action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: 'An error occurred during sign up' }
      });
    }
  }
} 