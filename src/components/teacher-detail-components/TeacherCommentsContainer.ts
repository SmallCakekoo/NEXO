class TeacherCommentsContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="/styles/components/teacher-detail/TeacherCommentsContainer.css">
                <teacher-review-form></teacher-review-form>
                <div class="divider"></div>
                <teacher-review-list></teacher-review-list>
            `;
    }
  }
}

export default TeacherCommentsContainer;
