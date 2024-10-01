// src/components/EditSaveButton.tsx
import React from "react";

interface EditSaveButtonProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  icon?: React.ReactNode; 
}

const EditSaveButton: React.FC<EditSaveButtonProps> = ({ isEditing, onEdit, onSave, icon }) => {
  return (
    <button
      className="btn btn-dark btn-opname"
      onClick={isEditing ? onSave : onEdit}
      style={{
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '6px', 
        padding: '8px 12px', 
        borderRadius: '4px' 
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{isEditing ? "Save" : "Edit"}</span>
    </button>
  );
};

export default EditSaveButton;
