import { Toaster, toast } from "react-hot-toast";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import Modal from "./components/Modal";
import { useContacts } from "./context/ContactsContext";
import "./App.css";

export default function App() {
  const {
    searchTerm,
    selectedContacts,
    isFormOpen,
    editingContact,
    modalState,
    dispatch,
  } = useContacts();

  // --- توابع مدیریت فرم ---
  const handleAddContact = () => {
    dispatch({ type: "OPEN_ADD_FORM" });
  };

  const handleSaveContact = async (contactData) => {
    try {
      let response;
      if (editingContact) {
        const updatedData = { ...editingContact, ...contactData };
        response = await fetch(
          `http://localhost:3000/contacts/${editingContact.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
          }
        );
        const updatedContact = await response.json();
        dispatch({ type: "UPDATE_CONTACT", payload: updatedContact });
        toast.success("مخاطب ویرایش شد");
      } else {
        // افزودن مخاطب جدید
        response = await fetch("http://localhost:3000/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactData),
        });
        const newContact = await response.json();
        dispatch({ type: "ADD_CONTACT", payload: newContact });
        toast.success("مخاطب جدید اضافه شد");
      }
      dispatch({ type: "CLOSE_FORM" });
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("خطا در ذخیره مخاطب!");
    }
  };

  // ---  مدیریت حذف گروهی ---
  const handleBulkDeleteClick = () => {
    dispatch({ type: "OPEN_BULK_DELETE_MODAL" });
  };

  const confirmDelete = async () => {
    try {
      if (modalState.type === "deleteSingle") {
        await fetch(`http://localhost:3000/contacts/${modalState.data}`, {
          method: "DELETE",
        });
      } else if (modalState.type === "deleteBulk") {
        await Promise.all(
          modalState.data.map((id) =>
            fetch(`http://localhost:3000/contacts/${id}`, { method: "DELETE" })
          )
        );
      }
      dispatch({ type: "CONFIRM_DELETE" });
    } catch (error) {
      console.error("Error deleting contact(s):", error);
      toast.error("خطا در حذف مخاطب!");
    }
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_MODAL" });
  };

  const handleSearch = (term) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  };

  return (
    <div className="app-container">
      <Toaster position="top-center" reverseOrder={false} />
      <Header addContact={handleAddContact} />

      <main className="app-main">
        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />

        {selectedContacts.size > 0 && (
          <div className="bulk-actions">
            <span>{selectedContacts.size} مخاطب انتخاب شده</span>
            <button onClick={handleBulkDeleteClick} className="btn btn-danger">
              حذف گروهی
            </button>
          </div>
        )}

        <ContactList />
      </main>

      {isFormOpen && (
        <ContactForm
          onSave={handleSaveContact}
          onClose={() => dispatch({ type: "CLOSE_FORM" })}
          contact={editingContact}
        />
      )}

      {modalState.isOpen && (
        <Modal
          title={
            modalState.type === "deleteBulk" ? "تایید حذف گروهی" : "تایید حذف"
          }
          message={
            modalState.type === "deleteBulk"
              ? `آیا از حذف ${modalState.data.length} مخاطب انتخاب شده اطمینان دارید؟`
              : "آیا از حذف این مخاطب اطمینان دارید؟"
          }
          onConfirm={confirmDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}
