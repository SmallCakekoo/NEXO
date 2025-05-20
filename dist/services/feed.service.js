export async function fetchPosts() {
    try {
        const response = await fetch("./data/Feed.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched posts:", data);
        return data;
    }
    catch (error) {
        console.error("Failed to fetch posts:", error);
        throw error;
    }
}
//# sourceMappingURL=feed.service.js.map