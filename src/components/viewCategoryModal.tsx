import React, { useState, useEffect } from 'react';

interface ViewCategoryModalProps {
  showModal: boolean;
  handleClose: () => void;
  category: { name: string; code: string; note?: string; items: number; type: string }; // Add type here
}

const ViewCategoryModal: React.FC<ViewCategoryModalProps> = ({ showModal, handleClose, category }) => {
  const [categoryData, setCategoryData] = useState<any | null>(null);

  useEffect(() => {
    if (showModal && category) {
      setCategoryData(category);
    }
  }, [showModal, category]);

  if (!showModal) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">View Category</h5>
          <button type="button" className="btn btn-close" onClick={handleClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="input-form-left">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={categoryData?.name || ''}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <input
                type="text"
                className="form-control"
                value={categoryData?.code || ''}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Type</label> {/* New field for Type */}
              <input
                type="text"
                className="form-control"
                value={categoryData?.type || 'N/A'} // Display type
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Note</label>
              <textarea
                className="form-control"
                rows={4}
                value={categoryData?.note || 'N/A'}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryModal;
