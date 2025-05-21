class Divider extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.3125rem 0; 
          width: 100%;
        }

        .divider hr {
          flex-grow: 1;
          min-width: 9.375rem; 
          border: none;
          height: 0.09375rem; 
          background-color: rgb(77, 77, 77);
        }

        .divider span {
          margin: 0 0.75rem; 
          font-family: 'TTRounds2', sans-serif !important;
          color: #666666;
          font-size: 1rem; 
        }

        @font-face {
          font-family: 'TTRounds2';
          src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF') format('woff2');
          font-weight: bold;
          font-style: normal;
        }

        @media (max-width: 430px) {
          .divider hr {
            min-width: 5rem; 
          }

          .divider span {
            font-size: 0.875rem; 
          }
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
