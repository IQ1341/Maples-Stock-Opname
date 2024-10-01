import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import DataTable from "../../components/DataTable";
import Alert from "../../components/Alert";
import WarehouseHeader from "../../components/WarehouseHeader";
import Button from "../../components/Button";
import Search from "../../components/Search";
import Pagination from "../../components/Paginations";
import {
  IconSquareRoundedPlus,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";

import AddStockModal from "../../components/addStockOutModal";
import EditStockModal from "../../components/editStockOutModal";
import ViewStockModal from "../../components/viewStockOutModal";
import DeleteStockModal from "../../components/deleteStockModal";

interface StockOut {
  _id: string;
  userId: string;
  code: string;
  note: string;
  createdAt: string;
}

const StockOutPage: React.FC = () => {
  const [headerText] = useState<string>("Stock Out");
  const [stockOuts, setStockOuts] = useState<StockOut[]>([]);

  const [editId, setEditId] = useState<string | null>(null);
  const [updatedNote, setUpdatedNote] = useState<string | null>(null);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(
    new Set<string>()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStockId, setCurrentStockId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockOuts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/stock-out"
        );
        setStockOuts(response.data.data);
      } catch (err: any) {
        console.error("Error fetching stock out data:", err);
      } finally {

      }
    };

    fetchStockOuts();
  }, []);

  const handleEdit = (id: string) => {
    setCurrentStockId(id);
    setIsEditModalOpen(true);
  };

  const handleView = (id: string) => {
    setCurrentStockId(id);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCurrentStockId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (currentStockId) {
      try {
        await axios.delete(
          `http://localhost:3000/api/v1/stock-out/${currentStockId}`
        );
        setStockOuts((prev) =>
          prev.filter((stock) => stock._id !== currentStockId)
        );
        setSelectedStocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentStockId);
          return newSet;
        });
        Alert({
          title: "Deleted!",
          text: "Stock out berhasil dihapus.",
          icon: "success",
        });
      } catch (err: any) {
        console.error("Error deleting stock out:", err);
        Alert({
          title: "Error!",
          text: "Terjadi kesalahan saat menghapus stock out.",
          icon: "error",
        });
      } finally {
        setIsDeleteModalOpen(false);
        setCurrentStockId(null);
      }
    }
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
      const allIds = new Set(stockOuts.map((stock) => stock._id));
      setSelectedStocks(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStockOuts = stockOuts.filter((stock) => {
    const userId = stock.userId.toLowerCase();
    const code = stock.code.toLowerCase();
    const note = stock.note.toLowerCase();
    return (
      userId.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase()) ||
      note.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStockOuts = filteredStockOuts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStockOuts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  const columns = [
    { header: "User ID", field: "userId" },
    { header: "Code", field: "code" },
    {
      header: "Note",
      field: "note",
      render: (stock: StockOut) => (
        <>
          {editId === stock._id ? (
            <input
              type="text"
              value={updatedNote ?? ""}
              onChange={(e) => setUpdatedNote(e.target.value)}
              className="input-note"
            />
          ) : (
            stock.note
          )}
        </>
      ),
    },
    { header: "Date", field: "createdAt" },
  ];

  return (
    <div className="container2">
      <Search searchTerm={searchTerm} onChange={handleSearchChange} />
      <div className="header2">
        <WarehouseHeader title={headerText} />
        <Button
          text="Add Stock Out"
          onClick={() => setIsAddModalOpen(true)}
          icon={<IconSquareRoundedPlus size={20} />}
        />
      </div>
      <div className="table-responsive mt-3">
        <DataTable
          columns={columns}
          data={paginatedStockOuts}
          onToggleSelect={toggleSelect}
          selectedItems={selectedStocks}
          onToggleSelectAll={toggleSelectAll}
          selectAll={selectAll}
          editId={editId}
          actions={(item) => (
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => handleEdit(item._id)}
                icon={<IconEdit size={16} />}
                text="Edit"
              />
              <Button
                onClick={() => handleView(item._id)}
                icon={<IconEye size={16} />}
                text="View"
              />
              <Button
                onClick={() => handleDelete(item._id)}
                icon={<IconTrash size={16} />}
                text="Delete"
              />
            </div>
          )}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Modal for Add Stock */}
      <AddStockModal
        show={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Modal for Edit Stock */}
      {currentStockId && (
        <EditStockModal
          show={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentStockId(null);
          }}
          stockId={currentStockId}
        />
      )}

      {/* Modal for View Stock */}
      {currentStockId && (
        <ViewStockModal
          show={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setCurrentStockId(null);
          }}
          stockId={currentStockId}
        />
      )}

      {/* Modal for Delete Stock */}
      {currentStockId && (
        <DeleteStockModal
          show={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCurrentStockId(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export const Route = createFileRoute("/warehouse/stock-out")({
  component: StockOutPage,
});
