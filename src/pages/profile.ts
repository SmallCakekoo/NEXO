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
  }
}

export default ProfilePage;
