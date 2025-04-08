class BtnAcademic extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    this.shadowRoot!.innerHTML = `
      <link rel="stylesheet" href="/styles/components/navbar/BtnAcademics.css">
      <button id="academic-button">Academics</button>
    `;

    this.shadowRoot!.querySelector("#academic-button")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navigate", { detail: "academic", bubbles: true }));
    });
  }
}

export default BtnAcademic;
