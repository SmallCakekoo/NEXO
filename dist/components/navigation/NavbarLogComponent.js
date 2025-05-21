class NavBarLog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
        this.addBootstrapFunctionality();
        this.setupNavigation();
    }
    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/styles/components/navbar/NavbarLogComponent.css">
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <img src="/assets/images/logonexobig.webp" alt="Logo">
                    </a>
                    <button class="navbar-toggler" type="button" id="toggleBtn">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <div class="buttons d-flex desktop-buttons">
                            <btn-feed></btn-feed>
                            <btn-academic></btn-academic>
                            <btn-profile></btn-profile>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="overlay" id="overlay"></div>
            <div class="mobile-menu" id="mobileMenu">
                <div class="buttons">
                    <btn-feed></btn-feed>
                    <btn-academic></btn-academic>
                    <btn-profile></btn-profile>
                </div>
            </div>
        `;
    }
    // Handles toggling the mobile menu and overlay using Bootstrap-like behavior
    addBootstrapFunctionality() {
        const toggleBtn = this.shadowRoot.querySelector("#toggleBtn");
        const overlay = this.shadowRoot.querySelector("#overlay");
        const mobileMenu = this.shadowRoot.querySelector("#mobileMenu");
        if (toggleBtn && overlay && mobileMenu) {
            // Toggle menu on button click
            toggleBtn.addEventListener("click", () => {
                const isExpanded = mobileMenu.classList.contains("show");
                mobileMenu.classList.toggle("show", !isExpanded);
                overlay.classList.toggle("show", !isExpanded);
            });
            // Close menu when clicking outside
            overlay.addEventListener("click", () => {
                mobileMenu.classList.remove("show");
                overlay.classList.remove("show");
            });
        }
    }
    // Sets up click listeners for navigation buttons and dispatches custom events
    setupNavigation() {
        const buttons = this.shadowRoot.querySelectorAll("btn-feed, btn-academic, btn-profile");
        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                let route = "";
                // Determine route based on the button tag
                if (btn.tagName.toLowerCase() === "btn-feed")
                    route = "/feed";
                if (btn.tagName.toLowerCase() === "btn-academic")
                    route = "/academic";
                if (btn.tagName.toLowerCase() === "btn-profile")
                    route = "/profile";
                this.navigate(route);
            });
        });
    }
    // Dispatches a custom navigation event to notify the app of news route changes
    navigate(route) {
        const event = new CustomEvent("navigate", { detail: route });
        document.dispatchEvent(event);
    }
}
export default NavBarLog;
//# sourceMappingURL=NavbarLogComponent.js.map