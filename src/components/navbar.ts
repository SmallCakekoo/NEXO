class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.addBootstrapFunctionality();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                nav {
                    background: #DDDDFB;
                    padding: 10px 20px;
                }

                img {
                    width: 150px;
                }

                .navbar-toggler {
                    border: none;
                    outline: none;
                }

                .navbar-toggler:focus {
                    box-shadow: none;
                }

                .navbar-toggler-icon {
                    background-image: url("data:image/svg+xml;charset=UTF8,%3Csvg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%235354ED' stroke-width='4' stroke-linecap='round' stroke-miterlimit='10' d='M4 8h24M4 16h24M4 24h24'/%3E%3C/svg%3E");
                }

                .buttons {
                    display: flex;
                    gap: 20px;
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
                        <div class="buttons d-flex">
                            <btn-feed></btn-feed>
                            <btn-academic></btn-academic>
                            <btn-profile></btn-profile>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    addBootstrapFunctionality() {
        const toggleBtn = this.shadowRoot!.querySelector("#toggleBtn");
        const navbarNav = this.shadowRoot!.querySelector("#navbarNav");

        if (toggleBtn && navbarNav) {
            toggleBtn.addEventListener("click", () => {
                const isExpanded = navbarNav.classList.contains("show");
                navbarNav.classList.toggle("show", !isExpanded);
            });
        }
    }
}

export default NavBar;