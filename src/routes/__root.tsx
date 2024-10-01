import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Header from '../components/header';
import './root.css';
import { IconBuildingWarehouse, IconHelpHexagon, IconHome2, IconLeaf2, IconTerminal2, IconUserSquareRounded } from '@tabler/icons-react';

export const Route = createRootRoute({
  component: () => (
    <div className="page">
      {/* navbar */}
      <Header
        menu={[
          {
            title: 'Home',
            icon: <IconHome2 color="#000" />,
            link: '/',
            child: null,
          },
          {
            title: 'Agronomist',
            icon: <IconLeaf2 color="#000" />,
            link: '/agronomist',
            child: null,
          },
          {
            title: 'Warehouse',
            icon: <IconBuildingWarehouse color="#000" />,
            link: '/warehouse/inventory',
            child: null,
          },
          {
            title: 'Hardware & Software',
            icon: <IconTerminal2 color="#000" />,
            link: '/software',
            child: null,
          },
          {
            title: 'Employees',
            icon: <IconUserSquareRounded color="#000" />,
            link: '/software',
            child: null,
          },
          {
            title: 'FAQ',
            icon: <IconHelpHexagon color="#000" />,
            link: '/faq',
            child: null,
          },
          // {
          //   title: 'Agronomist',
          //   icon: 'IconHome2',
          //   child: [
          //     {
          //       title: 'Artikel',
          //       link: '/about',
          //     },
          //   ],
          // },
        ]}
      />

      {/* content */}
      <div className="content">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  ),
});
