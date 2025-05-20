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
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
  nav {
    background: #ddddfb;
    padding: 10px 20px;
    box-shadow: 1px 2px 14px -3px rgba(112, 112, 112, 0.39);
  border-bottom: 1px solid #5354ed;
  position: relative;
  z-index: 1000;
}
img {
  width: 150px;
  margin-left: 20px;
}
.navbar-toggler {
  border: 1px solid #5354ed;
  border-radius: 8px;
  color: #5354ed;
  background-color: transparent;
  transition: all 0.3s ease;
}
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%235354ED' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
.navbar-toggler:focus {
  box-shadow: none;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 90px;
  justify-content: flex-end;
}
.desktop-buttons {
  padding-right: 50px;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.16);
  opacity: 0;
  visibility: hidden;
  z-index: 998;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}
.overlay.show {
  opacity: 1;
  visibility: visible;
}
.mobile-menu {
  position: fixed;
  top: 80px;
  right: 1px;
  transform: translateX(100%);
  background: #ddddfb;
  padding: 20px;
  border-radius: 0px 0px 0px 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: auto;
  min-width: 10px;
  max-width: 90vw;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 999;
}
.mobile-menu.show {
  opacity: 1;
  transform: translateX(0);
}
@media (max-width: 576px) {
  .navbar-collapse {
    display: none;
  }
  .mobile-menu .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    width: 100%;
  }
  .buttons > * {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
  .mobile-menu {
    max-width: calc(100vw - 40px);
  }
}

        </style>
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
    const toggleBtn = this.shadowRoot!.querySelector("#toggleBtn");
    const overlay = this.shadowRoot!.querySelector("#overlay");
    const mobileMenu = this.shadowRoot!.querySelector("#mobileMenu");

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
    const buttons = this.shadowRoot!.querySelectorAll("btn-feed, btn-academic, btn-profile");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        let route = "";

        // Determine route based on the button tag
        if (btn.tagName.toLowerCase() === "btn-feed") route = "/feed";
        if (btn.tagName.toLowerCase() === "btn-academic") route = "/academic";
        if (btn.tagName.toLowerCase() === "btn-profile") route = "/profile";

        this.navigate(route);
      });
    });
  }

  // Dispatches a custom navigation event to notify the app of news route changes
  navigate(route: string) {
    const event = new CustomEvent("navigate", { detail: route });
    document.dispatchEvent(event);
  }
}

export default NavBarLog;
