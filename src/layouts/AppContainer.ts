import { store, State } from "../flux/Store";
import { NavigationActions } from "../flux/NavigationActions";
import { AuthActions } from "../flux/AuthActions";

class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  connectedCallback() {
    store.load();

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
    let newComponent = "";

    switch (route) {
      case "/feed":
        newComponent = "<feed-page></feed-page>";
        break;
      case "/academic":
        newComponent = "<academics-pages></academics-pages>";
        break;
      case "/profile":
        newComponent = "<profile-page></profile-page>";
        break;
      case "/profile-settings":
        newComponent = "<profile-settings-page></profile-settings-page>";
        break;
      case "/teacher-detail":
        newComponent = "<teacher-detail-page></teacher-detail-page>";
        break;
      case "/subject-detail":
        newComponent = "<subject-detail-page></subject-detail-page>";
        break;
      case "/comments-detail":
        newComponent = "<comments-detail-page></comments-detail-page>";
        break;
      case "/comments-detail-profile":
        newComponent = "<comments-detail-profile></comments-detail-profile>";
        break;
      case "/login":
        newComponent = "<login-component></login-component>";
        break;
      case "/signup":
        newComponent = "<sign-up-component></sign-up-component>";
        break;
      case "/":
        newComponent = "<landing-page></landing-page>";
        break;
      default:
        console.warn(`Unknown route: ${route}. Redirecting to landing page.`);
        newComponent = "<landing-page></landing-page>";
        break;
    }
    this.shadowRoot!.innerHTML = newComponent;
    window.scrollTo(0, 0);
  }
}

export default AppContainer;
