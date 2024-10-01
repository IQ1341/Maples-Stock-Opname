import React, { useState, useEffect } from 'react';
import '../routes/warehouse/stock.css'; // Include your styles

interface EditCategoryModalProps {
  showModal: boolean;
  handleClose: () => void;
  category: any; // Ensure this matches your structure
  handleEditCategory: (updatedCategory: any) => void; // Update type here
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ showModal, handleClose, category, handleEditCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    type: 'Mekanikal', // Default type
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        note: category.note || '',
        type: category.type || 'Mekanikal', // Set type based on category
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProcessed = async () => {
    const data = {
      name: formData.name,
      note: formData.note,
      type: formData.type, // Include type in the updated data
    };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/category/${category._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        handleEditCategory(updatedCategory);
        handleClose();
      } else {
        const errorText = await response.text();
        console.error('Failed to edit category:', errorText);
      }
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">Edit Category</h5>
          <button type="button" className="btn btn-close" onClick={handleClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Note</label>
              <textarea
                className="form-control"
                rows={4}
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select
                className="form-control"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Mekanikal">Mekanikal</option>
                <option value="Elektrikal">Elektrikal</option>
              </select>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-dark" onClick={handleProcessed}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
