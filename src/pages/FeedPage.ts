import { NavigationActions } from "../flux/NavigationActions";
import { store, State } from "../flux/Store";

class FeedPage extends HTMLElement {
  private scrollPosition: number = 0;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  connectedCallback() {
    store.load();
    this.subscribeToStore();
    this.render();
    this.setupEventListeners();

    if (store.getReturnToFeed()) {
      const savedPosition = store.getScrollPosition();
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          store.clearReturnToFeed();
        }, 100);
      }
    }
  }

  disconnectedCallback() {
    store.saveScrollPosition(window.scrollY);
    window.removeEventListener("scroll", this.handleScroll.bind(this));

    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
  }

  private handleStoreChange(state: State) {
    // Always call render on store change for debugging
    console.log("FeedPage handleStoreChange");
    if (!state.auth.isAuthenticated) {
      NavigationActions.navigate("/login");
    }
    this.render();
  }

  setupEventListeners() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    this.scrollPosition = window.scrollY;
  }

  render() {
    console.log("FeedPage render");
    this.shadowRoot!.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
            background-color: white;
          }
        </style>
        <nav-bar></nav-bar> 
        <tag-filters-bar></tag-filters-bar>
        <post-container></post-container>
        <floating-btn></floating-btn>
        <post-modal></post-modal>
      `;
  }
}

export default FeedPage;
