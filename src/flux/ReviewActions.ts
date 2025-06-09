import { AppDispatcher } from "./Dispatcher";

export const ReviewActionsType = {
  REVIEW_SUBMITTED: "REVIEW_SUBMITTED",
} as const;

type BaseReview = {
  rating: number;
  text: string;
  date: string;
  author: string;
  image: string;
};

type TeacherReview = BaseReview & {
  teacherName: string;
  type: "teacher";
};

type SubjectReview = BaseReview & {
  subjectName: string;
  type: "subject";
};

type Review = TeacherReview | SubjectReview;

export const ReviewActions = {
  submitReview: (review: Review) => {
    AppDispatcher.dispatch({
      type: ReviewActionsType.REVIEW_SUBMITTED,
      payload: review,
    });
  },
};
