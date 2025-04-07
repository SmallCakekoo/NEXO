class BtnProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="/styles/components/navbar/BtnProfile.css">
      <button id="profile-button">Profile</button>
    `;

    this.shadowRoot!.querySelector("#profile-button")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navigate", { detail: "profile", bubbles: true }));
    });
  }
}

export default BtnProfile;
