import { useMemo } from "react";
import Button from "./form/Button";
import FormInput from "./form/FormInput";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

// اعتبارسنجی با استفاده از Yup
const contactSchema = yup.object().shape({
  name: yup.string().required("نام الزامی است."),
  work: yup.string().required("شغل الزامی است."),
  email: yup.string().email("ایمیل نامعتبر است.").required("ایمیل الزامی است."),
  phone: yup.string().required("شماره تلفن الزامی است."),
});

const ContactForm = ({ onSave, onClose, contact }) => {
  const initialValues = useMemo(
    () => ({
      name: contact?.name || "",
      work: contact?.work || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
    }),
    [contact]
  );

  return (
    <div className="form-modal-overlay">
      <div className="form-modal">
        <h2>{contact ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={contactSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            onSave(values);
            resetForm();
            onClose();
            setSubmitting(false);
          }}
          key={contact?.id || "new-contact-form"}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput label="نام" name="name" type="text" required />
              <FormInput label="تخصص یا شغل" name="work" type="text" required />
              <FormInput label="ایمیل" name="email" type="email" required />
              <FormInput label="شماره تلفن" name="phone" type="tel" required />
              <div className="form-actions">
                <Button type="button" onClick={onClose} variant="secondary">
                  انصراف
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContactForm;
