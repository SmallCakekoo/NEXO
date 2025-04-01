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
            <feed-page></feed-page> 
        `;
    }

    updateView(route: string) {
        let newComponent = "";

        switch (route) {
            case "/feed":
                newComponent = "<feed-page></feed-page>";
                break;
            case "/academic":
                newComponent = "<academic-page></academic-page>";
                break;
            case "/profile":
                newComponent = "<profile-page></profile-page>";
                break;
            case "/profile-settings":
                newComponent = "<profile-settings-page></profile-settings-page>";
                break;
            default:
                newComponent = "<feed-page></feed-page>";
        }

        this.shadowRoot!.innerHTML = newComponent;
    }
}

export default AppContainer;
