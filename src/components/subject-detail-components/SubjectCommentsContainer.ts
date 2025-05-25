class SubjectCommentsContainer extends HTMLElement {
  private subjectName: string = "";
  private reviewForm: HTMLElement | null = null;
  private reviewList: HTMLElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleReviewSubmitted = this.handleReviewSubmitted.bind(this);
  }

  static get observedAttributes() {
    return ["subject-name"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "subject-name" && oldValue !== newValue) {
      this.subjectName = newValue;
      this.render();
    }
  }



  private handleReviewSubmitted(event: Event) {
    const customEvent = event as CustomEvent;
    if (this.reviewList) {
      (this.reviewList as any).addReview(customEvent.detail);
    }
  }

  private setupEventListeners() {
    // Remove existing listeners to prevent duplicates
    if (this.reviewForm) {
      this.reviewForm.removeEventListener('review-submitted', this.handleReviewSubmitted);
    }

    // Setup new listeners
    if (this.reviewForm && this.reviewList) {
      this.reviewForm.addEventListener('review-submitted', this.handleReviewSubmitted);
    }
  }

  connectedCallback() {
    this.subjectName = this.getAttribute("subject-name") || "";
    this.render();
  }

  disconnectedCallback() {
    // Clean up event listeners when component is removed
    if (this.reviewForm) {
      this.reviewForm.removeEventListener('review-submitted', this.handleReviewSubmitted);
    }
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            flex-direction: column;
            padding: 2rem;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(83, 83, 237, 0.39), transparent);
            margin: 1rem 0;
          }
        </style>
        <subject-review-form id="review-form"></subject-review-form>
        <div class="divider"></div>
        <subject-review-list id="review-list" subject-name="${this.subjectName}"></subject-review-list>
      `;

      // Get references to the form and list
      this.reviewForm = this.shadowRoot.querySelector("#review-form");
      this.reviewList = this.shadowRoot.querySelector("#review-list");
      
      // Setup event listeners
      this.setupEventListeners();
    }
  }
}

export default SubjectCommentsContainer;
