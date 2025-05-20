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

    <styles>
          #start{
      background-color: #5354ed;
      color: white;
      font-size: 12px;
      border: 2px solid black;
      padding: 15px 85px;
      border-radius: 50px;
      cursor: pointer;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #start:hover {
      filter: brightness(1.2);
      transform: scale(1.05);
      -webkit-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
      -moz-box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
      box-shadow: 0px 6px 0px -4px rgba(0, 0, 0, 1);
    }

    #start:active {
      transform: scale(0.95);
      -webkit-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
      -moz-box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
      box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
      filter: brightness(0.8);
    }
    
    </styles>
  
    <button id = "start"> Start Now</button>
    `;



    // this.shadowRoot!.querySelector("#start-button")?.addEventListener("click", () => {
    //   this.dispatchEvent(new CustomEvent("navigate", { detail: "start", bubbles: true }));
    // });
  }
}

export default StartButton;
    //   <link rel="stylesheet" href="/styles/components/navbar/BtnAcademics.css">