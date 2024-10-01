import React, { useState } from 'react';

interface AddCategoryModalProps {
  showModal: boolean;
  handleClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ showModal, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    type: 'Mekanikal', // Default type
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Clear the form after success
        setFormData({ name: '', note: '', type: 'Mekanikal' }); // Reset type to default
        setTimeout(() => {
          handleClose(); // Close the modal after success
        }, 1000);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setError('Failed to add category. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">Add New Category</h5>
          <button type="button" className="btn btn-close" onClick={handleClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-form-left">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Note</label>
                <textarea
                  className="form-control"
                  rows={4}
                  name="note"
                  placeholder="Enter note"
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
                  required
                >
                  <option value="Mekanikal">Mekanikal</option>
                  <option value="Elektrikal">Elektrikal</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
