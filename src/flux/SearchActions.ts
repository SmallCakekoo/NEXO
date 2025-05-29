import { AppDispatcher } from './Dispatcher';

export const SearchActionTypes = {
  SEARCH_SUBJECTS: 'SEARCH_SUBJECTS',
  SEARCH_TEACHERS: 'SEARCH_TEACHERS',
  CLEAR_SEARCH: 'CLEAR_SEARCH'
};

export const SearchActions = {
  searchSubjects: (query: string) => {
    AppDispatcher.dispatch({
      type: SearchActionTypes.SEARCH_SUBJECTS,
      payload: { query }
    });
  },

  searchTeachers: (query: string) => {
    AppDispatcher.dispatch({
      type: SearchActionTypes.SEARCH_TEACHERS,
      payload: { query }
    });
  },

  clearSearch: () => {
    AppDispatcher.dispatch({
      type: SearchActionTypes.CLEAR_SEARCH,
      payload: { query: '' }
    });
  }
};
