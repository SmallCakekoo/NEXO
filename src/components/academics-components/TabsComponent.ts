import { SearchActions } from "../../flux/SearchActions";
import { store, State } from "../../flux/Store";

class TabsComponent extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log("TABS COMPONENT! ========================================")
    this.render();
    this.setupEventListeners();
    this.unsubscribeStore = store.subscribe(this.handleStoreChange.bind(this));
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  handleStoreChange(state: State) {
    
    const activeTab = state.navigation.activeAcademicTab
    const currentTab = this.shadowRoot?.querySelector(".nav-tabs")?.getAttribute("data-active-tab");
    if (currentTab === activeTab){
     console.log("============ MISMA TAB =============="); // No change needed
      return;
    } else {
      this.updateActiveTab(activeTab);
    }
  }

  setupEventListeners() {
    const navTabs = this.shadowRoot?.querySelector(".nav-tabs");
    const buttons = this.shadowRoot?.querySelectorAll(".nav-link");
    const tabPanes = this.shadowRoot?.querySelectorAll(".tab-pane");
    const SearchBar = this.shadowRoot?.querySelector("search-bar")

    if (!buttons || !tabPanes) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-target");
        if (target) {
          // Update active button
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          // Update active tab pane
          tabPanes.forEach((pane) => {
            pane.classList.remove("show", "active");
            if (pane.id === target) {
              pane.classList.add("show", "active");
            }
          });

          // Update nav-tabs data attribute
          if (navTabs) {
            navTabs.setAttribute("data-active-tab", target);
            SearchBar?.setAttribute("searchtype", target);
            state.navigation.activeAcademicTab = target;
          }
        }
      });
    });

    // Set initial active tab from store
    const state = store.getState();
    this.updateActiveTab(state.navigation.activeAcademicTab);
  }

  updateActiveTab(activeTab: string) {
    const navTabs = this.shadowRoot?.querySelector(".nav-tabs");
    const activeButton = this.shadowRoot?.querySelector(`[data-target="${activeTab}"]`);
    const activePane = this.shadowRoot?.querySelector(`#${activeTab}`);

    
    if (activeButton && activePane && navTabs) {
      // Update active button
      const buttons = this.shadowRoot?.querySelectorAll(".nav-link");
      buttons?.forEach(btn => btn.classList.remove("active"));
      activeButton.classList.add("active");

      // Update active tab pane
      const tabPanes = this.shadowRoot?.querySelectorAll(".tab-pane");
      tabPanes?.forEach(pane => pane.classList.remove("show", "active"));
      activePane.classList.add("show", "active");

      // Update nav-tabs data attribute
      navTabs.setAttribute("data-active-tab", activeTab);
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
      <style>
       
  
        .project-tab {
          padding: 20px;
          background: white;
          border-radius: 8px;
        }
  
        .nav-tabs {
          border-bottom: 2px solid var(--nexolightwhite);
          margin-bottom: 20px;
          position: relative;
        }
  
        .nav-tabs::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 50%;
          height: 2px;
          background-color: var(--nexopurple);
          transition: transform 0.3s ease;
        }
  
        .nav-tabs[data-active-tab="subjects"]::after {
          transform: translateX(100%);
        }
  
        .nav-tabs .nav-link {
          color: rgb(100, 100, 100);
          border: none;
          padding: 10px 20px;
          font-weight: 500;
          position: relative;
        }
  
        .nav-tabs .nav-link:hover {
          color: var(--nexopurple);
          border: none;
        }
  
        .nav-tabs .nav-link.active {
          color: var(--nexopurple);
          background: none;
          border: none;
        }
  
        .tab-content {
          padding: 20px 0;
        }
  
        .tab-pane {
          display: none;
        }
  
        .tab-pane.show.active {
          display: block;
        }
      </style>
  
      <section id="tabs" class="project-tab">
        <div class="container">
          <nav>
            <div class="nav nav-tabs nav-fill" data-active-tab="teacher">
              <button class="nav-item nav-link" data-target="teacher" type="button">Teacher Reviews</button>
              <button class="nav-item nav-link" data-target="subjects" type="button">Subjects Reviews</button>
            </div>
          </nav>
  
          <search-bar searchtype="teacher"></search-bar>
  
          <div class="tab-content">
            <div class="tab-pane" id="teacher">
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
}

export default TabsComponent;
