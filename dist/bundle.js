(()=>{"use strict";var e={28:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.Comments=void 0,function(e){e.photo="photo",e.name="name",e.degree="degree",e.semestre="semestre",e.comment="comment",e.tag="tag",e.likes="likes",e.share="share",e.comments="comments"}(n||(t.Comments=n={}));class s extends HTMLElement{photo;name;degree;semestre;comment;tag;likes;share;comments;liked=!1;constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return Object.values(n)}attributeChangedCallback(e,t,s){e===n.likes?this.likes=s?Number(s):0:"string"==typeof s&&(this[e]=s),this.render()}connectedCallback(){this.render()}render(){if(this.shadowRoot){this.shadowRoot.innerHTML=`\n    \n     <style>\n          .like-icon path {\n            transition: fill 0.2s ease;\n          }\n          .liked path {\n            fill: #5354ED;\n          }\n\n        .tag {\n        display: inline-block;\n        padding: 4px 12px;\n        border: 2px solid blue;\n        border-radius: 9999px;\n        color: blue;\n        background-color: white;\n        font-weight: 500;\n        font-size: 14px;\n        text-align: center;\n        }\n\n\n\n        </style>\n\n      <div class="post">\n        <img src = "${this.getAttribute("photo")}" alt="Profile Picture"></img>\n        <p class ="name" >${this.getAttribute("name")}</p>\n        <p class ="degree">${this.getAttribute("degree")}</p>\n        <p class = "semestre" >${this.getAttribute("semestre")}</p>\n        <p class = "comment">${this.getAttribute("comment")}</p>\n        <p class = "tag">${this.getAttribute("tag")}</p>\n        \n        \n        <div class="footer">  \n        \n          <span class="like-container">\n              <svg class="like-icon ${this.liked?"liked":""}" width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M12.7464 23.2537C11.7824 22.1867 10.8249 21.1323 9.87383 20.085C7.31961 17.2723 4.81148 14.5103 2.34597 11.6898C0.773723 9.89096 0.332623 7.56671 1.1388 5.08706L1.13897 5.08653C1.59819 3.66875 2.28959 2.61501 3.14928 1.87999C4.00778 1.146 5.05873 0.708648 6.27301 0.56093L6.27324 0.560901C8.18576 0.327335 9.91152 1.01555 11.2516 2.75032L11.2517 2.75044C11.6809 3.30579 12.1673 3.76156 12.7883 3.72877C13.0931 3.71267 13.3582 3.57968 13.5865 3.40862C13.8132 3.23878 14.0345 3.00803 14.258 2.74435L14.2581 2.74424C15.5752 1.18896 17.2069 0.470129 18.7899 0.500952C20.374 0.531795 21.9713 1.31447 23.2157 2.88331C25.2234 5.41663 25.2838 9.19751 23.2151 11.5909L23.2151 11.591C20.745 14.4504 18.2166 17.2308 15.6497 20.0535C14.687 21.1121 13.7189 22.1767 12.7464 23.2537Z" stroke="#5354ED" fill="${this.liked?"#5354ED":"none"}"/>\n              </svg>\n              ${this.getAttribute("likes")} Likes\n            </span>\n        \n        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.0611 5.11333C20.177 5.2083 20.2441 5.35021 20.2441 5.5V18.5C20.2441 18.6498 20.177 18.7917 20.0611 18.8867C19.9453 18.9816 19.793 19.0197 19.6461 18.9903L4.64608 15.9903C4.41237 15.9436 4.24414 15.7383 4.24414 15.5V8.5C4.24414 8.26166 4.41237 8.05646 4.64608 8.00971L19.6461 5.00971C19.793 4.98034 19.9453 5.01836 20.0611 5.11333ZM5.24414 8.90991V15.0901L19.2441 17.8901V6.10991L5.24414 8.90991Z" fill="#5354ED"/>\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.66559 8.42145C1.94698 8.14006 2.33052 8 2.74414 8H4.74414C5.02028 8 5.24414 8.22386 5.24414 8.5C5.24414 8.77614 5.02028 9 4.74414 9H2.74414C2.55776 9 2.4413 9.05994 2.37269 9.12855C2.30408 9.19716 2.24414 9.31362 2.24414 9.5V14.5C2.24414 14.6864 2.30408 14.8028 2.37269 14.8714C2.4413 14.9401 2.55776 15 2.74414 15H4.74414C5.02028 15 5.24414 15.2239 5.24414 15.5C5.24414 15.7761 5.02028 16 4.74414 16H2.74414C2.33052 16 1.94698 15.8599 1.66559 15.5786C1.3842 15.2972 1.24414 14.9136 1.24414 14.5V9.5C1.24414 9.08638 1.3842 8.70284 1.66559 8.42145Z" fill="#5354ED"/>\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7441 3C20.0203 3 20.2441 3.22386 20.2441 3.5V20.5C20.2441 20.7761 20.0203 21 19.7441 21C19.468 21 19.2441 20.7761 19.2441 20.5V3.5C19.2441 3.22386 19.468 3 19.7441 3Z" fill="#5354ED"/>\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2441 9.5C19.2441 9.22386 19.468 9 19.7441 9H20.7441C22.1203 9 23.2441 10.1239 23.2441 11.5V12.5C23.2441 13.8761 22.1203 15 20.7441 15H19.7441C19.468 15 19.2441 14.7761 19.2441 14.5C19.2441 14.2239 19.468 14 19.7441 14H20.7441C21.568 14 22.2441 13.3239 22.2441 12.5V11.5C22.2441 10.6761 21.568 10 20.7441 10H19.7441C19.468 10 19.2441 9.77614 19.2441 9.5Z" fill="#5354ED"/>\n              <path fill-rule="evenodd" clip-rule="evenodd" d="M6.74414 16C7.02028 16 7.24414 16.2239 7.24414 16.5V18.5C7.24414 18.6864 7.30408 18.8028 7.37269 18.8714C7.4413 18.9401 7.55776 19 7.74414 19H12.7441C12.9305 19 13.047 18.9401 13.1156 18.8714C13.1842 18.8028 13.2441 18.6864 13.2441 18.5V17.5C13.2441 17.2239 13.468 17 13.7441 17C14.0203 17 14.2441 17.2239 14.2441 17.5V18.5C14.2441 18.9136 14.1041 19.2972 13.8227 19.5786C13.5413 19.8599 13.1578 20 12.7441 20H7.74414C7.33052 20 6.94698 19.8599 6.66559 19.5786C6.3842 19.2972 6.24414 18.9136 6.24414 18.5V16.5C6.24414 16.2239 6.468 16 6.74414 16Z" fill="#5354ED"/>\n            </svg>\n            ${this.getAttribute("comments")}\n          </span>\n          <span>\n            <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">\n              <g clip-path="url(#clip0_410_3007)">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.856 0.147345C14.077 -0.0491149 14.41 -0.0491149 14.631 0.147345L19.881 4.81401C20.1218 5.02805 20.1435 5.39676 19.9295 5.63755C19.7155 5.87834 19.3467 5.90002 19.106 5.68599L14.2435 1.36381L9.38104 5.68599C9.14025 5.90002 8.77154 5.87834 8.55751 5.63755C8.34347 5.39676 8.36516 5.02805 8.60595 4.81401L13.856 0.147345Z" fill="#5354ED"/>\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2435 0C14.5657 0 14.8268 0.261167 14.8268 0.583333V18.0833C14.8268 18.4055 14.5657 18.6667 14.2435 18.6667C13.9213 18.6667 13.6602 18.4055 13.6602 18.0833V0.583333C13.6602 0.261167 13.9213 0 14.2435 0Z" fill="#5354ED"/>\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.06981 9.82494C3.3981 9.49665 3.84556 9.33325 4.32812 9.33325H8.99479C9.31696 9.33325 9.57812 9.59442 9.57812 9.91659C9.57812 10.2388 9.31696 10.4999 8.99479 10.4999H4.32812C4.11069 10.4999 3.97482 10.5699 3.89477 10.6499C3.81473 10.7299 3.74479 10.8658 3.74479 11.0833V26.2499C3.74479 26.4674 3.81473 26.6032 3.89477 26.6833C3.97482 26.7633 4.11069 26.8333 4.32812 26.8333H24.1615C24.3789 26.8333 24.5148 26.7633 24.5948 26.6833C24.6749 26.6032 24.7448 26.4674 24.7448 26.2499V11.0833C24.7448 10.8658 24.6749 10.7299 24.5948 10.6499C24.5148 10.5699 24.3789 10.4999 24.1615 10.4999H19.4948C19.1726 10.4999 18.9115 10.2388 18.9115 9.91659C18.9115 9.59442 19.1726 9.33325 19.4948 9.33325H24.1615C24.644 9.33325 25.0915 9.49665 25.4198 9.82494C25.7481 10.1532 25.9115 10.6007 25.9115 11.0833V26.2499C25.9115 26.7325 25.7481 27.1799 25.4198 27.5082C25.0915 27.8365 24.644 27.9999 24.1615 27.9999H4.32812C3.84556 27.9999 3.3981 27.8365 3.06981 27.5082C2.74152 27.1799 2.57812 26.7325 2.57812 26.2499V11.0833C2.57812 10.6007 2.74152 10.1532 3.06981 9.82494Z" fill="#5354ED"/>\n              </g>\n              <defs>\n                <clipPath id="clip0_410_3007">\n                  <rect width="28" height="28" fill="white" transform="translate(0.244141)"/>\n                </clipPath>\n              </defs>\n            </svg>\n            ${this.getAttribute("share")}\n          </span>\n        </div>\n      </div>\n    `;const e=this.shadowRoot.querySelector(".like-icon");e?.addEventListener("click",(()=>{this.liked=!this.liked,this.render()}))}}}t.default=s,customElements.get("the-post")||customElements.define("the-post",s)},156:function(e,t,n){var s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const o=s(n(186)),i=s(n(247)),l=s(n(28));customElements.define("button-tags",o.default),customElements.define("feed-page",i.default),customElements.define("the-post",l.default)},186:(e,t)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.TextButton=void 0,function(e){e.textbutton="textbutton"}(n||(t.TextButton=n={}));class s extends HTMLElement{textbutton;constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return Object.values(n)}connectedCallback(){this.render()}render(){this.shadowRoot&&(this.shadowRoot.innerHTML=`\n          <style>\n            button {\n              padding: 8px 40px;\n              border-radius: 999px;\n              border: 2px solid blue;\n              color: #5354ED;\n              background-color: white;\n              font-size: 14px;\n              cursor: pointer;\n              transition: background-color 0.3s ease;\n              \n            }\n  \n            button:hover {\n              background-color:rgba(83, 83, 237, 0.32);\n              color:#5354ED; \n            }\n  \n            button:active {\n              background-color:#5354ED;\n              color:rgb(255, 255, 255);\n            }\n          </style>\n  \n          <button>${this.getAttribute("textbutton")}</button>\n        `)}}t.default=s},247:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});class n extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render()}render(){this.shadowRoot.innerHTML='\n              <style>\n\n              .section {\n              \n              }\n              </style>\n  \n              <nav-bar></nav-bar> \n              <section>\n               <button-tags textbutton="All"></button-tags>\n               <button-tags textbutton="Daily life"></button-tags>\n               <button-tags textbutton="Carpool "></button-tags>\n               <button-tags textbutton="Academics"></button-tags>\n              </section> \n               \n              <the-post \n              \n              photo= "https://picsum.photos/800/450?random=1"\n              name = "Luis Carlos Bodoque"\n              degree = "Engeneering System"\n              semestre = "Seventh"\n              comment = "Did anyone else stump against a guy using boots in the stairs???"\n              tag = "Daily Life"\n              Likes = "100"\n              share = "Share"\n              comments = "Comments"\n              ></the-post>\n              </div>\n\n          '}}t.default=n}},t={};!function n(s){var o=t[s];if(void 0!==o)return o.exports;var i=t[s]={exports:{}};return e[s].call(i.exports,i,i.exports,n),i.exports}(156)})();