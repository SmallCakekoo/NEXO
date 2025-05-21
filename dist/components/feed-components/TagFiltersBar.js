class TagFiltersBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
      <style>
        .section-buttons {
          width: 100vw; 
          display: flex; 
          gap: 6%;
          padding: 2% 0;
          justify-self: center;
          justify-content: center;
        }
      </style>

      <section class="section-buttons">
        <button-tags textbutton="All"></button-tags>
        <button-tags textbutton="Daily life"></button-tags>
        <button-tags textbutton="Carpool"></button-tags>
        <button-tags textbutton="Academics"></button-tags>
      </section>
    `;
    }
}
export default TagFiltersBar;
//# sourceMappingURL=TagFiltersBar.js.map