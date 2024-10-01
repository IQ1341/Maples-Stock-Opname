import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../routes/warehouse/stock.css'; // Include your styles

interface EditItemModalProps {
  showModal: boolean;
  handleClose: () => void;
  item: any; // The item to be edited
  handleEditItem: (updatedItem: any) => void; // Function to handle item edit
}

const EditItemModal: React.FC<EditItemModalProps> = ({ showModal, handleClose, item, handleEditItem }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    location: '',
    note: '',
    image: null as File | null,
    quantity: 1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/category');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []); // Ensure to access the correct data structure
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        categoryId: item.categoryId || '',
        location: item.location || '',
        note: item.note || '',
        image: null,
        quantity: item.quantity || 1,
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] || null : value,
    }));
  };

  const handleProcessed = async () => {
    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      location: formData.location.toUpperCase(),
      note: formData.note,
      image: formData.image ? await fileToBase64(formData.image) : item.image,
      quantity: formData.quantity,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/v1/tool/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        handleEditItem(updatedItem);
        handleClose();
      } else {
        const errorText = await response.text();
        console.error('Failed to edit tool:', errorText);
      }
    } catch (error) {
      console.error('Error editing tool:', error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  };

  if (!showModal) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">Edit Tool</h5>
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
              <label className="form-label">Category</label>
              <Select
                options={categories.map(cat => ({ value: cat._id, label: cat.name }))} // Ensure you use the correct field for category ID
                onChange={(selected) => setFormData(prev => ({ ...prev, categoryId: selected?.value || '' }))}
                placeholder="Select category"
                value={categories.find(cat => cat._id === formData.categoryId) ? { value: formData.categoryId, label: categories.find(cat => cat._id === formData.categoryId).name } : null}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
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
            {/* <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleChange}
              />
              {formData.image && (
                <div className="mt-2">
                  <strong>Edited Image:</strong> {formData.image.name}
                </div>
              )}
            </div> */}
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-dark" onClick={handleProcessed}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
