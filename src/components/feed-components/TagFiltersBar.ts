class TagFiltersBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
     <link rel="stylesheet" href="/styles/components/feed/TagFiltersBar.css">
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
