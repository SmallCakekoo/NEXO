import { teachers } from '../types/academics/TeachersContainer.types';
import { AppDispatcher } from './Dispatcher';
import { subjects } from "../types/academics/SubjectsContainer.types";
import { store } from './Store';

export const SearchActionTypes = {
  SEARCH_SUBJECTS: 'SEARCH_SUBJECTS',
  SEARCH_TEACHERS: 'SEARCH_TEACHERS',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  SEARCH_ALL: 'SEARCH_ALL',
  SET_ALL_TEACHERS: 'SET_ALL_TEACHERS',
  SEARCH_QUERY: 'SEARCH_QUERY',
};

const DEBOUNCE_DELAY = 300; // 300ms delay

// Mock data for testing - replace with actual data source
const mockTeachers: teachers[] = [
  {
    name: "John Doe",
    subject: "Mathematics",
    nucleus: "Basic Sciences",
    rating: "4.5",
    image: "https://picsum.photos/200"
  },
  // Add more mock teachers as needed
];

const mockSubjects: subjects[] = [
  {
    name: "Calculus I",
    career: "Computer Science",
    credits: "6",
    rating: "4.2",
    image: "https://picsum.photos/200"
  },
  // Add more mock subjects as needed
];

export const SearchActions = {
  searchSubjects: (query: string) => {
    const state = store.getState();
    if (state.searchDebounceTimeout) {
      clearTimeout(state.searchDebounceTimeout);
    }

    const timeoutId = window.setTimeout(() => {
      // Use the real subjects loaded in the store
      const allSubjects = state.subjects || [];
      const filteredSubjects = allSubjects.filter((subject: subjects) => 
        subject.name.toLowerCase().includes(query.toLowerCase()) ||
        subject.career.toLowerCase().includes(query.toLowerCase())
      );

      AppDispatcher.dispatch({
        type: SearchActionTypes.SEARCH_SUBJECTS,
        payload: filteredSubjects
      });
    }, DEBOUNCE_DELAY);

    // Update the timeout ID in the store
    store.getState().searchDebounceTimeout = timeoutId;
  },

  searchTeachers: (query: string) => {
    const state = store.getState();
    if (state.searchDebounceTimeout) {
      clearTimeout(state.searchDebounceTimeout);
    }

    const timeoutId = window.setTimeout(() => {
      // Use the real teachers loaded in the store
      const allTeachers = state.teachers || [];
      const filteredTeachers = allTeachers.filter((teacher: teachers) => 
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(query.toLowerCase())
      );

      AppDispatcher.dispatch({
        type: SearchActionTypes.SEARCH_TEACHERS,
        payload: filteredTeachers
      });
    }, DEBOUNCE_DELAY);

    // Update the timeout ID in the store
    store.getState().searchDebounceTimeout = timeoutId;
  },

  clearSearch: () => {
    const state = store.getState();
    if (state.searchDebounceTimeout) {
      clearTimeout(state.searchDebounceTimeout);
    }
    
    AppDispatcher.dispatch({
      type: SearchActionTypes.CLEAR_SEARCH
    });
  },

  searchAll: (query: string) => {
    AppDispatcher.dispatch({
      type: SearchActionTypes.SEARCH_ALL,
      payload: { query }
    });
  },

  setAllTeachers: (teachersList: teachers[]) => {
    AppDispatcher.dispatch({
      type: SearchActionTypes.SET_ALL_TEACHERS,
      payload: teachersList
    });
  }
};

