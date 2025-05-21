export async function fetchTeachers() {
    try {
        const response = await fetch("/data/teachers.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched teachers:", data);
        return data;
    }
    catch (error) {
        console.error("Failed to fetch teachers:", error);
        throw error;
    }
}
//# sourceMappingURL=Teacher.service.js.map