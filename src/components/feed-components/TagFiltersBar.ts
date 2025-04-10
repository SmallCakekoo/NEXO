class TagFiltersBar extends HTMLElement {
  private activeTag: string = "All";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    setTimeout(() => {
      this.addEventListeners();
      this.updateActiveButton();
    }, 0);
  }

  addEventListeners() {
    const buttons = this.shadowRoot!.querySelectorAll("button-tags");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const tag = button.getAttribute("textbutton");
        console.log(`Tag selected in filter bar: ${tag}`);
        this.activeTag = tag || "All";
        this.updateActiveButton();

        const event = new CustomEvent("tagSelected", {
          detail: { tag },
          bubbles: true,
          composed: true,
        });
        document.dispatchEvent(event);
      });
    });
  }

  updateActiveButton() {
    const buttons = this.shadowRoot!.querySelectorAll("button-tags");
    buttons.forEach((button) => {
      const buttonTag = button.getAttribute("textbutton");
      if (buttonTag === this.activeTag) {
        button.setAttribute("active", "true");
      } else {
        button.removeAttribute("active");
      }
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
    <link rel="stylesheet" href="/styles/components/feed/TagFiltersBar.css">
      <section class="section-buttons">
        <button-tags textbutton="All"></button-tags>
        <button-tags textbutton="Daily Life"></button-tags>
        <button-tags textbutton="Carpool"></button-tags>
        <button-tags textbutton="Academics"></button-tags>
      </section>
    `;
  }
}

export default TagFiltersBar;
