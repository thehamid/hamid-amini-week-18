import { useState } from "react";
import FavButton from "./elements/FavButton";
import { useContacts } from '../context/ContactsContext';



const ContactItem = ({ contact, isSelected}) => {
const [detailsShow, setDetailsShow] = useState(false);
const { dispatch } = useContacts();

  const handleToggleSelect = (id) => dispatch({ type: 'TOGGLE_SELECT', payload: id });
  const handleEdit = (contact) => dispatch({ type: 'OPEN_EDIT_FORM', payload: contact });
  const handleDelete = (id) => dispatch({ type: 'OPEN_DELETE_MODAL', payload: id });

  const showhandler = () => { setDetailsShow(!detailsShow);};

  return (
    <li className="contact-item">
      <div className="contact-info">
        <FavButton 
          isFav={contact.isFavorite} 
          cid={contact.id}
        />
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleToggleSelect(contact.id)}
        />
        <span className="name">{contact.name}</span>
        <button className="btn-more" onClick={showhandler}>
          <span className={`arrow ${detailsShow ? 'rotate' : ''}`}>▼</span>
        </button>
        <div className="contact-actions">
          <button onClick={() => handleEdit(contact)} className="btn btn-secondary">
            &#x270E;
          </button>
          <button
            onClick={() => handleDelete(contact.id)}
            className="btn btn-danger"
          >
            &#x2718;
          </button>
        </div>
      </div>

      <div
        className={`contact-details ${detailsShow ? 'open' : ''}`}
      >
        <div className="details-content">
          <div className="work"> شغل: {contact.work}</div>
          <div className="email"> ایمیل: {contact.email}</div>
          <div className="phone"> شماره تماس: {contact.phone}</div>
        </div>
      </div>
    </li>
  );
};

export default ContactItem;