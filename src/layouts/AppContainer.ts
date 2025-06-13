import { store, State } from "../flux/Store";
import { NavigationActions } from "../flux/NavigationActions";
import { AuthActions } from "../flux/AuthActions";
import { auth, db } from "../services/Firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { UserType } from "../types/Register/UserType";

class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  connectedCallback() {
    store.load();

    // Firebase Auth persistence: restore user on reload
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userProfile: UserType = userDoc.data() as UserType;
          AuthActions.loginSuccess(userProfile);
        }
      } else {
        // User is signed out, clear everything
        AuthActions.logout(); // This will clear state and redirect
      }
    });

    // Verificar autenticación al inicio
    AuthActions.checkAuth();

    // Actualizar la ruta inicial
    NavigationActions.updateRoute(window.location.pathname);

    // Suscribirse a cambios en el store
    store.subscribe((state: State) => {
      this.handleRouteChange(state);
    });

    // Agregar manejador para el evento popstate (navegación del navegador)
    window.addEventListener("popstate", () => {
      NavigationActions.updateRoute(window.location.pathname);
    });

    // Agregar manejador para eventos de navegación personalizados
    document.addEventListener("navigate", ((event: CustomEvent) => {
      console.log("AppContainer: 'navigate' event received", event.detail);
      const path = event.detail;
      NavigationActions.navigate(path);
    }) as EventListener);
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <div>Loading...</div>
    `;
  }

  private handleRouteChange(state: State) {
    console.log("AppContainer: handleRouteChange", state.currentPath);
    const route = state.currentPath;
    this.updateView(route);
    window.scrollTo(0, 0);
  }

  private updateView(route: string) {
    console.log("AppContainer: updateView to", route);
    
    // Clear current view
    this.shadowRoot!.innerHTML = '';

    let newComponentElement: HTMLElement | null = null;

    switch (route) {
      case "/feed":
        newComponentElement = document.createElement('feed-page');
        break;
      case "/academic":
        newComponentElement = document.createElement('academics-pages');
        break;
      case "/profile":
        newComponentElement = document.createElement('profile-page');
        break;
      case "/profile-settings":
        newComponentElement = document.createElement('profile-settings-page');
        break;
      case "/teacher-detail":
        newComponentElement = document.createElement('teacher-detail-page');
        break;
      case "/subject-detail":
        newComponentElement = document.createElement('subject-detail-page');
        break;
      case "/comments-detail":
        newComponentElement = document.createElement('comments-detail-page');
        break;
      case "/comments-detail-profile":
        newComponentElement = document.createElement('comments-detail-profile');
        break;
      case "/login":
        newComponentElement = document.createElement('login-component');
        break;
      case "/signup":
        newComponentElement = document.createElement('sign-up-component');
        break;
      case "/":
        newComponentElement = document.createElement('landing-page');
        break;
      default:
        console.warn(`Unknown route: ${route}. Redirecting to landing page.`);
        newComponentElement = document.createElement('landing-page');
        break;
    }

    if (newComponentElement) {
      this.shadowRoot!.appendChild(newComponentElement);
    }
    
    window.scrollTo(0, 0);
  }
}

export default AppContainer;
