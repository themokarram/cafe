import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "../style/Profile.scss";

const Profile = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  

  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchOrders();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/api/addresses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAddresses(response.data.addresses);
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_API}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response.data", response.data);
      if (response.status === 200) {
        setOrders(response.data.orders || response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const addressData = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        zipCode: formData.get("zipCode"),
        isDefault: formData.get("isDefault") === "on",
      };

      if (isEditing && editingAddress) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_API}/api/addresses/${editingAddress._id}`,
          addressData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Address updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_SERVER_API}/api/addresses`,
          addressData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Address added successfully");
      }
      await fetchAddresses();
      setIsEditing(false);
      setIsAddingNew(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsEditing(true);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setIsEditing(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAddingNew(false);
    setEditingAddress(null);
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_SERVER_API}/api/addresses/${addressId}/set-default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchAddresses();
      toast.success("Default address updated");
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_API}/api/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await fetchAddresses();
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-card">
            <p className="text-center">Please log in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Profile Information</h2>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut />
              Logout
            </button>
          </div>

          <div className="profile-info">
            <div className="info-group">
              <div className="label">Name</div>
              <div className="value">{user.name}</div>
            </div>

            <div className="info-group">
              <div className="label">Email</div>
              <div className="value">{user.email}</div>
            </div>

            <div className="info-group">
              <div className="label">Phone</div>
              <div className="value">{user.phone || "Not provided"}</div>
            </div>
          </div>

          <div className="address-section">
            <div className="address-header">
              <div className="label">Delivery Addresses</div>
              {!isEditing && !isAddingNew && (
                <button className="add-btn" onClick={handleAddNew}>
                  <FiPlus /> Add New Address
                </button>
              )}
            </div>

            {isEditing || isAddingNew ? (
              <form onSubmit={handleAddressUpdate} className="address-form">
                <div className="form-group">
                  <label>
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingAddress?.name || ""}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingAddress?.phone || ""}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Street Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    defaultValue={editingAddress?.street || ""}
                    required
                  />
                </div>

                <div className="address-grid">
                  <div className="form-group">
                    <label>
                      City <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      defaultValue={editingAddress?.city || ""}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      State <span className="required">*</span>
                    </label>
                    <select
                      name="state"
                      defaultValue={editingAddress?.state || ""}
                      required
                    >
                      <option value="">Select your state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    PIN Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    defaultValue={editingAddress?.zipCode || ""}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    defaultChecked={editingAddress?.isDefault || false}
                  />
                  <label htmlFor="isDefault">Set as default address</label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Saving..."
                      : isEditing
                      ? "Update Address"
                      : "Save Address"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="address-list">
                {addresses.map((address) => (
                  <div key={address._id} className="address-item">
                    <div className="address-content">
                      <div className="address-info">
                        <h3>{address.name}</h3>
                        <p>{address.phone}</p>
                        <p>
                          {address.street}, {address.city}, {address.state} -{" "}
                          {address.zipCode}
                        </p>
                        {address.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                      <div className="address-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(address)}
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(address._id)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                        {!address.isDefault && (
                          <button
                            className="set-default-btn"
                            onClick={() => handleSetDefault(address._id)}
                          >
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <div className="no-addresses">
                    No addresses found. Add your first delivery address.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="orders-card">
          <div className="orders-header">
            <h2>Order History</h2>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">No orders found</div>
          ) : (
            <div className="orders-list">
              {orders.map((order, key) => {
                return (
                  <div key={key} className="order-item">
                    <div className="order-header">
                      <div className="order-info">
                        <div className="order-id">
                          Order #{order._id?.slice(-6) || "N/A"}
                        </div>
                        <div className="order-date">
                          {order.createdAt
                            ? `${String(
                                new Date(order.createdAt).getDate()
                              ).padStart(2, "0")}/${String(
                                new Date(order.createdAt).getMonth() + 1
                              ).padStart(2, "0")}/${new Date(
                                order.createdAt
                              ).getFullYear()}`
                            : "N/A"}
                        </div>
                      </div>
                      <div
                        className={`order-status ${order.status || "pending"}`}
                      >
                        {(order.status || "pending").charAt(0).toUpperCase() +
                          (order.status || "pending").slice(1)}
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={item.id} className="item">
                          <span>
                            {item.quantity}x {item.menuItem}
                          </span>
                          <span>₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-total">
                      <span>Total Amount</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
