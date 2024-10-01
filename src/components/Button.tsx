interface ButtonProps {
  text: string;
  onClick: () => void;
  icon?: React.ReactNode; // Optional icon
}

const Button: React.FC<ButtonProps> = ({ text, onClick, icon }) => {
  return (
    <button 
      className="btn btn-dark" 
      onClick={onClick} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        padding: '8px 12px', // Add padding for better button size
        border: 'none', // Optional: remove default border
        cursor: 'pointer', // Optional: change cursor to pointer on hover
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>} {/* Icon placed before text */}
      {text}
    </button>
  );
};

export default Button;
