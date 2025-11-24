import {  useContacts } from '../../context/ContactsContext';



const FavButton = ({ isFav, cid }) => {
  const {contacts,dispatch } = useContacts();

    const handleFavToggle = async (id) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
    try {
      const response = await fetch(`http://localhost:3000/contacts/${id}`, {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: updatedContact.isFavorite }),
      });
      
      if(response.ok){
        dispatch({ type: 'UPDATE_CONTACT_FAVORITE', payload: { id, isFavorite: updatedContact.isFavorite } });
      }

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("خطا در به‌روزرسانی علاقه‌مندی");
    }
  };

  return (
    <button className={`fav-button ${isFav ? 'active' : ''}`} onClick={() => handleFavToggle(cid)}>
      {isFav ? "★" : "☆"}
    </button>
  );
};

export default FavButton;