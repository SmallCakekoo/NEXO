import { store, State } from "../flux/Store";
import { NavigationActions } from "../flux/NavigationActions";

class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.render();
    store.subscribe((state: State) => {
      this.handleRouteChange(state);
    });
  }

  connectedCallback() {
    store.load();
    this.render();

    // Manejar navegación a través de Flux
    document.addEventListener("navigate", (event: Event) => {
      const route = (event as CustomEvent).detail;
      if (typeof route === "string") {
        NavigationActions.updateRoute(route);
      }
    });

    // Suscribirse al store para actualizar la vista cuando cambie la ruta
    store.subscribe((state: State) => {
      this.handleRouteChange(state);
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <landing-page></landing-page>
    `;
  }

  private handleRouteChange(state: State) {
    const route = state.currentPath;
    this.updateView(route);
    window.scrollTo(0, 0);
  }

  private updateView(route: string) {
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
      case "./login":
        newComponent = "<login-component></login-component>";
        break;
      case "./signup":
        newComponent = "<sign-up-component></sign-up-component>";
        break;
      case "/":
        newComponent = "<landing-page></landing-page>";
        break;
      default:
        newComponent = "<landing-page></landing-page>";
    }
    // falta la ruta de comments-detail-feed-page
    this.shadowRoot!.innerHTML = newComponent;
    window.scrollTo(0, 0);
  }
}

export default AppContainer;
