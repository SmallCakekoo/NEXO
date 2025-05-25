import { Review } from "../teacher-detail/TeacherReviewList.types";

export interface teachers {
  name: string;
  subject: string;
  nucleus: string;
  rating: string;
  image: string;
  reviews?: Review[];
}

export interface TeachersResponse {
  teachers: teachers[];
}
