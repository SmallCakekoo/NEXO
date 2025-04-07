class TabsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupTabs();
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="/styles/components/academics/TabsComponent.css">
            <section id="tabs" class="project-tab">
              
                <div class="container">
                    <nav>
                        <div class="nav nav-tabs nav-fill" data-active-tab="teacher">
                            <button class="nav-item nav-link active" data-target="teacher" type="button">Teacher Reviews</button>
                            <button class="nav-item nav-link" data-target="subjects" type="button">Subjects Reviews</button>
                        </div>
                    </nav>
                       <search-bar></search-bar>
                    <div class="tab-content">
                        <div class="tab-pane show active" id="teacher">
                            <teachers-container></teachers-container>
                        </div>
                        <div class="tab-pane" id="subjects">
                            <subjects-container></subjects-container>
                        </div>
                    </div>
                </div>
            </section>
        `;
  }

  // Sets up tab switching behavior by listening for button clicks
  setupTabs() {
    const triggerTabList = Array.from(
      this.shadowRoot!.querySelectorAll<HTMLElement>("[data-target]")
    );
    const navTabs = this.shadowRoot!.querySelector(".nav-tabs") as HTMLElement;

    // Add click events to each tab button
    triggerTabList.forEach((triggerEl) => {
      triggerEl.addEventListener("click", (event: Event) => {
        event.preventDefault();

        // Hide all tab panes
        const allPanes = this.shadowRoot!.querySelectorAll(".tab-pane");
        allPanes.forEach((pane) => {
          pane.classList.remove("show", "active");
        });

        // Remove "active" class from all buttons
        const allButtons = this.shadowRoot!.querySelectorAll(".nav-link");
        allButtons.forEach((button) => {
          button.classList.remove("active");
        });

        // Get the ID of the tab to show
        const targetId = triggerEl.getAttribute("data-target");
        if (targetId) {
          const targetPane = this.shadowRoot!.querySelector(`#${targetId}`);
          if (targetPane) {
            // Mark a active
            targetPane.classList.add("show", "active");
          }
          triggerEl.classList.add("active");
          // Update the active
          navTabs.setAttribute("data-active-tab", targetId);
        }
      });
    });
  }
}

export default TabsComponent;
