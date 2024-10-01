import React, { useState, useEffect } from 'react';
import '../routes/warehouse/stock.css';
import Alert from './Alert';

interface AddItemModalProps {
  showModal: boolean;
  handleClose: () => void;
  handleAddItem: (item: any) => void; // Update the type as needed
}

interface Category {
  _id: string;
  name: string;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ showModal, handleClose, handleAddItem }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    location: '',
    note: '',
    image: null as File | null,
    quantity: 0,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/category');
        const result = await response.json();
        if (response.ok) {
          setCategories(result.data); // Pastikan Anda mengakses result.data
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] || null : value,
    }));
  };

  // Handle form submission and image upload
  const handleProcessed = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('categoryId', formData.categoryId);
    data.append('location', formData.location.toUpperCase());
    data.append('note', formData.note);
    data.append('quantity', String(formData.quantity));
    if (formData.image) {
      data.append('image', formData.image);
    }
  
    try {
      const response = await fetch('http://localhost:3000/api/v1/tool', {
        method: 'POST',
        body: data,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add tool:', errorText); // Tambahkan log untuk error
        Alert({
          title: "Error!",
          text: "Terjadi kesalahan saat menambahkan data" + errorText ,
          icon: "error",
        });
        return;
      }
  
      const newItem = await response.json();
      handleAddItem(newItem);
      Alert({
        title: "Success!",
        text: "Data berhasil di tambahkan ",
        icon: "success",
      });
      handleClose();
    } catch (error) {
      Alert({
        title: "Error!",
        text: "Terjadi kesalahan saat menambahkan data",
        icon: "error",
      });
    }
  };
  
  if (!showModal) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">Add New Tool</h5>
          <button type="button" className="btn btn-close" onClick={handleClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="input-form-left">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter tool name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
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
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleChange}
                />
                {formData.image && (
                  <div className="mt-2">
                    <strong>Selected Image:</strong> {formData.image.name}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-dark" onClick={handleProcessed}>Add Tool</button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
