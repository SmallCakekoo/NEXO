class HeaderTitle extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
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
          font-family: 'TTRounds', sans-serif;
          font-size: 3rem; 
          margin-top: 1.563rem; 
          margin-bottom: 0.625rem; 
          color: #000;
        }

        .subtitle {
          font-family: 'TTRounds2', sans-serif;
          font-size: 1.125rem; 
          color: #666666;
          margin-top: 0;
          margin-bottom: 2.5rem; 
        }

        @media (max-width: 430px) {
          .text {
            font-size: 3rem; 
            color: #5a48f3;
            font-family: 'TTRounds2', sans-serif;
          }

          .subtitle {
            display: none;
          }

          .container {
            text-align: left;
          }
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
