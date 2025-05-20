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
                <teacher-review-form></teacher-review-form>
                <div class="divider"></div>
                <teacher-review-list></teacher-review-list>
            `;
    }
  }
}

export default TeacherCommentsContainer;
