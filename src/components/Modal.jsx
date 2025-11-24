
const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-secondary">انصراف</button>
          <button onClick={onConfirm} className="btn btn-danger">تایید</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;