import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CustomerDashboard.css";
import Sidebar from "../components/Sidebar";

/* =========================================================
   ICONS
   ========================================================= */

const PlusIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TruckIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h11v11H3V6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 10h4l3 3v4h-7v-7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle
      cx="7"
      cy="19"
      r="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle
      cx="18"
      cy="19"
      r="2"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const FileIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 3h9l4 4v14H6V3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v5h5M9 13h6M9 17h6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const UserIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="8"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BoxIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M21 8.5 12 4 3 8.5 12 13l9-4.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M3 8.5V17l9 4 9-4V8.5M12 13v8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16v4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="m13.5 6.5 4 4"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const DeleteIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/* =========================================================
   MOVING ITEMS
   ========================================================= */

function MovingItems() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    itemName: "",
    quantity: 1,
    fragile: false,
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");


  /* =======================================================
     AUTH + LOAD DATA
  ======================================================= */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const savedItems = localStorage.getItem("movingItems");

    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch {
        localStorage.removeItem("movingItems");
      }
    }
  }, [navigate]);


  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setError("");
  };


  /* =======================================================
     ADD / UPDATE ITEM
  ======================================================= */

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!formData.category || !formData.itemName.trim()) {
      setError(
        "Please select a category and enter the item name."
      );
      return;
    }

    if (Number(formData.quantity) < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    const itemData = {
      id: editingId || Date.now(),
      category: formData.category,
      itemName: formData.itemName.trim(),
      quantity: Number(formData.quantity),
      fragile: formData.fragile,
      notes: formData.notes.trim(),
    };

    let updatedItems;

    if (editingId) {
      updatedItems = items.map((item) =>
        item.id === editingId ? itemData : item
      );
    } else {
      updatedItems = [...items, itemData];
    }

    setItems(updatedItems);

    localStorage.setItem(
      "movingItems",
      JSON.stringify(updatedItems)
    );

    resetForm();
  };


  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setFormData({
      category: "",
      itemName: "",
      quantity: 1,
      fragile: false,
      notes: "",
    });

    setEditingId(null);
    setError("");
  };


  /* =======================================================
     EDIT ITEM
  ======================================================= */

  const handleEdit = (item) => {
    setFormData({
      category: item.category,
      itemName: item.itemName,
      quantity: item.quantity,
      fragile: item.fragile,
      notes: item.notes || "",
    });

    setEditingId(item.id);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =======================================================
     DELETE ITEM
  ======================================================= */

  const handleDelete = (id) => {
    const updatedItems = items.filter(
      (item) => item.id !== id
    );

    setItems(updatedItems);

    localStorage.setItem(
      "movingItems",
      JSON.stringify(updatedItems)
    );

    if (editingId === id) {
      resetForm();
    }
  };


  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleContinue = () => {
    if (items.length === 0) {
      setError(
        "Please add at least one item before continuing."
      );
      return;
    }

    const moveRequest =
      JSON.parse(
        localStorage.getItem("moveRequest")
      ) || {};

    const completeMoveRequest = {
      ...moveRequest,
      movingItems: items,
    };

    localStorage.setItem(
      "completeMoveRequest",
      JSON.stringify(completeMoveRequest)
    );

    navigate("/vehicle-selection");
  };


  /* =======================================================
     COUNTS
  ======================================================= */

  const totalQuantity = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const fragileCount = items.filter(
    (item) => item.fragile
  ).length;


  const firstName =
    user?.name?.split(" ")[0] || "Customer";


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="dashboard">

      {/* ==================================================
          COMMON SIDEBAR
          Only Sidebar Logout
      ================================================== */}

      <Sidebar />


      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="main-area">


        {/* ==================================================
            TOPBAR
        ================================================== */}

        <header className="topbar">

          <div className="mobile-brand">
            Move-Home
          </div>


          <div className="topbar-right">

            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>


            <div className="user-info">

              <div className="user-name">
                {user?.name || "Customer"}
              </div>

              <div className="user-role">
                Customer
              </div>

            </div>

            {/* NO TOP-RIGHT LOGOUT */}

          </div>

        </header>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="content">


          {/* ==================================================
              PAGE HEADER
          ================================================== */}

          <div className="content-header">

            <div>

              <div className="page-eyebrow">
                MOVING REQUEST
              </div>

              <h1 className="page-title">
                Add Your Items
              </h1>

              <p className="page-description">
                Tell us what you are moving so we can
                recommend the right vehicle and estimate
                your relocation cost.
              </p>

            </div>


            <button
              className="back-dashboard-btn"
              onClick={() => navigate("/create-move")}
            >
              <BackIcon size={16} />
              Move Details
            </button>

          </div>


          {/* ==================================================
              PROGRESS
          ================================================== */}

          <div className="move-progress-card">

            {/* STEP 1 */}

            <div className="move-step completed">

              <div className="step-number completed-number">
                ✓
              </div>

              <div>

                <strong>
                  Move Details
                </strong>

                <span>
                  Location & date
                </span>

              </div>

            </div>


            <div className="step-line completed-line"></div>


            {/* STEP 2 */}

            <div className="move-step active">

              <div className="step-number">
                2
              </div>

              <div>

                <strong>
                  Items
                </strong>

                <span>
                  Inventory
                </span>

              </div>

            </div>


            <div className="step-line"></div>


            {/* STEP 3 */}

            <div className="move-step">

              <div className="step-number">
                3
              </div>

              <div>

                <strong>
                  Vehicle
                </strong>

                <span>
                  Select vehicle
                </span>

              </div>

            </div>


            <div className="step-line"></div>


            {/* STEP 4 */}

            <div className="move-step">

              <div className="step-number">
                4
              </div>

              <div>

                <strong>
                  Confirm
                </strong>

                <span>
                  Review booking
                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              ITEM FORM CARD
          ================================================== */}

          <div className="move-form-card">


            {/* HEADER */}

            <div className="move-form-header">

              <div className="form-header-icon">
                <BoxIcon size={25} />
              </div>

              <div>

                <h2>
                  Moving Inventory
                </h2>

                <p>
                  Add the items you want to move.
                  You can edit or remove them anytime.
                </p>

              </div>

            </div>


            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleAddItem}
              className="move-form-body"
            >

              <div className="items-form-grid">


                {/* CATEGORY */}

                <div className="form-field">

                  <label>
                    Category
                    <span>*</span>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Furniture">
                      Furniture
                    </option>

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Kitchen">
                      Kitchen
                    </option>

                    <option value="Bedroom">
                      Bedroom
                    </option>

                    <option value="Appliances">
                      Appliances
                    </option>

                    <option value="Clothing">
                      Clothing
                    </option>

                    <option value="Books">
                      Books
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* ITEM NAME */}

                <div className="form-field">

                  <label>
                    Item Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="e.g. Sofa, TV, Bed..."
                  />

                </div>


                {/* QUANTITY */}

                <div className="form-field">

                  <label>
                    Quantity
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    max="100"
                  />

                </div>

              </div>


              {/* ==================================================
                  SECOND ROW
              ================================================== */}

              <div className="items-second-row">


                {/* FRAGILE */}

                <label className="fragile-checkbox">

                  <input
                    type="checkbox"
                    name="fragile"
                    checked={formData.fragile}
                    onChange={handleChange}
                  />

                  <span className="custom-checkbox"></span>

                  <div>

                    <strong>
                      This item is fragile
                    </strong>

                    <small>
                      Requires extra care during transportation
                    </small>

                  </div>

                </label>


                {/* NOTES */}

                <div className="form-field notes-field">

                  <label>
                    Notes
                  </label>

                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions..."
                  />

                </div>

              </div>


              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="form-error">

                  <span>
                    ⚠
                  </span>

                  <div>
                    {error}
                  </div>

                </div>

              )}


              {/* ==================================================
                  ADD BUTTON
              ================================================== */}

              <div className="item-form-actions">

                {editingId && (

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>

                )}


                <button
                  type="submit"
                  className="add-item-btn"
                >

                  <PlusIcon size={17} />

                  {editingId
                    ? "Update Item"
                    : "Add Item"
                  }

                </button>

              </div>

            </form>


            {/* ==================================================
                ITEMS LIST
            ================================================== */}

            <div className="items-list-section">

              <div className="items-list-header">

                <div>

                  <h3>
                    Your Items
                  </h3>

                  <p>
                    {items.length === 0
                      ? "No items added yet."
                      : `${items.length} item type${
                          items.length > 1 ? "s" : ""
                        } added`
                    }
                  </p>

                </div>


                <div className="items-count-badge">
                  {totalQuantity} items
                </div>

              </div>


              {items.length === 0 ? (

                <div className="empty-items">

                  <div className="empty-items-icon">
                    <BoxIcon size={30} />
                  </div>

                  <h3>
                    No items added yet
                  </h3>

                  <p>
                    Add your first item using the form above.
                  </p>

                </div>

              ) : (

                <div className="items-list">

                  {items.map((item, index) => (

                    <div
                      className="item-row"
                      key={item.id}
                    >

                      <div className="item-number">
                        {index + 1}
                      </div>


                      <div className="item-icon-box">
                        <BoxIcon size={21} />
                      </div>


                      <div className="item-main-info">

                        <div className="item-title-row">

                          <strong>
                            {item.itemName}
                          </strong>

                          {item.fragile && (

                            <span className="fragile-badge">
                              Fragile
                            </span>

                          )}

                        </div>


                        <span className="item-category">
                          {item.category}
                        </span>


                        {item.notes && (

                          <p className="item-notes">
                            {item.notes}
                          </p>

                        )}

                      </div>


                      <div className="item-quantity">

                        <span>
                          Quantity
                        </span>

                        <strong>
                          {item.quantity}
                        </strong>

                      </div>


                      <div className="item-actions">

                        <button
                          type="button"
                          className="item-edit-btn"
                          onClick={() => handleEdit(item)}
                          title="Edit item"
                        >
                          <EditIcon size={16} />
                        </button>


                        <button
                          type="button"
                          className="item-delete-btn"
                          onClick={() => handleDelete(item.id)}
                          title="Delete item"
                        >
                          <DeleteIcon size={16} />
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="items-summary">


              <div className="summary-box">

                <span>
                  Item Types
                </span>

                <strong>
                  {items.length}
                </strong>

              </div>


              <div className="summary-box">

                <span>
                  Total Quantity
                </span>

                <strong>
                  {totalQuantity}
                </strong>

              </div>


              <div className="summary-box">

                <span>
                  Fragile Items
                </span>

                <strong>
                  {fragileCount}
                </strong>

              </div>

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="move-form-footer">

              <div className="form-footer-info">

                <div className="info-icon">
                  💡
                </div>

                <div>

                  <strong>
                    Why do we need your inventory?
                  </strong>

                  <p>
                    Your item details help us recommend
                    the appropriate vehicle and calculate
                    a more accurate relocation estimate.
                  </p>

                </div>

              </div>


              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/create-move")}
                >
                  <BackIcon size={16} />
                  Back
                </button>


                <button
                  type="button"
                  className="continue-btn"
                  onClick={handleContinue}
                >
                  Continue
                  <ArrowIcon size={17} />
                </button>

              </div>

            </div>

          </div>


          {/* ==================================================
              HELP
          ================================================== */}

          <div className="page-help-card">

            <div className="help-icon">
              ✓
            </div>

            <div>

              <strong>
                Almost there!
              </strong>

              <p>
                After adding your items, we'll help you
                choose the right vehicle for your move.
              </p>

            </div>

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="footer">
            © 2026 Move-Home · Digital Relocation Management
          </div>


        </main>

      </div>

    </div>
  );
}

export default MovingItems;