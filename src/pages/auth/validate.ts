export const validateEmail = (v: string) => {
  if (!v.trim()) return "Enter your email address";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : "Enter a valid email address, like you@email.com";
};
export const validateLoginPassword = (v: string) => (v ? undefined : "Enter your password");
export const validateNewPassword = (v: string) => {
  if (!v) return "Create a password";
  if (v.length < 8) return "Use at least 8 characters";
  if (!/\d/.test(v)) return "Add at least one number";
  return undefined;
};
export const validateName = (v: string) => (v.trim().length >= 2 ? undefined : "Enter your name");
export const passwordScore = (v: string) => [v.length >= 8, /\d/.test(v), /[A-Z]/.test(v) && /[^A-Za-z0-9]|[a-z]/.test(v), v.length >= 12].filter(Boolean).length;
