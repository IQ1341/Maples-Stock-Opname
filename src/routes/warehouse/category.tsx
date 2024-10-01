import React, { useEffect, useState, ChangeEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import './inventory.css';
import './stock.css';
import AddCategoryModal from '../../components/addCategoryModal';
import EditCategoryModal from '../../components/editCategoryModal';
import ViewCategoryModal from '../../components/viewCategoryModal';

interface CategoryItem {
  _id: string;
  name: string;
  code: string;
  note?: string;
  items: number; 
}

const CategoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/category');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCategories(data.data);
        setFilteredCategories(data.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } 
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddCategory = async (newCategory: FormData) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/category', {
        method: 'POST',
        body: newCategory,
      });

      if (response.ok) {
        const updatedResponse = await fetch('http://localhost:3000/api/v1/category');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setCategories(updatedData.data);
          setFilteredCategories(updatedData.data);
        }
      } else {
        console.error('Failed to add the new category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditCategory = async (updatedCategory: CategoryItem) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/category/${updatedCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });

      if (response.ok) {
        const updatedResponse = await fetch('http://localhost:3000/api/v1/category');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setCategories(updatedData.data);
          setFilteredCategories(updatedData.data);
          setShowEditModal(false);
        }
      } else {
        console.error('Failed to update the category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

 

  const handleEditClick = (category: CategoryItem) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleViewClick = (category: CategoryItem) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredCategories.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container2">
      <div className="mb-3 w-25 position-relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
          placeholder="Search…"
        />
        <i className="fas fa-search position-absolute" style={{ top: '50%', left: '90%', transform: 'translateY(-50%)', color: '#182433' }}></i>
      </div>

      <div className="header2">
        <h1>Categories</h1>
        <button className="btn btn-dark" onClick={() => setShowModal(true)}>
          Add Category
        </button>
      </div>

      <AddCategoryModal showModal={showModal} handleClose={() => setShowModal(false)} handleAddCategory={handleAddCategory} />

      <div className="table-responsive mt-3">
        <table className="table card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category, index) => (
              <tr key={category._id} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                <td>{category.name}</td>
                <td>{category.code}</td>
                <td>{category.note}</td>
                <td>
                  <button className="btn btn-dark" onClick={() => handleEditClick(category)}>Edit</button>
                  <button className="btn btn-dark" onClick={() => handleViewClick(category)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav>
          <ul className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, marginTop: 20 }}>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="btn btn-dark" onClick={prevPage} disabled={currentPage === 1}>
                &laquo; Previous
              </button>
            </li>
            {Array.from({ length: Math.ceil(filteredCategories.length / itemsPerPage) }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} style={{ listStyleType: 'none', margin: '0 3px' }}>
                <button
                  className={`btn btn-ghost-dark`}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    color: currentPage === index + 1 ? 'white' : 'black',
                    backgroundColor: currentPage === index + 1 ? '#182433' : 'transparent',
                    textDecoration: 'none',
                    padding: '5px 12px',
                    borderRadius: '5px'
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === Math.ceil(filteredCategories.length / itemsPerPage) ? 'disabled' : ''}`}>
              <button className="btn btn-dark" onClick={nextPage} disabled={currentPage === Math.ceil(filteredCategories.length / itemsPerPage)}>
                Next &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {selectedCategory && (
        <>
          <EditCategoryModal
            showModal={showEditModal}
            handleClose={() => setShowEditModal(false)}
            category={selectedCategory}
            handleEditCategory={handleEditCategory}
          />
          <ViewCategoryModal
            showModal={showViewModal}
            handleClose={() => setShowViewModal(false)}
            category={selectedCategory}
          />
        </>
      )}
    </div>
  );
};

export const Route = createFileRoute('/warehouse/category')({
  component: CategoryPage,
});

export default CategoryPage;
