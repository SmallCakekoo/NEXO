import teachersJson from "./teachers.json";

export interface Teacher {
  name: string;
  subject: string;
  nucleus: string;
  rating: string;
  image: string;
}

export const teachersData: Teacher[] = teachersJson.teachers;
