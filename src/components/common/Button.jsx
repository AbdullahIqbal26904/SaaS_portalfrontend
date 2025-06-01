import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  fullWidth = false 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium shadow-sm focus:outline-none";
  
  const variantClasses = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    secondary: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    success: "text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
    warning: "text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500",
    info: "text-white bg-blue-400 hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300",
    light: "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
  };
  
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-6 py-3 text-lg",
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
