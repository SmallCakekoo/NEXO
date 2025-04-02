export enum TxtButton {
    txtbutton = "txtbutton"
  }
  
  class Buttons extends HTMLElement {
    txtbutton?: string;
  
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    static get observedAttributes(): string[] {
      return Object.values(TxtButton);
    }
  
    attributeChangedCallback(propName: string, oldValue: string, newValue: string) {
      if (propName === TxtButton.txtbutton) {
        this.txtbutton = newValue;
        this.render();
      }
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
          <style>
            button {
              padding: 8px 16px;
              border-radius: 999px;
              border: 2px solid blue;
              color: blue;
              background-color: white;
              font-size: 14px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
  
            button:hover {
              background-color: rgba(173, 216, 230, 0.5);
            }
  
            button.active {
              background-color: lightblue;
              color: white;
            }
          </style>
  
          <button>${this.txtbutton || "Default Text"}</button>
        `;
      }
    }
  }
  
  customElements.define("text-button", Buttons);
  export default Buttons;