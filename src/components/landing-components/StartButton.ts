class StartButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
  }

  render(): void {
    this.shadowRoot!.innerHTML = `

  
    
      <link rel="stylesheet" href="/styles/components/landing/startButton.css">
    <button id = "start"> Start Now</button>
    `;



    // this.shadowRoot!.querySelector("#start-button")?.addEventListener("click", () => {
    //   this.dispatchEvent(new CustomEvent("navigate", { detail: "start", bubbles: true }));
    // });
  }
}

export default StartButton;
    //   <link rel="stylesheet" href="/styles/components/navbar/BtnAcademics.css">