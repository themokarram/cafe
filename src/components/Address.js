import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "../style/address.scss";

const initialValues = {
  name: "",
  phone: "",
  pin: "",
  address: "",
};
const validationSchema = Yup.object({
  name: Yup.string().min(2).max(20).required("enter valid name"),
  phone: Yup.number().min(2).max(11).required("enter valid phone number"),
  pin: Yup.number().max(6).required("enter valid pin code"),
  address: Yup.string().min(2).required("enter valid address"),
});

const Address = () => {
  const navigate = useNavigate();
  // const [values, setValue] = useState({
  //   name: "",
  //   phone: "",
  //   pin: "",
  //   address: "",
  // });

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues,
      validationSchema,
      onsubmit: (values, action) => {
        console.log(values);
        action.resetForm();
        toast.success("form submitted successfully");
      },
    });

  // const handleClick = () => {
  //   if (errors.name && errors.Address && errors.pin && errors.pin) {
  //     toast.error("Fill form correctly!");
  //   } else {
  //     setValue((e) => e.target.value);
  //     console.log(values);
  //     toast.success("form submitted successfully");
  //   }
  // };

  return (
    <div className="add-container">
      <div className="add-box">
        <form className="add-form" onSubmit={handleSubmit}>
          <h4>Delivery Address</h4>
          <div>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Name"
              error={
                errors.name && touched.name ? <div>enter valid name</div> : null
              }
            />
          </div>
          <div>
            <input
              type="number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Mobile Number"
              error={errors.phone && touched.phone ? errors.phone : null}
            />
          </div>
          <div>
            <input
              type="number"
              name="pin"
              value={values.pin}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.pin && touched.pin ? errors.pin : null}
              placeholder="PIN CODE"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.address && touched.address ? errors.address : null}
              placeholder="Address"
            />
          </div>
          <div>
            <button
              type="submit"
              onClick={() =>
                errors.name && errors.Address && errors.pin && errors.pin
                  ? null
                  : navigate("/cart/address/payment")
              }
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;
