class HeaderTitle extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    this.innerHTML = `
      <style>
    @font-face {
      font-family: 'TTRounds';
      src: url('/assets/ttround/TTRoundsNeue-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'TTRounds';
      src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD.TTF') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

      @font-face {
      font-family: 'TTRounds2';
      src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    .container {
    text-align: center;
    }

    .text {
      font-family: 'TTRounds', sans-serif !important;
      font-size: 48px;
      margin-top: 25px;
    }
      
    .subtitle {
      font-family: 'TTRounds2', sans-serif !important;
      font-size: 18px;
      color: #666666;
      margin-bottom: 40px;
    }

      </style>
      <div class="container">
        <h2 class="text">${title}</h2>
        <p class="subtitle">${subtitle}</p>
      </div>
    `;
  }
}
customElements.define('header-title', HeaderTitle);

export default HeaderTitle;