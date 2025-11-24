import { useField } from "formik";

const FormInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-group">
      <label htmlFor={props.id || props.name}>
        {label}
        {props.required && <span className="required">*</span>}
      </label>
      <input
        {...field}
        {...props}
        className={meta.touched && meta.error ? "input-error" : ""}
      />
      {meta.touched && meta.error ? (
        <span className="error-message">{meta.error}</span>
      ) : null}
    </div>
  );
};

export default FormInput;
