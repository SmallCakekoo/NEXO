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
    <style>
    .section-buttons {
  width: 100%;
  display: flex;
  gap: 6%;
  padding: 2% 0;
  justify-self: center;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 644px) {
  .section-buttons {
    gap: 4%;
    padding: 3% 2%;
    row-gap: 12px;
  }

  .button-tags {
    margin-bottom: 0;
    width: 48%;
    min-width: 48%;
    max-width: 48%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    flex: none;
  }
}

@media (max-width: 400px) {
  .section-buttons {
    gap: 3%;
    padding: 3% 2%;
    row-gap: 10px;
  }

  .button-tags {
    width: 47%;
    min-width: 47%;
    max-width: 47%;
    height: 36px;
    font-size: 0.85rem;
    padding: 6px 8px;
  }
}

    </style>
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
