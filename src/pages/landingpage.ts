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
        font-family: Inter, Arial, sans-serif;
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
      }

      .hero h1 {
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 16px;
      }

      .hero h4 {
        font-size: 1rem;
        font-weight: 400;
        margin: 0 0 32px;
      }

      .hero img {
        width: 100%;
        height: auto;
      }

      start-button {
        margin-bottom: 32px;
      }

      .cards-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr); 
        gap: 20px;                              
}
      }
    </style>

    <nav-bar></nav-bar>

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