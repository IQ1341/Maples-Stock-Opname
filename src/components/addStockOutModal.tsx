import React, { useState, useEffect } from 'react';
import '../routes/warehouse/stock.css';
import Select from 'react-select'; 

interface AddStockOutModalProps {
  show: boolean;
  onClose: () => void;
}

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const AddStockOutModal: React.FC<AddStockOutModalProps> = ({ show, onClose }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [toolId: string]: InventoryItem }>({});
  const [note, setNote] = useState('');
  const [inputBy, setInputBy] = useState('');

  const resetState = () => {
    setItems([]);
    setFilteredItems([]);
    setSelectedItems({});
    setNote('');
    setInputBy('');
  };

  useEffect(() => {
    if (show) {
      resetState();
      fetchInventory();
    } else {
      resetState();
    }
  }, [show]); 

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }; 

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/tool');
      const data = await response.json();

      // Ensure data is an array before setting it
      if (Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        console.error('Error: Expected array but got', data);
        setItems([]); // set to an empty array if data is not an array
      }
      setFilteredItems([]);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setItems([]); // handle error case by setting items to an empty array
    }
  };

  const handleSearch = (selectedOptions: any) => {
    if (selectedOptions) {
      const item = items.find(item => item._id === selectedOptions.value);
      if (item) {
        setSelectedItems(prevState => ({
          ...prevState,
          [item._id]: { ...item, quantity: 0 },
        }));
        setFilteredItems(filteredItems.filter(i => i._id !== item._id));
      }
    }
  };

  const handleQuantityChange = (toolId: string, quantity: number) => {
    setSelectedItems(prevState => {
      const item = prevState[toolId];
      if (!item) return prevState;

      const newQuantity = Math.max(0, quantity); // Ensure quantity is non-negative
      return { ...prevState, [toolId]: { ...item, quantity: newQuantity } };
    });
  };


  const handleProcessed = async () => {
    const stockData = Object.keys(selectedItems).map(toolId => ({
      toolId: selectedItems[toolId]._id,
      ...selectedItems[toolId],
    }));

    try {
      const response = await fetch('http://localhost:3000/api/v1/stock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: inputBy,
          component: stockData,
          note,
        }),
      });
      const result = await response.json();
      console.log('Stock In processed:', result);
      onClose();
    } catch (error) {
      console.error('Error processing stock in:', error);
    }
  };

  const calculateTotal = () => {
    return Object.values(selectedItems).reduce((acc, item) => {
      const quantity = item.quantity ?? 0;
      return acc + quantity;
    }, 0);
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
          <h5 className="modal-title">Add New Stock</h5>
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
                        [item._id]: { ...item, quantity: 0 }
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

          <h3>Stock In Details</h3>
          <div className="table-responsive">
            <table className="table card-table table-vcenter text-nowrap datatable">
              <thead>
                <tr>
                  <th>Name</th>

                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(selectedItems).map((toolId, index) => {
                  const item = selectedItems[toolId];
                  return (
                    <tr key={toolId} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                      <td>{truncateText(item.name, 20)}</td>
                      <td>
                        <input
                          className='input-quantity'
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(toolId, parseFloat(e.target.value))}
                          placeholder="Quantity"
                        />
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
                })}
              </tbody>
            </table>

            <div className="total-section">
              <span>Total Quantity</span>
              <span>{calculateTotal()}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-dark" onClick={handleProcessed}>Add Stock Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStockOutModal;
