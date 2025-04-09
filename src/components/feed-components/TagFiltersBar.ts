import { Post } from '../../types/feed/feeds.types';

class TagFiltersBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const buttons = this.shadowRoot!.querySelectorAll('button-tags');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const tag = button.getAttribute('textbutton');
        console.log(`Tag selected: ${tag}`);
        this.dispatchEvent(new CustomEvent('tagSelected', { detail: { tag }, bubbles: true, composed: true }));
      });
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
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
        <button-tags textbutton="Daily Life"></button-tags>
        <button-tags textbutton="Carpool"></button-tags>
        <button-tags textbutton="Academics"></button-tags>
      </section>
    `;
  }
}

// if (!customElements.get('tag-filters-bar')) {
//   customElements.define('tag-filters-bar', TagFiltersBar);
// }

export default TagFiltersBar; 