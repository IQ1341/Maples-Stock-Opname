/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WarehouseImport } from './routes/warehouse'
import { Route as WarehouseStockOutImport } from './routes/warehouse/stock-out'
import { Route as WarehouseStockOpnameImport } from './routes/warehouse/stock-opname'
import { Route as WarehouseStockInImport } from './routes/warehouse/stock-in'
import { Route as WarehouseInventoryImport } from './routes/warehouse/inventory'
import { Route as WarehouseCategoryImport } from './routes/warehouse/category'

// Create Virtual Routes

const AboutLazyImport = createFileRoute('/about')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const WarehouseRoute = WarehouseImport.update({
  path: '/warehouse',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const WarehouseStockOutRoute = WarehouseStockOutImport.update({
  path: '/stock-out',
  getParentRoute: () => WarehouseRoute,
} as any)

const WarehouseStockOpnameRoute = WarehouseStockOpnameImport.update({
  path: '/stock-opname',
  getParentRoute: () => WarehouseRoute,
} as any)

const WarehouseStockInRoute = WarehouseStockInImport.update({
  path: '/stock-in',
  getParentRoute: () => WarehouseRoute,
} as any)

const WarehouseInventoryRoute = WarehouseInventoryImport.update({
  path: '/inventory',
  getParentRoute: () => WarehouseRoute,
} as any)

const WarehouseCategoryRoute = WarehouseCategoryImport.update({
  path: '/category',
  getParentRoute: () => WarehouseRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/warehouse': {
      id: '/warehouse'
      path: '/warehouse'
      fullPath: '/warehouse'
      preLoaderRoute: typeof WarehouseImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/warehouse/category': {
      id: '/warehouse/category'
      path: '/category'
      fullPath: '/warehouse/category'
      preLoaderRoute: typeof WarehouseCategoryImport
      parentRoute: typeof WarehouseImport
    }
    '/warehouse/inventory': {
      id: '/warehouse/inventory'
      path: '/inventory'
      fullPath: '/warehouse/inventory'
      preLoaderRoute: typeof WarehouseInventoryImport
      parentRoute: typeof WarehouseImport
    }
    '/warehouse/stock-in': {
      id: '/warehouse/stock-in'
      path: '/stock-in'
      fullPath: '/warehouse/stock-in'
      preLoaderRoute: typeof WarehouseStockInImport
      parentRoute: typeof WarehouseImport
    }
    '/warehouse/stock-opname': {
      id: '/warehouse/stock-opname'
      path: '/stock-opname'
      fullPath: '/warehouse/stock-opname'
      preLoaderRoute: typeof WarehouseStockOpnameImport
      parentRoute: typeof WarehouseImport
    }
    '/warehouse/stock-out': {
      id: '/warehouse/stock-out'
      path: '/stock-out'
      fullPath: '/warehouse/stock-out'
      preLoaderRoute: typeof WarehouseStockOutImport
      parentRoute: typeof WarehouseImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  WarehouseRoute: WarehouseRoute.addChildren({
    WarehouseCategoryRoute,
    WarehouseInventoryRoute,
    WarehouseStockInRoute,
    WarehouseStockOpnameRoute,
    WarehouseStockOutRoute,
  }),
  AboutLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/warehouse",
        "/about"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/warehouse": {
      "filePath": "warehouse.tsx",
      "children": [
        "/warehouse/category",
        "/warehouse/inventory",
        "/warehouse/stock-in",
        "/warehouse/stock-opname",
        "/warehouse/stock-out"
      ]
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/warehouse/category": {
      "filePath": "warehouse/category.tsx",
      "parent": "/warehouse"
    },
    "/warehouse/inventory": {
      "filePath": "warehouse/inventory.tsx",
      "parent": "/warehouse"
    },
    "/warehouse/stock-in": {
      "filePath": "warehouse/stock-in.tsx",
      "parent": "/warehouse"
    },
    "/warehouse/stock-opname": {
      "filePath": "warehouse/stock-opname.tsx",
      "parent": "/warehouse"
    },
    "/warehouse/stock-out": {
      "filePath": "warehouse/stock-out.tsx",
      "parent": "/warehouse"
    }
  }
}
ROUTE_MANIFEST_END */