class FeedPage extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot!.innerHTML = `
              <style>
              </style>
  
              <nav-bar></nav-bar> 
              <section>
               <button-tags textbutton="All"></button-tags>
              </section> 
          `;
    }
  }
  
  export default FeedPage;