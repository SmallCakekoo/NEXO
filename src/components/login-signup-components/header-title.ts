class HeaderTitle extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    this.innerHTML = `
      <div style="text-align:center; margin-bottom: 16px;">
        <h2 style="font-size: 1.5rem; font-weight: bold;">${title}</h2>
        <p style="color: #666;">${subtitle}</p>
      </div>
    `;
  }
}
customElements.define('header-title', HeaderTitle);

export default HeaderTitle;