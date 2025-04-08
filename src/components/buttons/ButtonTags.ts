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
  
    
    connectedCallback() {
      this.render();
    }
  
    render() {
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
          <style>
            button {
              padding: 8px 40px;
              border-radius: 999px;
              border: 2px solid blue;
              color: #5354ED;
              background-color: white;
              font-size: 14px;
              cursor: pointer;
              transition: background-color 0.3s ease;
              
            }
  
            button:hover {
              background-color:rgba(83, 83, 237, 0.32);
              color:#5354ED; 
            }
  
            button:active {
              background-color:#5354ED;
              color:rgb(255, 255, 255);
            }
          </style>
  
          <button>${this.getAttribute('textbutton')}</button>
        `;
      }
    }
  }
  
  export default ButtonTags;