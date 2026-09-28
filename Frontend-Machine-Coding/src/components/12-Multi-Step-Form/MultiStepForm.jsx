// Concepts:
// useState (step number + one object for all form data)
// Conditional Rendering (one block per step)
// Validation per step
// Form submit (Enter key moves to the next step)

import { useState } from "react";
import "./MultiStepForm.css";

const stepLabels = ["Personal", "Contact", "Review"];
const initialForm = { name: "", email: "", phone: "", address: "" };

function MultiStepForm() {
  // 1. State
  const [step, setStep] = useState(1); // 1, 2 or 3
  const [formData, setFormData] = useState(initialForm); // data from ALL steps
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Event handlers
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function handleNext() {
    const newErrors = validateStep();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(step + 1);
    }
  }

  function handlePrevious() {
    setErrors({});
    setStep(step - 1);
  }

  function handleSubmit(e) {
    // The Next/Submit button and the Enter key both come here
    e.preventDefault();

    if (step < 3) {
      handleNext();
    } else {
      setIsSubmitted(true);
    }
  }

  function handleStartOver() {
    setFormData(initialForm);
    setErrors({});
    setStep(1);
    setIsSubmitted(false);
  }

  // 3. Main logic
  // Check only the fields that are on the current step
  function validateStep() {
    const newErrors = {};

    if (step === 1) {
      if (formData.name.trim() === "") {
        newErrors.name = "Name is required.";
      }
      if (formData.email.trim() === "") {
        newErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email.";
      }
    }

    if (step === 2) {
      if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be exactly 10 digits.";
      }
      if (formData.address.trim() === "") {
        newErrors.address = "Address is required.";
      }
    }

    return newErrors;
  }

  // 4. JSX
  if (isSubmitted) {
    return (
      <div className="steps-success">
        <h3>🎉 Submitted!</h3>
        <p>Thanks, {formData.name}. Your details were sent.</p>
        <button onClick={handleStartOver}>Start over</button>
      </div>
    );
  }

  return (
    <div className="steps">
      {/* Step indicator */}
      <ol className="steps-indicator">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          let className = "steps-item";
          if (stepNumber === step) className += " active";
          if (stepNumber < step) className += " done";

          return (
            <li key={label} className={className}>
              <span className="steps-number">{stepNumber < step ? "✓" : stepNumber}</span>
              {label}
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <>
            <div className="steps-field">
              <label htmlFor="msf-name">Name</label>
              <input id="msf-name" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <p className="steps-error">{errors.name}</p>}
            </div>
            <div className="steps-field">
              <label htmlFor="msf-email">Email</label>
              <input
                id="msf-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="steps-error">{errors.email}</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="steps-field">
              <label htmlFor="msf-phone">Phone</label>
              <input
                id="msf-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="steps-error">{errors.phone}</p>}
            </div>
            <div className="steps-field">
              <label htmlFor="msf-address">Address</label>
              <textarea
                id="msf-address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <p className="steps-error">{errors.address}</p>}
            </div>
          </>
        )}

        {step === 3 && (
          <dl className="steps-review">
            <dt>Name</dt>
            <dd>{formData.name}</dd>
            <dt>Email</dt>
            <dd>{formData.email}</dd>
            <dt>Phone</dt>
            <dd>{formData.phone}</dd>
            <dt>Address</dt>
            <dd>{formData.address}</dd>
          </dl>
        )}

        <div className="steps-buttons">
          <button type="button" onClick={handlePrevious} disabled={step === 1}>
            Previous
          </button>
          <button type="submit" className="primary-button">
            {step < 3 ? "Next" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MultiStepForm;
