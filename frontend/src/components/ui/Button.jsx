export function Button({ children, onClick, disabled, variant = "primary", className = "", type = "button" }) {
  const base = "px-6 py-3 rounded-2xl font-bold text-base transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-duo-green text-white hover:bg-duo-green-dark shadow-md hover:shadow-lg",
    secondary: "bg-white text-duo-green border-2 border-duo-green hover:bg-green-50",
    danger: "bg-duo-red text-white hover:bg-red-600",
    ghost: "bg-transparent text-duo-muted hover:bg-gray-100",
  };
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
