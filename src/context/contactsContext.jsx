import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from "react-hot-toast";

// Action Types
const SET_CONTACTS = 'SET_CONTACTS';
const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
const TOGGLE_SELECT = 'TOGGLE_SELECT';
const TOGGLE_SELECT_ALL = 'TOGGLE_SELECT_ALL';
const OPEN_ADD_FORM = 'OPEN_ADD_FORM';
const OPEN_EDIT_FORM = 'OPEN_EDIT_FORM';
const CLOSE_FORM = 'CLOSE_FORM';
const OPEN_DELETE_MODAL = 'OPEN_DELETE_MODAL';
const OPEN_BULK_DELETE_MODAL = 'OPEN_BULK_DELETE_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';
const CONFIRM_DELETE = 'CONFIRM_DELETE';
const TOGGLE_FAVORITES_FILTER = 'TOGGLE_FAVORITES_FILTER';

const ADD_CONTACT = 'ADD_CONTACT';
const UPDATE_CONTACT = 'UPDATE_CONTACT';
const UPDATE_CONTACT_FAVORITE = 'UPDATE_CONTACT_FAVORITE';


// تعریف حالت اولیه
const initialState = {
  contacts: [],
  searchTerm: '',
  selectedContacts: new Set(),
  isFormOpen: false,
  editingContact: null,
  modalState: { isOpen: false, type: null, data: null },
  showFavsOnly: false,
};

// ایجاد Context
const ContactsContext = createContext();


// تعریف Reducer
const contactsReducer = (state, action) => {
  switch (action.type) {
    case SET_CONTACTS:
      return { ...state, contacts: action.payload };

    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    case TOGGLE_SELECT: {
      const newSelected = new Set(state.selectedContacts);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return { ...state, selectedContacts: newSelected };
    }

    case TOGGLE_SELECT_ALL: {
      const currentFilteredContacts = getFilteredContacts(state.contacts, state.searchTerm, state.showFavsOnly);
      if (state.selectedContacts.size === currentFilteredContacts.length && currentFilteredContacts.length > 0) {
        return { ...state, selectedContacts: new Set() };
      }
      return { ...state, selectedContacts: new Set(currentFilteredContacts.map(c => c.id)) };
    }

    case OPEN_ADD_FORM:
      return { ...state, isFormOpen: true, editingContact: null };

    case OPEN_EDIT_FORM:
      return { ...state, isFormOpen: true, editingContact: action.payload };

    case CLOSE_FORM:
      return { ...state, isFormOpen: false, editingContact: null };

    case OPEN_DELETE_MODAL:
      return { ...state, modalState: { isOpen: true, type: 'deleteSingle', data: action.payload } };

    case OPEN_BULK_DELETE_MODAL:
      return { ...state, modalState: { isOpen: true, type: 'deleteBulk', data: Array.from(state.selectedContacts) } };

    case CLOSE_MODAL:
      return { ...state, modalState: { isOpen: false, type: null, data: null } };

    case CONFIRM_DELETE: {
      let newContacts;
      if (state.modalState.type === 'deleteSingle') {
        newContacts = state.contacts.filter(c => c.id !== state.modalState.data);
        toast.success("مخاطب حذف شد");
      } else if (state.modalState.type === 'deleteBulk') {
        newContacts = state.contacts.filter(c => !state.modalState.data.includes(c.id));
        toast.success(" مخاطب‌ها حذف شدند");
      }
      return {
        ...state,
        contacts: newContacts,
        selectedContacts: new Set(),
        modalState: { isOpen: false, type: null, data: null },
      };
    }

    case TOGGLE_FAVORITES_FILTER:
      return { ...state, showFavsOnly: !state.showFavsOnly };
    
    // اکشن‌های افزودن و به‌روزرسانی پس از موفقیت در سرور
    case ADD_CONTACT:
      return { ...state, contacts: [...state.contacts, action.payload] };

    case UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c),
      };
      
    case UPDATE_CONTACT_FAVORITE:
      return {
        ...state,
        contacts: state.contacts.map(c => c.id === action.payload.id ? { ...c, isFavorite: action.payload.isFavorite } : c),
      };

    default:
      return state;
  }
};

//  فیلتر شده (بر اساس isFavorite)
const getFilteredContacts = (contacts, searchTerm, showFavsOnly) => {
    let filtered = contacts;

    if (showFavsOnly) {
        filtered = filtered.filter(contact => contact.isFavorite);
    }

    if (searchTerm) {
        filtered = filtered.filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return filtered;
};



// ایجاد Provider
export const ContactsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactsReducer, initialState);

  //  برای دریافت داده‌ها 
  useEffect(() => {
    fetch('http://localhost:3000/contacts')
      .then(response => response.json())
      .then(data => dispatch({ type: SET_CONTACTS, payload: data }))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []); 

  //  مخاطبین فیلتر شده
  const filteredContacts = getFilteredContacts(state.contacts, state.searchTerm, state.showFavsOnly);

  const value = {
    ...state,
    filteredContacts,
    dispatch,
  };

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
};

//   هوک سفارشی
export const useContacts = () => useContext(ContactsContext);
 
