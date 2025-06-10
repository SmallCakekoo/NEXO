import { teachers } from '../types/academics/TeachersContainer.types';
import { AppDispatcher } from './Dispatcher';
import {subjects} from "../types/academics/SubjectsContainer.types";

export const SearchActionTypes = {
  SEARCH_SUBJECTS: 'SEARCH_SUBJECTS',
  SEARCH_TEACHERS: 'SEARCH_TEACHERS',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  SEARCH_ALL: 'SEARCH_ALL',
  SET_ALL_TEACHERS: 'SET_ALL_TEACHERS', 
  SEARCH_QUERY: 'SEARCH_QUERY', 

};

export const SearchActions = {
  // searchSubjects: (query: string) => {
  //   AppDispatcher.dispatch({
  //     type: SearchActionTypes.SEARCH_SUBJECTS,
  //     payload: { query }
  //   });
  // },

  // searchTeachers: (query: string) => {
  //   AppDispatcher.dispatch({
  //     type: SearchActionTypes.SEARCH_TEACHERS,
  //     payload: { query }
  //   });
  // },

  clearSearch: () => {
    AppDispatcher.dispatch({
      type: SearchActionTypes.CLEAR_SEARCH,
      payload: ''
    });
  },

  searchAll: (query: string) => {
  AppDispatcher.dispatch({
    type: SearchActionTypes.SEARCH_ALL,
    payload: { query }
  });
},

  setAllTeachers: (teachers: any[]) => {
    AppDispatcher.dispatch({
      type: 'SET_ALL_TEACHERS',
      payload: teachers
    });
  },

  searchTeachers: (result: teachers[] ) => {
    const payload = Array.isArray(result) ? [...result] : [result];
    AppDispatcher.dispatch({
      type: SearchActionTypes.SEARCH_TEACHERS,
      payload: payload
    });
  },

  searchSubjects: (result: subjects[] ) => {
    const payload = Array.isArray(result) ? [...result] : [result];
    AppDispatcher.dispatch({
      type: SearchActionTypes.SEARCH_SUBJECTS,
      payload: payload
    });
  },

}

