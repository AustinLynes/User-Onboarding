import React, { useState, useEffect } from "react";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const OnboardingForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  function createUser(user) {
    return (
      <div key={user.id}>
        <p>{user.name}</p>
        <p>{user.gender}</p>
        <p>{user.role}</p>
        <p>{user.phone}</p>
        <p>{user.address}</p>
        <p>{user.email}</p>
      </div>
    );
  }
  return (
    <div className='wrapper'>
      <Form className="onboarding-form">
        <h1 className="title">Welcome! </h1>
        {touched.name && errors.name && <p className="error">{errors.name}</p>}
        <Field
          className="field"
          type="text"
          name="name"
          placeholder="please enter your name"
        />
         {touched.address && errors.address && (
          <p className="error">{errors.address}</p>
        )}
        <Field
          className="field"
          type="text"
          name="address"
          placeholder="please enter your address"
        />
         {touched.phone && errors.phone && (
          <p className="error">{errors.phone}</p>
        )}
        <Field
          className="field"
          type=""
          name="phone"
          placeholder="please enter your Phone Number"
        />
         {touched.gender && errors.gender && (
          <p className="error">{errors.gender}</p>
        )}
        <Field component="select" className="drop" name="gender">
          <option value="">Please choose gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer-not">Prefer not to Say</option>
        </Field>
        <Field component="select" className="drop" name="role">
          <option value="">Please choose role</option>
          <option value="front-end" name="front-end">
            Front End
          </option>
          <option value="front-end" name="back-end">
            Back End
          </option>
          <option value="front-end" name="ui-ux">
            UI/UX
          </option>
        </Field>
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <Field
          className="field"
          type="email"
          name="email"
          placeholder="please enter your email"
        />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}
        <Field
          className="field"
          type="password"
          name="password"
          placeholder="please create a password"
        />
        {touched.terms && errors.terms && (
          <p className="error">{errors.terms}</p>
        )}
        <label className="container">
          i accept the terms of service
          <Field
            classname="terms"
            type="checkbox"
            name="terms"
            checked={values.tos}
          />
          <span className="checkmark" />
        </label>
        <Field className="submit-btn" type="submit" name="addUser" />
      </Form>
      {users.map(user => {
        return createUser(user);
      })}
    </div>
  );
};
const OnboardingHOC = withFormik({
  mapPropsToValues({
    name,
    email,
    password,
    phone,
    address,
    role,
    gender,
    terms
  }) {
    return {
      name: name || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
      gender: gender || "please chose a gender",
      role: role || "Please Choose a role",
      password: password || "",
      terms: terms || false
    };
  },
  //=======VALIDATION SCHEMA==========
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required("name is required to continue")
      .min(3),
    address: Yup.string()
      .required("address is required to continue")
      .min(15),
    phone: Yup.string()
      .required("phone number is required to continue")
      .min(10),
    gender: Yup.string()
      .required("gender is required to continue"),
    email: Yup.string()
      .email()
      .required("email is required to continue"),
    password: Yup.string()
      .min(6)
      .max(15)
      .required("password should be between 6 and 15 characters"),
    terms: Yup.bool().required("you MUST agree to continue!")
  }),
  //====END VALIDATION SCHEMA==========
  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log(res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err));
  }
})(OnboardingForm);

export default OnboardingHOC;
