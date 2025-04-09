export async function fetchSubjects() {
    try {
        const response = await fetch("/data/subjects.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched subjects:", data);
        return data;
    }
    catch (error) {
        console.error("Failed to fetch subjects:", error);
        throw error;
    }
}
//# sourceMappingURL=Subject.service.js.map