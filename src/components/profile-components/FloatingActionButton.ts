class FloatingActionButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
                .fab {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background-color: #6366F1;
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
                    fill: white;
                }
            </style>
            <button class="fab">
                <svg viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
            </button>
        `;
    }

    addEventListeners() {
        const fab = this.shadowRoot!.querySelector('.fab');
        fab?.addEventListener('click', () => {
            // Aquí se puede agregar la lógica para crear un nuevo post
            const event = new CustomEvent('new-post-click');
            this.dispatchEvent(event);
        });
    }
}

export default FloatingActionButton; 