import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, ChangeEvent } from "react";
import DataTable from "../../components/DataTable";
import WarehouseHeader from "../../components/WarehouseHeader";
import Button from "../../components/Button";
import Search from "../../components/Search";
import AddItemModal from "../../components/addItemModal";
import EditItemModal from "../../components/editItemModal";
import ViewItemModal from "../../components/viewItemModal";
import { IconSquareRoundedPlus, IconEdit, IconEye } from "@tabler/icons-react";
import Pagination from "../../components/Paginations";

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  location: string | null;
  note: string | null;
  image?: string | null;
}

interface Category {
  _id: string;
  name: string;
}

const Inven: React.FC = () => {
  const [headerText] = useState<string>("Inventory");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null); // Ensure selectedItem is initialized as null
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // handle get data inventory
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/tool");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setItems(data.data);
        setFilteredItems(data.data); // Initially, filteredItems is same as items
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    // handle get category item
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/category");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchItems();
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredItems(items); // Show all items if no search term
    } else {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getCategoryName(item.categoryId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (item.location &&
            item.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1); // Reset to the first page whenever search term changes
  }, [searchTerm, items, categories]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // handle add item inventory
  const handleAddItem = async (newItem: FormData) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/tool", {
        method: "POST",
        body: newItem,
      });

      if (response.ok) {
        const updatedResponse = await fetch(
          "http://localhost:3000/api/v1/tool"
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setItems(updatedData.data);
        }
      } else {
        console.error("Failed to add the new item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // handle edit inventory item
  const handleEditItem = async (updatedItem: InventoryItem) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/tool/${updatedItem._id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedItem),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedResponse = await fetch(
          "http://localhost:3000/api/v1/tool"
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setItems(updatedData.data);
          setFilteredItems(updatedData.data);
          setShowEditModal(false);
          setSelectedItem(null);
        }
      } else {
        console.error("Failed to update the item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleViewClick = (item: InventoryItem) => {
    const categoryName = getCategoryName(item.categoryId);
    setSelectedItem({ ...item, categoryName });
    setShowViewModal(true);
  };

  const columns = [
    { header: "Name", field: "name" },
    { header: "Code Stock", field: "sku" },
    { header: "Category", field: "category" },
    { header: "Quantity", field: "quantity" },
    { header: "Location", field: "location" },
    { header: "Image", field: "image" },
  ];

  const enrichedItems = filteredItems.map((item) => ({
    ...item,
    category: getCategoryName(item.categoryId),
  }));

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItem = enrichedItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(enrichedItems.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container2">
      <Search searchTerm={searchTerm} onChange={handleSearchChange} />
      <div className="header2">
        <WarehouseHeader title={headerText} />
        <Button
          text="Add Items"
          onClick={() => setShowModal(true)}
          icon={<IconSquareRoundedPlus size={20} />}
        />
        <AddItemModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          handleAddItem={handleAddItem}
        />
      </div>
      <div className="table-responsive mt-3">
        <DataTable
          columns={columns}
          data={paginatedItem}
          showCheckbox={false}
          actions={(item) => (
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => handleEditClick(item)}
                icon={<IconEdit size={16} />}
                text="Edit"
              />
              <Button
                onClick={() => handleViewClick(item)}
                icon={<IconEye size={16} />}
                text="View"
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
      {/* show edit modal */}
      {showEditModal && selectedItem && (
        <EditItemModal
          showModal={showEditModal}
          handleClose={() => setShowEditModal(false)}
          handleEditItem={handleEditItem}
          item={selectedItem}
        />
      )}
      {/* show view modal */}
      {showViewModal && selectedItem && (
        <ViewItemModal
          showModal={showViewModal}
          handleClose={() => setShowViewModal(false)}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export const Route = createFileRoute("/warehouse/inventory")({
  component: Inven,
});
