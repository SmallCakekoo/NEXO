class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    document.addEventListener("navigate", (event: Event) => {
      const route = (event as CustomEvent).detail;
      this.updateView(route);
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <landing-page></landing-page>
        `;
  }

  updateView(route: string) {
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
      default:
        newComponent = "<feed-page></feed-page>";
    }

    this.shadowRoot!.innerHTML = newComponent;
    window.scrollTo(0, 0);
  }
}

export default AppContainer;
