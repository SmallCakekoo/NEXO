class LandingPage extends HTMLElement {
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
      :host {
        display: block;
        color: #000;
      }
      .hero {
      max-width: 1200px;
      margin: 64px auto 96px;
      display: grid;
      grid-template-columns: 1fr 420px;
      align-items: center;
      gap: 48px;
      padding: 0 24px;
      grid-template-areas: "text image";
      }

         .hero .text {
        grid-area: text;
        }


      .hero h1 {
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 16px;
      }

      .hero h4 {
        font-size: 0.90rem;
        font-weight: 400;
        margin: 0 0 32px;
      }

      .hero img {
      grid-area: image;
      width: 100%;
      height: auto;
      }

      start-button {
        margin-bottom: 32px;
      }

      
      .cards-row {
      display: grid;
      grid-template-columns: repeat(4, 0fr);
      gap: 15px; 
      padding: 0;
      margin: 0;
      max-width: 1200px;
      margin: 0 auto; 
      padding: 0 24px;
      margin-bottom: 40px;
      }

      .logo {
        display: none;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
      }

      .logo img {
        width: 150px;
        height: auto;
        display: block;
        margin: 0 auto;
      }

      nav-bar-login-signup {
        display: block;
      }

    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        grid-template-areas:
          "image"
          "text";
        text-align: center;
        padding: 0 16px;
        gap: 24px;
      }

      .hero .text {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .hero h1 {
        font-size: 1.5rem;
      }

      .hero h4 {
        font-size: 0.95rem;
      }

      .hero img {
        max-width: 400px;
        margin: 0 auto;
      }

      .cards-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 0 16px;
        margin-top: 32px;
      }

      landing-cards {
        width: 100%;
        max-width: 320px;
      }

      start-button {
        margin-bottom: 16px;
      }

      .logo {
        display: block;
        margin-top: 16px;
        margin-bottom: -60px
      }

      nav-bar-login-signup {
        display: none;
      }
    }
    </style>
 <nav-bar-login-signup></nav-bar-login-signup>
    <div class="logo">
      <img src="/assets/images/logonexobig.png" alt="Nexo Logo" />
    </div>
    
    <section class="hero">
      <div class="text">
        <h1>Your Academic Network for<br/>Connect, Learn and Grow.</h1>
        <h4>Our space to share knowledge, solve doubts, and find academic support.</h4>
        <start-button></start-button>
      </div>

      <img src="/assets/images/Science.png" alt="Science illustration"/>
    </section>

    <div class="cards-row">
      <landing-cards
        image="/assets/images/Freedom.png"
        text="Find tutors and professors to help you improve your academic performance.">
      </landing-cards>

      <landing-cards
        image="/assets/images/tasks.png"
        text="Access materials, guides, and tools designed to enhance your learning.">
      </landing-cards>

      <landing-cards
        image="/assets/images/search.png"
        text="Connect with other students and professionals to share experiences and knowledge.">
      </landing-cards>

      <landing-cards
        image="/assets/images/botle.png"
        text="Post questions, share ideas, and learn from others in a collaborative environment.">
      </landing-cards>
    </div>
  `;
  }
}

export default LandingPage;
