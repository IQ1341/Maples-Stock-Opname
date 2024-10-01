import React, { useState, useEffect } from 'react';
import '../routes/warehouse/stock.css';
import Select from 'react-select';

interface EditStockInModalProps {
  show: boolean;
  onClose: () => void;
  stockId: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface StockInData {
  userId: string;
  code: string;
  note: string;
  createdAt: string;
  component: InventoryItem[];
}

interface ApiResponse<T> {
  data: T;
}

const EditStockInModal: React.FC<EditStockInModalProps> = ({ show, onClose, stockId }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [toolId: string]: InventoryItem }>({});
  const [note, setNote] = useState('');
  const [inputBy, setInputBy] = useState('');

  // Fungsi untuk mereset semua state ke nilai awal
  const resetState = () => {
    setItems([]);
    setFilteredItems([]);
    setSelectedItems({});
    setNote('');
    setInputBy('');
  };

  useEffect(() => {
    if (show) {
      // Reset state sebelum membuka modal
      resetState();
      fetchInventory();
      fetchStockDetails();
    } else {
      // Reset state ketika modal ditutup
      resetState();
    }
  }, [show, stockId]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/tool');
      if (!response.ok) {
        throw new Error(`Error fetching inventory: ${response.statusText}`);
      }
      const data: ApiResponse<InventoryItem[]> = await response.json();
      if (Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        console.error('Inventory response is not an array:', data);
        setItems([]);
      }
      setFilteredItems([]);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setItems([]);
    }
  };

  const fetchStockDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/stock-in/${stockId}`);
      if (!response.ok) {
        throw new Error(`Error fetching stock details: ${response.statusText}`);
      }
      const data: ApiResponse<StockInData> = await response.json();

      if (data && data.data && data.data.component && Array.isArray(data.data.component)) {
        const selected = data.data.component.reduce((acc: any, item: any) => {
          acc[item._id] = {
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          };
          return acc;
        }, {});
        setSelectedItems(selected);
      } else {
        console.error('Stock details response does not have "component" array:', data);
        setSelectedItems({});
      }

      setInputBy(data.data.userId || '');
      setNote(data.data.note || '');
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setSelectedItems({});
      setInputBy('');
      setNote('');
    }
  };

  const handleSearch = (selectedOptions: any) => {
    if (selectedOptions) {
      const item = items.find(item => item._id === selectedOptions.value);
      if (item) {
        setSelectedItems(prevState => ({
          ...prevState,
          [item._id]: { ...item, quantity: 0, price: item.price },
        }));
        setFilteredItems(filteredItems.filter(i => i._id !== item._id));
      }
    }
  };

  const handleQuantityChange = (toolId: string, quantity: number) => {
    setSelectedItems(prevState => {
      const item = prevState[toolId];
      if (!item) return prevState;

      const newQuantity = Math.max(0, quantity);
      return { ...prevState, [toolId]: { ...item, quantity: newQuantity } };
    });
  };

  const handlePriceChange = (toolId: string, price: number) => {
    setSelectedItems(prevState => {
      const item = prevState[toolId];
      if (!item) return prevState;

      const newPrice = Math.max(0, price);
      return { ...prevState, [toolId]: { ...item, price: newPrice } };
    });
  };

  const handleProcessed = async () => {
    const stockData = Object.keys(selectedItems).map(toolId => ({
      toolId: selectedItems[toolId]._id,
      ...selectedItems[toolId],
    }));

    try {
      const response = await fetch(`http://localhost:3000/api/v1/stock-in/${stockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: inputBy,
          component: stockData,
          note,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error updating stock: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Stock updated:', result);
      onClose();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const calculateTotal = () => {
    return Object.values(selectedItems).reduce((acc, item) => {
      const subTotal = (item.price ?? 0) * (item.quantity ?? 0);
      return acc + subTotal;
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) || 'Rp 0,00';
  };

  const SearchOptions = items.map(item => ({
    value: item._id,
    label: item.name,
  }));

  if (!show) return null;

  return (
    <div className="modal modal-blur fade show" style={{ display: 'block' }} tabIndex={-1} role="dialog">
      <div className="modal-content2">
        <div className="modal-header">
          <h5 className="modal-title">Edit Stock In</h5> 
          <button type="button" className="btn btn-close" onClick={onClose} aria-label="Close">
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="input-form-left">
              <div className="mb-3">
                <label className="form-label">Input by</label>
                <input
                  type="text"
                  className="form-control"
                  value={inputBy}
                  onChange={(e) => setInputBy(e.target.value)}
                  placeholder="Enter personal"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Note</label>
                <textarea
                  className="form-control"
                  id="note"
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter note"
                />
              </div>
            </div>

            <div className="input-form-right">
              <div className="mb-3">
                <label className="form-label">Inventory</label>
                <Select
                  options={SearchOptions}
                  onChange={handleSearch}
                  placeholder="Select inventory"
                />
              </div>
            </div>

            <div className="search-results">
              {filteredItems.map(item => (
                <div
                  className="search-result"
                  key={item._id}
                  onClick={() => {
                    if (!selectedItems[item._id]) {
                      setSelectedItems(prevState => ({
                        ...prevState,
                        [item._id]: { ...item, quantity: 0, price: item.price }
                      }));
                    }
                    setFilteredItems(filteredItems.filter(i => i._id !== item._id));
                  }}
                >
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </form>

          <h3>Stock In Details</h3> {/* Sesuaikan judul sesuai konteks */}
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Sub-Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(selectedItems).length > 0 ? (
                  Object.keys(selectedItems).map((toolId, index) => {
                    const item = selectedItems[toolId];
                    const subTotal = (item.price ?? 0) * (item.quantity ?? 0);
                    return (
                      <tr key={toolId} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                        <td>{truncateText(item.name, 20)}</td>
                        <td>
                          <input
                            className="input-price"
                            type="number"
                            value={item.price}
                            onChange={(e) => handlePriceChange(toolId, parseFloat(e.target.value))}
                            placeholder="Price"
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            className='input-quantity'
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(toolId, parseFloat(e.target.value))}
                            placeholder="Quantity"
                            min="0"
                          />
                        </td>
                        <td>
                          {formatCurrency(subTotal)}
                        </td>
                        <td>
                          <button type="button" className="btn btn-dark" onClick={() => {
                            setSelectedItems(prevState => {
                              const { [toolId]: _, ...rest } = prevState;
                              return rest;
                            });
                          }}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>No items available</td> {/* Sesuaikan colSpan dengan jumlah kolom */}
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
            <button type="button" className="btn btn-dark" onClick={handleProcessed}>Update Stock In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStockInModal;
