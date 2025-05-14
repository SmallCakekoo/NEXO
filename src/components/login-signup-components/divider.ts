class Divider extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 21px 0;
          width: 100%;
        }

        .divider hr {
          flex-grow: 1;
          min-width: 150px;
          border: none;
          height: 1.5px;
          background-color:rgb(77, 77, 77);
        }

        .divider span {
          margin: 0 12px;
          font-family: 'TTRounds2', sans-serif !important;
          color: #666666;
          font-size: 16px;
        }

            @font-face {
          font-family: 'TTRounds2';
          src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF') format('woff2');
          font-weight: bold;
          font-style: normal;
        }
      </style>

      <div class="divider">
        <hr />
        <span>or</span>
        <hr />
      </div>
    `;
  }
}
customElements.define('custom-divider', Divider);
export default Divider;

