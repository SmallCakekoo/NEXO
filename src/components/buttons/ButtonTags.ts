export enum TextButton {
    textbutton = "textbutton"
  }
  
  class ButtonTags extends HTMLElement {
    textbutton?: string;
  
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    static get observedAttributes(): string[] {
      return Object.values(TextButton);
    }
  
    attributeChangedCallback(propName: string, oldValue: string, newValue: string) {
      if (propName === TextButton.textbutton) {
        this.textbutton = newValue;
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
  
          <button>${this.textbutton || "Default Text"}</button>
        `;
      }
    }
  }
  
  export default ButtonTags;