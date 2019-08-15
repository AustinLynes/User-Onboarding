import React, { useState, useEffect } from "react";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';

const OnboardingForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  function createUser(user) {
    return(
        <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    )

  }
  return (
    <div>
      <Form>
        {touched.name && errors.name && <p>{errors.name}</p>}
        <Field type="text" name="name" placeholder="jon doe" />
        {touched.email && errors.email && <p>{errors.email}</p>}
        <Field type="email" name="email" placeholder="email" />
        {touched.password && errors.password && <p>{errors.password}</p>}
        <Field type="password" name="password" placeholder="abc123" />
        {touched.terms && errors.terms && <p>{errors.terms}</p>}
        <label>
          i accept the terms of service
          <Field type="checkbox" name="terms" checked={values.tos} />
        </label>
        <Field type="submit" name="addUser" />
      </Form>
      {users.map(user => {
          return createUser(user);
      })}
    </div>
  );
};
const OnboardingHOC = withFormik({
  mapPropsToValues({ name, email, password, terms }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      terms: terms || false
    };
  },
  //=======VALIDATION SCHEMA==========
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required("name is required to continue")
      .min(3),
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
  handleSubmit(values, {setStatus, resetForm}) {
    axios.post("https://reqres.in/api/users", values)
    .then(res=>{
        console.log(res);
        setStatus(res.data);
        resetForm();
    })
    .catch(err=>console.log(err));
  }
})(OnboardingForm);

export default OnboardingHOC;
