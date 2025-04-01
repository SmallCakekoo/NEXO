interface Comment {
    photo: string;
    name: string;
    degree: string;
    semestre: string;
    comment: string;
    tag: string;
    likes: string;
}

interface CommentsResponse {
    comments: Comment[];
}

class PostContainer extends HTMLElement {
    private comments: Comment[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        console.log("PostContainer component mounted.");
        await this.fetchComments();
    }

    async fetchComments(): Promise<void> {
        try {
            const response = await fetch("./data/comments.json");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: CommentsResponse = await response.json();
            console.log("Fetched comments:", data);
            this.comments = data.comments;
            this.render(); 
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    }

    render() {
        console.log("Rendering comments:", this.comments);
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <div>
                ${this.comments.length > 0
                    ? this.comments.map(
                        (c) => `
                            <div tag="${c.tag}">
                                <img src="${c.photo}" alt="Foto de ${c.name}" />
                                <p><strong>${c.name}</strong> (${c.degree} - ${c.semestre})</p>
                                <p>${c.comment}</p>
                                <span>Likes: ${c.likes}</span>
                            </div>`
                    ).join("")
                    : "<p>There's no comments..</p>"}
            </div>
        `;
    }
}

export default PostContainer;