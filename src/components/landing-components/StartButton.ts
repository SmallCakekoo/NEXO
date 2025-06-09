import { NavigationActions } from "../../flux/NavigationActions";

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
      <style>
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
  transition: all 0.3s ease;
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
  transition: all 0.1s ease;
}
      </style>
      <button id="start">Start Now</button>
    `;

    this.shadowRoot!.querySelector("#start")?.addEventListener("click", () => {
      NavigationActions.navigate("/login");
    });
  }
}

export default StartButton;
