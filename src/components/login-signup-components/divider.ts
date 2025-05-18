class Divider extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.3125rem 0; /* 21px */
          width: 100%;
        }

        .divider hr {
          flex-grow: 1;
          min-width: 9.375rem; /* 150px */
          border: none;
          height: 0.09375rem; /* 1.5px */
          background-color: rgb(77, 77, 77);
        }

        .divider span {
          margin: 0 0.75rem; /* 12px */
          font-family: 'TTRounds2', sans-serif !important;
          color: #666666;
          font-size: 1rem; /* 16px */
        }

        @font-face {
          font-family: 'TTRounds2';
          src: url('/assets/fonts/ttround/TT ROUNDS NEUE BOLD ITALIC.TTF') format('woff2');
          font-weight: bold;
          font-style: normal;
        }

        @media (max-width: 35.875rem) {
          .divider hr {
            min-width: 5rem; /* 80px */
          }

          .divider span {
            font-size: 0.875rem; /* 14px */
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
