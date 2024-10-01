import React from 'react';
import { IconHome2, IconCategory2, IconUsers, IconBell } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import avatar from '../assets/icon/avatar.jpg';

interface HeaderProps {
  menu: unknown;
}

interface ItemChildProps {
  link: string;
  title: string;
}

const header: React.FC<HeaderProps> = ({ menu }) => {
  return (
    <div className="sticky-top noprint">
      {/* header */}
      <header
        className="navbar navbar-expand-md navbar-dark sticky-top d-print-none"
        data-bs-theme="dark"
      >
        <div className="container">
          {/* leftside */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="/">
              <img
                src="/public/static/logo-small2.svg"
                width="32"
                height="32"
                alt="Tabler"
                className="navbar-brand-image"
              />
            </a>
          </h1>

          {/* rightside */}
          <div className="navbar-nav flex-row order-md-last">
            {/* notifikasi */}
            <div className="nav-item Navbar_nav-item dropdown d-none d-md-flex me-3">
              <a
                className="nav-link Navbar_nav-link px-0"
                data-bs-toggle="dropdown"
                aria-label="Show notifications"
              >
                <IconBell size={20} color={'#fff'} />
                <span className="badge bg-red"></span>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-card">
                <div className="card">
                  <div className="card-body">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </div>
                </div>
              </div>
            </div>

            {/* profile */}
            <div className="nav-item Navbar_nav-item dropdown">
              <a
                href="#user"
                className="nav-link Navbar_nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                <img src={avatar} className="avatar Navbar_avatar avatar-sm" alt="users" />
                <div className="d-none d-xl-block ps-2">
                  <div className="username">
                    <strong>Nama</strong>
                  </div>
                  <div className="mt-1 small">Agronomist</div>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                {/* <Link to="/password" className="dropdown-item">
                    Ubah Password
                  </Link> */}
                <a
                  href="#handleLogout"
                  onClick={() => console.log('adsf')}
                  className="dropdown-item"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* menu */}
      <div className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar navbar-light">
            <div className="container">
              <ul className="navbar-nav">
                {Array.isArray(menu)
                  ? menu.map((item) => {
                      if (item.child) {
                        return (
                          <li className="nav-item dropdown">
                            <a
                              className="nav-link dropdown-toggle"
                              href="#navbar-extra"
                              data-bs-toggle="dropdown"
                              data-bs-auto-close="outside"
                              role="button"
                              aria-expanded="false"
                            >
                              <span className="nav-link-icon Navbar_icon d-md-none d-lg-inline-block">
                                <IconCategory2 color="#777" />
                              </span>
                              <span className="nav-link-title Navbar_title">{item.title}</span>
                            </a>
                            <div className="dropdown-menu">
                              <div className="dropdown-menu-columns">
                                <div className="dropdown-menu-column">
                                  {item.child.map((itemChild: ItemChildProps) => (
                                    <div className="dropend">
                                      <Link
                                        to={itemChild.link}
                                        className="dropdown-item dropdown-toggle"
                                        data-bs-auto-close="outside"
                                        role="button"
                                        aria-expanded="false"
                                      >
                                        {itemChild.title}
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      }

                      return (
                        <li className="nav-item active">
                          <Link
                            to={item.link}
                            className="[&.active]:font-bold nav-link Navbar_nav-link"
                          >
                            <span className="nav-link-icon Navbar_icon d-md-none d-lg-inline-block">
                              {item.icon || <IconHome2 color="#777" />}
                            </span>
                            <span className="nav-link-title Navbar_title">{item.title}</span>
                          </Link>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default header;
