import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import DataTable from "../../components/DataTable"; // Import DataTable
import Alert from "../../components/Alert";
import WarehouseHeader from "../../components/WarehouseHeader";
import Button from "../../components/Button";
import Search from "../../components/Search";
import Pagination from "../../components/Paginations";
import EditSaveButton from "../../components/EditSaveButton";
import { IconFileArrowRight } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";
import { IconDeviceFloppy } from "@tabler/icons-react";

interface StockOpname {
  _id: string;
  toolId: {
    name: string;
    sku: string;
    quantity: number;
    location: string;
  };
  realStock: number;
  discrepancy: number;
  date: string;
}

const StockOpname: React.FC = () => {
  const [headerText] = useState<string>("Stock Opname");
  const [stockOpnames, setStockOpnames] = useState<StockOpname[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [updatedStock, setUpdatedStock] = useState<number | null>(null);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(
    new Set<string>()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchStockOpnames = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/stock-opname"
        );
        setStockOpnames(response.data.data);
      } catch (err: any) {
        console.error("Error fetching stock opname:", err);
      }
    };

    fetchStockOpnames();
  }, []);

  const handleEdit = (id: string, currentStock: number) => {
    setEditId(id);
    setUpdatedStock(currentStock);
  };

  const handleUpdate = async (id: string) => {
    if (updatedStock !== null) {
      try {
        const tool = stockOpnames.find((stock) => stock._id === id)?.toolId;
        const quantity = tool ? tool.quantity : 0;
        const discrepancy = updatedStock - quantity;
        const currentDate = new Date().toISOString();

        await axios.put(`http://localhost:3000/api/v1/stock-opname/${id}`, {
          realStock: updatedStock,
          discrepancy: discrepancy,
          date: currentDate,
        });

        setStockOpnames((prev) =>
          prev.map((stock) =>
            stock._id === id
              ? {
                  ...stock,
                  realStock: updatedStock,
                  discrepancy: discrepancy,
                  date: currentDate,
                }
              : stock
          )
        );

        Alert({
          title: "Success!",
          text: "Stock opname was saved successfully.",
          icon: "success",
        });

        setEditId(null);
        setUpdatedStock(null);
      } catch (err: any) {
        console.error("Error updating stock opname:", err);
        Alert({
          title: "Error!",
          text: "An error occurred while saving the stock opname.",
          icon: "error",
        });
      }
    }
  };

  const exportReport = () => {
    if (selectedStocks.size === 0) {
      Alert({
        title: "Error!",
        text: "No items selected. Please select at least one item to export.",
        icon: "error",
      });
      return;
    }

    const selectedData = stockOpnames.filter((stock) =>
      selectedStocks.has(stock._id)
    );

    const csvContent = [
      [
        "Name",
        "SKU",
        "Quantity",
        "System Stock",
        "Discrepancy",
        "Location",
        "Last Updated",
      ],
      ...selectedData.map((stock) => {
        const tool = stock.toolId;
        return [
          tool.name,
          tool.sku,
          tool.quantity,
          stock.realStock,
          stock.realStock - tool.quantity,
          tool.location || "N/A",
          new Date(stock.date).toLocaleDateString(),
        ];
      }),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "stock_opname_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelect = (id: string) => {
    const newSelectedStocks = new Set(selectedStocks);
    if (newSelectedStocks.has(id)) {
      newSelectedStocks.delete(id);
    } else {
      newSelectedStocks.add(id);
    }
    setSelectedStocks(newSelectedStocks);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStocks(new Set<string>());
    } else {
      const allIds = new Set(stockOpnames.map((opname) => opname._id));
      setSelectedStocks(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStockOpnames = stockOpnames.filter((stock) => {
    const tool = stock.toolId;
    const toolName = tool?.name?.toLowerCase() || "";
    const sku = tool?.sku?.toLowerCase() || "";
    const location = tool?.location?.toLowerCase() || "";

    const searchTermLower = searchTerm.toLowerCase();

    return (
      toolName.includes(searchTermLower) ||
      sku.includes(searchTermLower) ||
      location.includes(searchTermLower)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStockOpnames = filteredStockOpnames.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(filteredStockOpnames.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { header: "Name", field: "toolId.name" },
    { header: "Code Stock", field: "toolId.sku" },
    { header: "System Stock", field: "toolId.quantity" },
    {
      header: "Real Stock",
      field: "realStock",
      render: (stock: StockOpname) => (
        <>
          {editId === stock._id ? (
            <input
              type="number"
              value={updatedStock ?? ""}
              onChange={(e) => setUpdatedStock(Number(e.target.value))}
              className="input-opname"
            />
          ) : (
            stock.realStock
          )}
        </>
      ),
    },
    { header: "Discrepancy", field: "discrepancy" },
    { header: "Location", field: "toolId.location" },
    { header: "Last Updated", field: "date" },
  ];

  return (
    <div className="container2">
      <Search searchTerm={searchTerm} onChange={handleSearchChange} />
      <div className="header2">
        <WarehouseHeader title={headerText} />
        <Button
          text="Export"
          onClick={exportReport}
          icon={<IconFileArrowRight size={20} />}
        />
      </div>
      <div className="table-responsive mt-3">
        <DataTable
          columns={columns}
          data={paginatedStockOpnames}
          showCheckbox={true}
          onToggleSelect={toggleSelect}
          selectedItems={selectedStocks}
          onToggleSelectAll={toggleSelectAll}
          selectAll={selectAll}
          editId={editId}
          updatedStock={updatedStock}
          onUpdatedStockChange={setUpdatedStock}
          actions={(stock: StockOpname) => (
            <EditSaveButton
              isEditing={editId === stock._id}
              onEdit={() => handleEdit(stock._id, stock.realStock)}
              onSave={() => handleUpdate(stock._id)}
              icon={
                editId === stock._id ? (
                  <IconDeviceFloppy size={20} />
                ) : (
                  <IconEdit size={20} />
                )
              }
            />
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/warehouse/stock-opname")({
  component: StockOpname,
});
