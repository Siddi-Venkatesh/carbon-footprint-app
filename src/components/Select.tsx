import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};

export const Select: React.FC<SelectProps> = ({ label, id, required, options, ...props }) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="input-group">
      <label htmlFor={selectId} className="input-label">
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      <select id={selectId} className="input-field" required={required} {...props}>
        <option value="" disabled>Select one option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
