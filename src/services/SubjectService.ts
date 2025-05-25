import { SubjectsResponse } from "../types/academics/SubjectsContainer.types";

export async function fetchSubjects(): Promise<SubjectsResponse> {
  try {
    const response = await fetch("/data/SubjectsReviews.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: SubjectsResponse = await response.json();
    console.log("Fetched subjects:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    throw error;
  }
}
