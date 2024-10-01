import React, { useEffect, useState } from 'react';

interface ViewItemModalProps {
  showModal: boolean;
  handleClose: () => void;
  item: any; // The item to be viewed
}

const ViewItemModal: React.FC<ViewItemModalProps> = ({ showModal, handleClose, item }) => {
  const [itemData, setItemData] = useState<any | null>(null);

  useEffect(() => {
    if (showModal && item) {
      setItemData(item);
    } else {
      setItemData(null); // Clear item data when modal is closed
    }
  }, [showModal, item]);

  if (!showModal) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">View Tool</h5>
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
                value={itemData?.name || ''}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={itemData?.categoryName || 'Unknown'} // Display category name
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={itemData?.location || ''}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Note</label>
              <textarea
                className="form-control"
                rows={4}
                value={itemData?.note || ''}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={itemData?.quantity || 0}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              {itemData?.image ? (
                <img
                    src={`http://localhost:3000/public/image/tools/${itemData.image}`} 
                    alt={item.name} 
                    className="img-fluid" 
                    style={{ maxWidth: '30%' }}
                  />
              ) : (
                <p>No image available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemModal;
