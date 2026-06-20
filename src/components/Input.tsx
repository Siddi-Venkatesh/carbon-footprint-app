import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input: React.FC<InputProps> = ({ label, id, required, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="input-group">
      <label htmlFor={inputId} className="input-label">
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      <input id={inputId} className="input-field" required={required} {...props} />
    </div>
  );
};
