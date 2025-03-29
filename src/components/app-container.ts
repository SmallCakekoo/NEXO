class AppContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <feed-page></feed-page> <!-- cambiar después -->
        `;
    }
}

export default AppContainer;
