class SubjectCommentsContainer extends HTMLElement {
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
                <link rel="stylesheet" href="/styles/components/subject-detail/SubjectCommentsContainer.css">
                <subject-review-form></subject-review-form>
                <div class="divider"></div>
                <subject-review-list></subject-review-list>
            `;
        }
    }
}
export default SubjectCommentsContainer;
//# sourceMappingURL=SubjectCommentsContainer.js.map