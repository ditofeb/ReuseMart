import React, { useState, useEffect } from "react";
import { Form, Dropdown, Modal, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import api from "../../../api/api.js";
import ProfileModal from "../Pembeli/profileModal.jsx";
import "./navbarPembeli.css";

const NavbarOrganisasi = ( {searchQuery, onSearchChange} ) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [groupedCats, setGroupedCats] = useState([]);
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [showMega, setShowMega] = useState(false);

  let userName = "Organisasi";
  try {
    const prof = JSON.parse(localStorage.getItem("profile") || "{}");
    const fn = prof.first_name ?? prof.firstName ?? prof.name;
    const ln = prof.last_name ?? prof.lastName;
    userName = fn && ln ? `${fn} ${ln}` : fn || "Organisasi";
  } catch {}

  useEffect(() => {
    api
      .get("kategori")
      .then(({ data }) => setGroupedCats(data))
      .catch(console.error);
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchTerm(q);
    navigate(`${pathname}?q=${encodeURIComponent(q)}`);
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openProfileModal = () => setShowProfileModal(true);
  const closeProfileModal = () => setShowProfileModal(false);

  return (
    <>
      <div className="py-3 navbar-pembeli">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-between">
            {/* Logo */}
            <div className="col-auto logo-container">
              <Link
                to="/organisasiLP"
                className="d-flex align-items-center text-decoration-none logo-link"
              >
                <img
                  src="/logo_ReuseMart.png"
                  alt="ReuseMart"
                  className="logo-img"
                />
                <span className="ms-2 fs-4 fw-bold logo-text">ReuseMart</span>
              </Link>
            </div>

            {/* Live Search */}
            <div className="col-md-6 px-2">
              <Form className="d-flex">
            <Form.Control
              type="text"
              autoComplete="off"
                placeholder="Mau cari apa hari ini?"
              className="search-input"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </Form>
            </div>

            {/* Actions */}
            <div className="col-auto d-flex align-items-center gap-4 action-group pe-5">
              {/* Mega-menu */}
              <div
                className="mega-dropdown"
                onMouseEnter={() => setShowMega(true)}
                onMouseLeave={() => setShowMega(false)}
              >
                <button className="category-toggle">Kategori</button>
                {showMega && (
                  <div className="mega-menu">
                    <div className="mega-menu-sidebar">
                      {groupedCats.map((cat, idx) => (
                        <div
                          key={cat.nama_kategori}
                          className={`mega-menu-item ${
                            idx === activeCatIdx ? "active" : ""
                          }`}
                          onMouseEnter={() => setActiveCatIdx(idx)}
                        >
                          {cat.nama_kategori}
                        </div>
                      ))}
                    </div>
                    <div className="mega-menu-content">
                      {groupedCats[activeCatIdx]?.sub_kategori.map((sub) => (
                        <Link
                          to={`/kategori/${sub.id}`}
                          key={sub.id}
                          className="mega-menu-link"
                        >
                          {sub.nama}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <Dropdown>
                <Dropdown.Toggle variant="light" className="profile-toggle">
                  <FiUser className="me-2 fs-3" />
                  <span className="fw-bold">{userName}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/alamat">
                    Atur Alamat
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/request-donasi">
                    Request Donasi
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={openLogoutModal}>
                    Keluar
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation */}
      <Modal show={showLogoutModal} onHide={closeLogoutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin keluar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Keluar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Modal */}
      <ProfileModal show={showProfileModal} onHide={closeProfileModal} />
    </>
  );
};

export default NavbarOrganisasi;
