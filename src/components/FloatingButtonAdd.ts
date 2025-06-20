import { FeedActions } from "../flux/FeedActions";

class FloatingButtonAdd extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
     <style>
     
.fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: var(--nexopurple);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
}

.fab:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.fab:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.fab svg {
    width: 24px;
    height: 24px;
    fill: var(--nexowhite);
}


    </style>        
     <button class="fab" title="Crear Publicación">
        <img src="https://api.iconify.design/lucide:plus.svg?color=white" alt="Plus Icon">
      </button>
    `;

    const button = this.shadowRoot!.querySelector("button")!;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      FeedActions.openPostModal("");
    });
  }
}

export default FloatingButtonAdd;
