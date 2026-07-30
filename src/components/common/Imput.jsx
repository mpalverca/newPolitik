// components/common/Input.jsx
export const Input = ({ type, placeholder, value, onChange, required }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    style={{ width: "100%", padding: "0.5rem", margin: "0.5rem 0" }}
  />
);