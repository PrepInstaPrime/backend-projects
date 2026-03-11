// email validator
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// password validator
const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 15;
  if (typeof password !== "string") return false;
  if (/\s/.test(password)) return false; // disallow spaces
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  return (
    password.length >= minLength &&
    password.length <= maxLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
};

// username validation
const validateUsername = (username) => {
  const minLength = 3;
  const maxLength = 15;
  const hasInvalidChars = /[^a-zA-Z0-9_]/.test(username);
  return (
    username.length >= minLength &&
    username.length <= maxLength &&
    !hasInvalidChars
  );
};
// validate phone
const validatePhone = (phone) => {
  const re = /^\d{10}$/;
  return re.test(String(phone));
};

export { validateEmail, validatePassword, validateUsername, validatePhone };
