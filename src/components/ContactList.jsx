import ContactItem from './ContactItem';
import StarCheckbox from './elements/StarCheckbox';
import { useContacts } from '../context/ContactsContext';

const ContactList = () => { 
  const {
    filteredContacts,
    selectedContacts,
    showFavsOnly,
    contacts,
    dispatch,
  } = useContacts();

  if (filteredContacts.length === 0) {
    return <p className="no-contacts">هیچ مخاطبی برای نمایش یافت نشد.</p>;
  }

  const isAllSelected = filteredContacts.length > 0 && selectedContacts.size === filteredContacts.length;
  const favoritesExist = contacts.some(c => c.isFavorite);

  const handleSelectAll = () => dispatch({ type: 'TOGGLE_SELECT_ALL' });
  const handleFavOnly = () => dispatch({ type: 'TOGGLE_FAVORITES_FILTER' });
  
  return (
    <>
      <div className="contact-list-header">
        <StarCheckbox
          isFavOnly={showFavsOnly}
          onFavOnly={handleFavOnly}
          favoritesExist={favoritesExist}
        />
        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
        <span>نام </span>
        <span>جزئیات </span>
        <span>عملیات</span>
      </div>
      <ul className="contact-list">
        {filteredContacts.map(contact => (
          <ContactItem
            key={contact.id}
            contact={contact}
            isSelected={selectedContacts.has(contact.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default ContactList;