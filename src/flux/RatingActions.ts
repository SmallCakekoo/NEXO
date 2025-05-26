import { AppDispatcher } from './Dispatcher';
import { PostActionTypes } from '../types/feed/PostActionTypes';

export class RatingActions {
  static addTeacherRating(teacherName: string, rating: number, comment: string, author?: string, image?: string) {
    AppDispatcher.dispatch({
      type: PostActionTypes.ADD_TEACHER_RATING,
      payload: {
        teacherName,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        author,
        image
      }
    });
  }

  static addSubjectRating(subjectName: string, rating: number, comment: string, author?: string, image?: string) {
    AppDispatcher.dispatch({
      type: PostActionTypes.ADD_SUBJECT_RATING,
      payload: {
        subjectName,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        author,
        image
      }
    });
  }

  static updateTeacherRating(teacherName: string, newRating: number) {
    AppDispatcher.dispatch({
      type: PostActionTypes.UPDATE_TEACHER_RATING,
      payload: {
        teacherName,
        rating: newRating
      }
    });
  }

  static updateSubjectRating(subjectName: string, newRating: number) {
    AppDispatcher.dispatch({
      type: PostActionTypes.UPDATE_SUBJECT_RATING,
      payload: {
        subjectName,
        rating: newRating
      }
    });
  }
} 