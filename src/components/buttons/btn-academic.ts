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
     <style>
         button {
          background-color: #5354ED;
          color: white;
          font-size: 14px;
          border: 2px solid black;
          padding: 7px 30px;
          border-radius: 50px;
          cursor: pointer;
          outline: none;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.2s ease-in-out;
        }

        button:hover {
          filter: brightness(1.2);
          transform: scale(1.05);
          -webkit-box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
          -moz-box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
          box-shadow: 0px 6px 0px -4px rgba(0,0,0,1);
        }

        button:active {
          transform: scale(0.95);
          -webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
          -moz-box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
          box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
        }
      </style>
      <button id="academic-button">Academics</button>
    `;

    this.shadowRoot!.querySelector("#academic-button")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("navigate", { detail: "academic", bubbles: true }));
    });
  }
}

export default BtnAcademic;
