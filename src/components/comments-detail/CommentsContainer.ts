import { store, State } from "../../flux/Store";
import { CommentActions, Comment } from "../../flux/CommentActions";

class CommentsContainer extends HTMLElement {
  private postId: string = "";
  private commentSubmittedHandler: ((event: CustomEvent) => void) | null = null;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  static get observedAttributes(): string[] {
    return ["post-id"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "post-id" && newValue !== oldValue) {
      this.postId = newValue;
      if (this.postId) {
        store.fetchCommentsForPost(this.postId);
      }
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.subscribeToStore();
    if (this.postId) {
      store.fetchCommentsForPost(this.postId);
    }
  }

  disconnectedCallback() {
    this.removeEventListeners();
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore() {
    this.unsubscribeStore = store.subscribe(this.handleStoreChange);
  }

  private handleStoreChange(state: State) {
    const commentsList = this.shadowRoot?.querySelector("comments-list");
    if (commentsList && this.postId) {
      const commentsForPost = state.comments[this.postId] || [];
      commentsList.setAttribute("comments", this._escapeHTML(JSON.stringify(commentsForPost)));
      console.log("Store change: Updated comments for postId:", this.postId, commentsForPost);
    }
  }

  removeEventListeners() {
    if (this.commentSubmittedHandler) {
      document.removeEventListener(
        "comment-submitted",
        this.commentSubmittedHandler as EventListener
      );
      this.shadowRoot?.removeEventListener(
        "comment-submitted",
        this.commentSubmittedHandler as EventListener
      );
      this.commentSubmittedHandler = null;
    }
  }

  setupEventListeners() {
    this.removeEventListeners();

    this.commentSubmittedHandler = ((event: CustomEvent) => {
      if (this.postId) {
        const state = store.getState();
        const loggedInUser = state.auth.user;

        if (loggedInUser) {
          const commentMessage = event.detail as string;
          const newComment: Comment = {
            photo: loggedInUser.profilePic || '',
            name: loggedInUser.username || 'Anonymous',
            career: loggedInUser.career || '',
            date: new Date().toLocaleDateString(),
            message: commentMessage,
          };
          CommentActions.addComment(newComment);
        } else {
          console.warn("User not logged in, cannot add comment.");
        }
      }
    }) as EventListener;

    document.addEventListener(
      "comment-submitted",
      this.commentSubmittedHandler as EventListener
    );

    this.shadowRoot?.addEventListener(
      "comment-submitted",
      this.commentSubmittedHandler as EventListener
    );
  }

  render() {
    if (this.shadowRoot) {
      const state = store.getState();
      const commentsForPost = state.comments[this.postId] || [];

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: flex;
            flex-direction: column;
            padding: 2rem;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 2px 4px rgba(83, 84, 237, 0.1);
            max-width: 730px;
            margin: 0 auto;
          }
          .divider {
            width: 100%;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(83, 83, 237, 0.39), transparent);
            margin: 1rem 0;
          }
        </style>
        <comment-form></comment-form>
        <div class="divider"></div>
        <comments-list comments='${this._escapeHTML(JSON.stringify(commentsForPost))}'></comments-list>
      `;
    }
  }

  private _escapeHTML(str: string): string {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}

export default CommentsContainer;
