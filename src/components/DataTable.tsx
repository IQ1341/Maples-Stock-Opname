import React from "react";
import "../routes/warehouse/inventory.css";
import "../routes/warehouse/stock.css";
import defaultImage from "../assets/images/default.svg";



interface DataTableProps {
  columns: { header: string; field: string }[];
  data: any[];
  actions?: (item: any) => JSX.Element | null;
  onToggleSelect?: (id: string) => void;
  selectedItems?: Set<string>;
  onToggleSelectAll?: () => void;
  selectAll?: boolean;
  editId?: string | null;
  updatedStock?: number | null;
  onUpdatedStockChange?: (value: number | null) => void;
  showCheckbox?: boolean;
}



const truncateText = (text: string | null, maxLength: number) => {
  return text && text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions,
  onToggleSelect,
  selectedItems,
  onToggleSelectAll,
  selectAll,
  editId,
  updatedStock,
  onUpdatedStockChange,
  showCheckbox = false, // Default false
}) => {
  // const defaultImage = "../../assets/images/default.svg";
  return (
    <table className="table card-table table-vcenter text-nowrap datatable">
      <thead>
        <tr>
          {showCheckbox && ( // Hanya tampilkan checkbox jika showCheckbox true
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onToggleSelectAll}
              />
            </th>
          )}
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={item._id}
            className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}
          >
            {showCheckbox && ( // Hanya tampilkan checkbox jika showCheckbox true
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems?.has(item._id) || false}
                  onChange={() => onToggleSelect?.(item._id)}
                />
              </td>
            )}
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                 {col.field === "image" ? ( // Kondisi untuk menampilkan gambar
                  <img
                    src={
                      item.image
                        ? `http://localhost:3000/public/image/tools/${item.image}`
                        : defaultImage
                    }
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxWidth: "35px" }}
                  />
                ) : col.field === "realStock" && editId === item._id ? (
                  <input
                    type="number"
                    value={updatedStock !== null ? updatedStock : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        onUpdatedStockChange?.(null);
                      } else {
                        onUpdatedStockChange?.(Number(value));
                      }
                    }}
                    className="input-opname"
                  />
                ) : col.field === "date" ? (
                  <div
                    className={`last-updated-container ${
                      new Date(item.date) <
                      new Date(Date.now() - 27 * 24 * 60 * 60 * 1000)
                        ? "outdated"
                        : "recent"
                    }`}
                  >
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                ) : col.field.includes(".") ? (
                  <span
                    title={col.field.split(".").reduce((o, i) => o[i], item)}
                    style={{ cursor: "pointer" }}
                  >
                    {truncateText(
                      col.field.split(".").reduce((o, i) => o[i], item),
                      15 // Batas panjang yang diinginkan
                    )}
                  </span>
                ) : (
                  <span title={item[col.field]} style={{ cursor: "pointer" }}>
                    {truncateText(item[col.field], 20)}{" "}
                    {/* Batas panjang yang diinginkan */}
                  </span>
                )}
              </td>
            ))}
            {actions && <td>{actions(item)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
