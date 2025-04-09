class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
           <link rel="stylesheet" href="/styles/components/academics/SearchBar.css">
            <div class="search-container">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-line="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                    class="search-input" 
                    placeholder="Search teachers, subjects..."
                    id="search-input"
                    name="search-input"
                >
            </div>
        `;
    }
}
export default SearchBar;
//# sourceMappingURL=SearchBar.js.map