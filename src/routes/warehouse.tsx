import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import React from "react";
import "./warehouse.css";

const WarehouseComponent = () => {
  // Get the current path using useLocation from @tanstack/react-router
  const location = useLocation();
  const activePath = location.pathname;

  const isExactWarehousePath = activePath === "/warehouse";

  return (
    <div className="container">
      <div className="sidebar">
        <ul>
          <li>
            <Link
              to="/warehouse/inventory"
              className={
                isExactWarehousePath
                  ? "inactive"
                  : activePath === "/warehouse/inventory"
                  ? "active"
                  : ""
              }
            >
              Inventory
            </Link>
          </li>
          <li>
            <Link
              to="/warehouse/stock-in"
              className={
                isExactWarehousePath
                  ? "inactive"
                  : activePath === "/warehouse/stock-in"
                  ? "active"
                  : ""
              }
            >
              Stock In
            </Link>
          </li>
          <li>
            <Link
              to="/warehouse/stock-out"
              className={
                isExactWarehousePath
                  ? "inactive"
                  : activePath === "/warehouse/stock-out"
                  ? "active"
                  : ""
              }
            >
              Stock Out
            </Link>
          </li>
          <li>
            <Link
              to="/warehouse/stock-opname"
              className={
                isExactWarehousePath
                  ? "inactive"
                  : activePath === "/warehouse/stock-opname"
                  ? "active"
                  : ""
              }
            >
              Stock Opname
            </Link>
          </li>
          <li>
            <Link
              to="/warehouse/category"
              className={
                isExactWarehousePath
                  ? "inactive"
                  : activePath === "/warehouse/category"
                  ? "active"
                  : ""
              }
            >
              Category
            </Link>
          </li>
        </ul>
      </div>
      <div className="content2">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/warehouse")({
  component: WarehouseComponent,
});
