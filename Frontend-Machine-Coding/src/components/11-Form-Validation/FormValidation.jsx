// Concepts:
// useState with an object (all form fields in one state)
// One handleChange for every input (e.target.name + computed key)
// Validation function that returns an errors object
// Regular expressions (regex)
// Conditional Rendering (error messages, success screen)

import { useState } from "react";
import "./FormValidation.css";

const initialForm = { name: "", email: "", password: "", phone: "" };

function FormValidation() {
  // 1. State
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({}); // e.g. { email: "Email is required." }
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Event handlers
  function handleChange(e) {
    const { name, value } = e.target;
    // [name] is a computed key: the input's name attribute decides which field changes
    setFormData({ ...formData, [name]: value });
    // Hide this field's error while the user is fixing it
    setErrors({ ...errors, [name]: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate(formData);
    setErrors(newErrors);

    // No keys in the errors object = every field is valid
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
    }
  }

  function handleReset() {
    setFormData(initialForm);
    setErrors({});
    setIsSubmitted(false);
  }

  // 3. Main logic
  // Returns an object with one message per invalid field. An empty object means "valid".
  function validate(values) {
    const newErrors = {};

    if (values.name.trim() === "") {
      newErrors.name = "Name is required.";
    }

    // something@something.something, with no spaces
    if (values.email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Enter a valid email, like name@example.com.";
    }

    if (values.password === "") {
      newErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/\d/.test(values.password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    // exactly 10 digits, nothing else
    if (values.phone.trim() === "") {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d{10}$/.test(values.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits.";
    }

    return newErrors;
  }

  // 4. JSX
  if (isSubmitted) {
    return (
      <div className="validation-success">
        <h3>✅ Form submitted</h3>
        <p>
          Welcome, {formData.name}! We will contact you at {formData.email}.
        </p>
        <button onClick={handleReset}>Fill the form again</button>
      </div>
    );
  }

  return (
    // noValidate turns off the browser's own popups so we can show our own messages
    <form className="validation-form" onSubmit={handleSubmit} noValidate>
      <div className="validation-field">
        <label htmlFor="fv-name">Name</label>
        <input id="fv-name" name="name" type="text" value={formData.name} onChange={handleChange} />
        {errors.name && <p className="validation-error">{errors.name}</p>}
      </div>

      <div className="validation-field">
        <label htmlFor="fv-email">Email</label>
        <input id="fv-email" name="email" type="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p className="validation-error">{errors.email}</p>}
      </div>

      <div className="validation-field">
        <label htmlFor="fv-password">Password</label>
        <input
          id="fv-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <p className="validation-hint">At least 8 characters, including a number.</p>
        {errors.password && <p className="validation-error">{errors.password}</p>}
      </div>

      <div className="validation-field">
        <label htmlFor="fv-phone">Phone</label>
        <input id="fv-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
        {errors.phone && <p className="validation-error">{errors.phone}</p>}
      </div>

      <button type="submit" className="primary-button">
        Submit
      </button>
    </form>
  );
}

export default FormValidation;
