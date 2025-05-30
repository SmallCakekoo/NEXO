class FeedPage extends HTMLElement {
  private scrollPosition: number = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      const event = new CustomEvent("navigate", {
        detail: "/login",
        composed: true,
      });
      document.dispatchEvent(event);
      return;
    }
    this.render();
    this.setupEventListeners();

    // Restore scroll position if returning from comments
    if (sessionStorage.getItem("returnToFeed") === "true") {
      const savedPosition = sessionStorage.getItem("feedScrollPosition");
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPosition));
          sessionStorage.removeItem("returnToFeed");
        }, 100);
      }
    }
  }

  disconnectedCallback() {
    // Save the current scroll position when leaving the feed
    sessionStorage.setItem("feedScrollPosition", window.scrollY.toString());
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  setupEventListeners() {
    // Track scroll position
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    this.scrollPosition = window.scrollY;
  }

  render() {
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
