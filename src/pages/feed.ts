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

              .section-buttons {
                width: 100vw; 
                display: flex; 
                gap: 6%;
                padding: 2% 0;
                justify-self: center;
                justify-content: center;
              
              }
                
              
              .post-card{
              justify-content: center;
              display:flex; 
              margin-top: 8%;
              }
              </style>
  
              <nav-bar></nav-bar> 
              
              <section class="section-buttons">
               <button-tags textbutton="All"></button-tags>
               <button-tags textbutton="Daily life"></button-tags>
               <button-tags textbutton="Carpool "></button-tags>
               <button-tags textbutton="Academics"></button-tags>
              </section> 
            
            <div class ="post-card">
              <the-post 
                photo= "https://picsum.photos/800/450?random=1"
                name = "Luis Carlos Bodoque"
                date ="26/03/2025"
                career = "Engeneering System"
                semestre = "Seventh"
                message = "Did anyone else stump against a guy using boots in the stairs???"
                tag = "Daily Life"
                Likes = "100"
                share = ""
                comments = ""
                ></the-post>
                </div>
                <floating-btn></floating-btn>
                <post-modal></post-modal>
            </div>
              
          `;
    }
  }
  
  export default FeedPage;
