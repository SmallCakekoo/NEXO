class TeacherCommentsContainer extends HTMLElement {
  private teacherName: string = '';

  static get observedAttributes() {
    return ['teacher-name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'teacher-name' && oldValue !== newValue) {
      this.teacherName = newValue;
      this.render();
    }
  }

  connectedCallback() {
    if (!this.teacherName) {
      this.teacherName = this.getAttribute('teacher-name') || '';
    }
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Removed the event listener for 'review-submitted' as updates are now handled by the store subscription in TeacherReviewList
    // this.addEventListener('review-submitted', (event: Event) => {
    //   const customEvent = event as CustomEvent;
    //   const review = customEvent.detail;
    // 
    //   const reviewList = this.shadowRoot?.querySelector('teacher-review-list') as any;
    //   if (reviewList && typeof reviewList.addReview === 'function') {
    //     reviewList.addReview(review);
    //   }
    // });
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
          .reviews-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
          }
        </style>
        <div id="form-container"></div>
        <div class="divider"></div>
        <div class="reviews-container">
          <teacher-review-list teacher-name="${this.teacherName}"></teacher-review-list>
        </div>
      `;

      // Manually create and append the teacher-review-form to pass the property
      const formContainer = this.shadowRoot.getElementById('form-container');
      if (formContainer) {
        const reviewForm = document.createElement('teacher-review-form') as any;
        reviewForm.teacherName = this.teacherName; // Pass teacherName as a property
        formContainer.appendChild(reviewForm);
      }
    }
  }
}

export default TeacherCommentsContainer;
