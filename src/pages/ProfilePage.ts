import { store } from "../flux/Store";

class ProfilePage extends HTMLElement {
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.load(); // Only loads posts when this page is attached
    this.subscribeToStore();
    this.render();
  }

  private subscribeToStore() {
    this.unsubscribeStore = store.subscribe(() => this.render());
  }

  disconnectedCallback() {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  render() {
    this.shadowRoot!.innerHTML = `
            <style>
                h2 { color: #4f46e5; }
            </style>
            
            <nav-bar></nav-bar>
            <profile-header></profile-header>
            <profile-container></profile-container>

        `;

    // Escuchar el evento de navegación
    document.addEventListener('navigate', (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const target = customEvent.detail;
      if (target === '/comments-detail-feed') {
        window.location.href = target;
      }
    });
  }
}

export default ProfilePage;
