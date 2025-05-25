class ProfilePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
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
