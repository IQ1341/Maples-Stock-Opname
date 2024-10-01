import React from 'react';
import '../routes/warehouse/stock.css';

interface DeleteStockModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteStockModal: React.FC<DeleteStockModalProps> = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Stock</h5>

          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this stock item?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-dark" onClick={onClose}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteStockModal;
