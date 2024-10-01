import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import "./inventory.css";
import "./stock.css";
import AddStockModal from "../../components/addStockInModal";
import EditStockModal from "../../components/editStockInModal";
import ViewStockModal from "../../components/viewStockInModal";
import DeleteStockModal from "../../components/deleteStockModal";
import Alert from "../../components/Alert";
import WarehouseHeader from "../../components/WarehouseHeader";
import Button from "../../components/Button";
import Search from "../../components/Search";
import DataTable from "../../components/DataTable";
import Pagination from "../../components/Paginations";
import {
  IconSquareRoundedPlus,
  IconEdit,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";

interface StockIn {
  _id: string;
  userId: string;
  code: string;
  note: string;
  createdAt: string;
}

const StockInPage: React.FC = () => {
  const [headerText] = useState<string>("Stock In");
  const [stockInData, setStockInData] = useState<StockIn[]>([]);
  const [currentStockId, setCurrentStockId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchStockInData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/stock-in"
        );
        setStockInData(response.data.data);
      } catch (err: any) {
        console.error("Error fetching stock-in data:", err);
      }
    };

    fetchStockInData();
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
          `http://localhost:3000/api/v1/stock-in/${currentStockId}`
        );
        setStockInData((prev) =>
          prev.filter((stock) => stock._id !== currentStockId)
        );
        Alert({
          title: "Deleted!",
          text: "Stock in record successfully deleted.",
          icon: "success",
        });
      } catch (err: any) {
        console.error("Error deleting stock in record:", err);
        Alert({
          title: "Error!",
          text: "An error occurred while deleting the stock in record.",
          icon: "error",
        });
      } finally {
        setIsDeleteModalOpen(false);
        setCurrentStockId(null);
      }
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStockInData = stockInData.filter((stock) => {
    return (
      stock.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.note.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStockInData = filteredStockInData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStockInData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { header: "User ID", field: "userId" },
    { header: "Code", field: "code" },
    { header: "Note", field: "note" },
    { header: "Date", field: "createdAt" },
  ];

  return (
    <div className="container2">
      <Search searchTerm={searchTerm} onChange={handleSearchChange} />
      <div className="header2">
        <WarehouseHeader title={headerText} />
        <Button
          text="Add Stock In"
          onClick={() => setIsAddModalOpen(true)}
          icon={<IconSquareRoundedPlus size={20} />}
        />
      </div>
      <div className="table-responsive mt-3">
        <DataTable
          columns={columns}
          data={paginatedStockInData}
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

export const Route = createFileRoute("/warehouse/stock-in")({
  component: StockInPage,
});
