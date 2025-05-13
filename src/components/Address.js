import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "../style/address.scss";
import { useSelector } from "react-redux";
import Payment from "./Payment";
import axios from "axios";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  street: Yup.string()
    .min(5, "Street address must be at least 5 characters")
    .required("Street address is required"),
  city: Yup.string()
    .min(2, "City name must be at least 2 characters")
    .required("City is required"),
  state: Yup.string()
    .min(2, "State name must be at least 2 characters")
    .required("State is required"),
  zipCode: Yup.string()
    .matches(/^[0-9]{6}$/, "PIN code must be 6 digits")
    .required("PIN code is required"),
  isDefault: Yup.boolean(),
});

const Address = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total, Allitems } = useSelector((state) => state.mainCart);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  console.log("allitems", Allitems);
  console.log("cart", cart);
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/addresses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAddresses(response.data.addresses);
      const defaultAddress = response.data.addresses.find(
        (addr) => addr.isDefault
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  const initialValues = {
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false,
  };

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEditing && editingAddress) {
          await axios.put(
            `http://localhost:5000/api/addresses/${editingAddress._id}`,
            values,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          toast.success("Address updated successfully");
        } else {
          await axios.post("http://localhost:5000/api/addresses", values, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          toast.success("Address added successfully");
        }
        setShowPayment(true);
        await fetchAddresses();
        // setIsEditing(false);
        // setIsAddingNew(false);
        // setEditingAddress(null);
        // resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save address");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsEditing(true);
    setIsAddingNew(false);
    resetForm({
      values: {
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      },
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setIsEditing(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAddingNew(false);
    setShowPayment(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/addresses/${addressId}/set-default`,
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
      await axios.delete(`http://localhost:5000/api/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchAddresses();
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setShowPayment(true);
  };

  if (showPayment) {
    const address = {
      street: values.street ? values.street : selectedAddress.street,
      city: values.city ? values.city : selectedAddress.city,
      state: values.state ? values.state : selectedAddress.state,
      zipCode: values.zipCode ? values.zipCode : selectedAddress.zipCode,
    };
    return (
      <Payment
        cartItems={cart}
        totalAmount={total}
        deliveryAddress={address}
        onBack={() => setShowPayment(false)}
      />
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

  return (
    <div className="address-container">
      <div className="address-box">
        <div className="address-header">
          <h2>Delivery Address</h2>
          <p>Please select or add a delivery address</p>
        </div>

        {!isEditing && !isAddingNew && (
          <div className="address-list">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`address-item ${
                  selectedAddress?._id === address._id ? "selected" : ""
                }`}
                onClick={() => setSelectedAddress(address)}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(address);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address._id);
                      }}
                    >
                      Delete
                    </button>
                    {!address.isDefault && (
                      <button
                        className="set-default-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(address._id);
                        }}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button className="add-new-btn" onClick={handleAddNew}>
              + Add New Address
            </button>
          </div>
        )}

        {(isEditing || isAddingNew) && (
          <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your full name"
                className={errors.name && touched.name ? "error" : ""}
              />
              {errors.name && touched.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your 10-digit phone number"
                className={errors.phone && touched.phone ? "error" : ""}
              />
              {errors.phone && touched.phone && (
                <div className="error-message">{errors.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                Street Address <span className="required">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={values.street}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your street address"
                className={errors.street && touched.street ? "error" : ""}
              />
              {errors.street && touched.street && (
                <div className="error-message">{errors.street}</div>
              )}
            </div>

            <div className="address-grid">
              <div className="form-group">
                <label>
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your city"
                  className={errors.city && touched.city ? "error" : ""}
                />
                {errors.city && touched.city && (
                  <div className="error-message">{errors.city}</div>
                )}
              </div>

              <div className="form-group">
                <label>
                  State <span className="required">*</span>
                </label>
                <select
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.state && touched.state ? "error" : ""}
                >
                  <option value="">Select your state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && touched.state && (
                  <div className="error-message">{errors.state}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                PIN Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={values.zipCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your 6-digit PIN code"
                className={errors.zipCode && touched.zipCode ? "error" : ""}
              />
              {errors.zipCode && touched.zipCode && (
                <div className="error-message">{errors.zipCode}</div>
              )}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={values.isDefault}
                onChange={handleChange}
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
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : (isEditing || isAddingNew) && "Continue to Payment"}
              </button>
            </div>
          </form>
        )}

        {!isEditing && !isAddingNew && selectedAddress && (
          <button className="continue-btn" onClick={handleContinue}>
            Continue to Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default Address;
