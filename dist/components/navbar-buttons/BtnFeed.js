class BtnFeed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
     <link rel="stylesheet" href="/styles/components/navbar/BtnFeed.css">
      <button id="feed-button">Feed</button>
    `;
        this.shadowRoot.querySelector("#feed-button")?.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("navigate", { detail: "feed", bubbles: true }));
        });
    }
}
export default BtnFeed;
//# sourceMappingURL=BtnFeed.js.map