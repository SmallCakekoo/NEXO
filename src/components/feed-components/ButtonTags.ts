export enum TextButton {
  textbutton = "textbutton",
  active = "active",
}

class ButtonTags extends HTMLElement {
  textbutton?: string;
  active?: boolean;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): string[] {
    return Object.values(TextButton);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === TextButton.active) {
      this.active = newValue !== null;
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
              padding: 8px 40px;
              border-radius: 999px;
              border: 2px solid #5354ED;
              color: #5354ED;
              background-color: white;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
              width: 100%;
              max-width: 100%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
  
            button:hover {
              background-color:rgba(83, 83, 237, 0.32);
              color:#5354ED; 
            }
  
            button:active {
              background-color:#5354ED;
              color:rgb(255, 255, 255);
            }

            button.active {
              background-color:#5354ED;
              color:rgb(255, 255, 255);
            }

            @media (max-width: 644px) {
              button {
                padding: 8px 12px;
                font-size: 13px;
                width: 100%;
              }
            }

            @media (max-width: 400px) {
              button {
                padding: 6px 8px;
                font-size: 12px;
                border-width: 1.5px;
              }
            }
          </style>
  
          <button class="${this.active ? "active" : ""}">${this.getAttribute("textbutton")}</button>
        `;
    }
  }
}

export default ButtonTags;
