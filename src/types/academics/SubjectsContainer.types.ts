import { Review } from "../subject-detail/SubjectReviewList.types";

export interface subjects {
  name: string;
  career: string;
  credits: string;
  rating: string;
  image: string;
  reviews?: Review[];
}

export interface SubjectsResponse {
  subjects: subjects[];
}
