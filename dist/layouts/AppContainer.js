class AppContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
        document.addEventListener("navigate", (event) => {
            const route = event.detail;
            this.updateView(route);
        });
    }
    render() {
        this.shadowRoot.innerHTML = `
            <feed-page></feed-page> 
        `;
    }
    updateView(route) {
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
            default:
                newComponent = "<feed-page></feed-page>";
        }
        this.shadowRoot.innerHTML = newComponent;
        window.scrollTo(0, 0);
    }
}
export default AppContainer;
//# sourceMappingURL=AppContainer.js.map