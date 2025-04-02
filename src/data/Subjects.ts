import subjectsJson from "./subjects.json";

export interface Subject {
  name: string;
  career: string;
  credits: string;
  image: string;
  rating: string;
}

export const subjectsData: Subject[] = subjectsJson.subjects;
