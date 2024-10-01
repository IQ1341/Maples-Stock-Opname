import React, { useState, useEffect } from 'react';
import '../routes/warehouse/stock.css';

interface InventoryItem {
  _id: string;
  toolId: string;
  name: string;
  price: number;
  quantity: number;
}

interface StockItem {
  toolId: string;
  name: string;
  price: number;
  quantity: number;
}

interface StockInData {
  userId: string;
  code: string;
  note: string;
  createdAt: string;
  component: StockItem[];
}

interface ApiResponse<T> {
  data: T;
}

interface ViewStockInModalProps {
  show: boolean;
  onClose: () => void;
  stockId: string;
}

const ViewStockInModal: React.FC<ViewStockInModalProps> = ({ show, onClose, stockId }) => {
  const [stockData, setStockData] = useState<StockInData | null>(null);

  useEffect(() => {
    if (show && stockId) {
      fetchStockDetails();
    }
  }, [show, stockId]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const fetchStockDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/stock-in/${stockId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: ApiResponse<StockInData> = await response.json(); // Pastikan tipe data sesuai
      console.log('Fetched stock details:', data);
      setStockData(data.data); // Pastikan mengakses data.data
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setStockData(null); // Reset stockData on error
    }
  };

  const calculateTotal = () => {
    return stockData?.component ? stockData.component.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  };

  if (!show) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">View Stock In</h5>
          <button type="button" className="btn btn-close" onClick={onClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="input-form-left">
            <div className="mb-3">
              <label className="form-label">Input by</label>
              <input
                type="text"
                className="form-control"
                id="inputBy"
                value={stockData?.userId || ''}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Code</label>
              <input
                type="text"
                className="form-control"
                id="code"
                value={stockData?.code || ''}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Note</label>
              <textarea
                id="note"
                className="form-control"
                rows={4}
                value={stockData?.note || ''}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="text"
                className="form-control"
                id="date"
                value={stockData ? new Date(stockData.createdAt).toLocaleDateString() : ''}
                readOnly
              />
            </div>
          </div>

          <h3>Stock In Details</h3>
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Sub-Total</th>
                </tr>
              </thead>
              <tbody>
                {stockData?.component && stockData.component.length > 0 ? (
                  stockData.component.map((item, index) => (
                    <tr key={item.toolId} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                      <td>{truncateText(item.name, 20)}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>No items available</td> {/* Sesuaikan colSpan dengan jumlah kolom */}
                  </tr>
                )}
              </tbody>
            </table>

            <div className="total-section">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <div className="modal-footer">
            {/* Optional footer actions can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStockInModal;
