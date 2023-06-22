import React, { useState, useReducer } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "../slice/counterSlice";
import { insertData } from "../slice/userSlice";
import axios from "axios";

const initialState = {
  uname: "",
  email: "",
  password: "",
  country: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "inputHandler": {
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    }
    case "inputEmptyHandler": {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};

function UserFrom() {
  const userInfo = useSelector((state) => state.user.value);
  const [state, inputDispatch] = useReducer(reducer, initialState);
  const dispatch = useDispatch();

  const options = [
    { value: "", text: "Choose your country" },
    { value: "Australia", text: "Australia" },
    { value: "Bangladesh", text: "Bangladesh" },
    { value: "Colombia", text: "Colombia" },
    { value: "Denmark", text: "Denmark" },
    { value: "Spain", text: "Spain" },
    { value: "Germany", text: "Germany" },
  ];

  const [selected, setSelected] = useState(options[0].value);

  const handleSubmit = async () => {
    await axios.post("https://userfrom-api.vercel.app/api/v1/frontend/user/store", {
      ...state,
    });
    dispatch(increment());
    inputDispatch({
      type: "inputEmptyHandler",
    });
    setSelected("");
  };

  const handleInputChange = (e) => {
    inputDispatch({
      type: "inputHandler",
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });
    setSelected(e.target.value);
  };

  const handleUpdate = async () => {
    const objKey = Object.keys(state);

    const userObj = objKey.reduce(
      (initialObj, key, index) => {
        initialObj[key] = 10;
        if (state[key] === "") {
          initialObj[key] = userInfo[key];
        } else {
          initialObj[key] = state[key];
        }
        return initialObj;
      },
      { id: userInfo._id }
    );

    await axios.post("https://userfrom-api.vercel.app/api/v1/frontend/user/update", {
      ...userObj,
    });
    dispatch(increment());
    dispatch(insertData({}));
    inputDispatch({
      type: "inputEmptyHandler",
    });
    setSelected("");
  };

  return (
    <Card>
      <Card.Header>User From</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="your name"
                onChange={handleInputChange}
                name="uname"
                value={
                  state.uname === ""
                    ? "email" in userInfo
                      ? userInfo.uname
                      : ""
                    : state.uname
                }
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                onChange={handleInputChange}
                name="email"
                value={
                  state.email === ""
                    ? "email" in userInfo
                      ? userInfo.email
                      : ""
                    : state.email
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="v$2.B@*1"
                onChange={handleInputChange}
                name="password"
                value={
                  state.password === ""
                    ? "email" in userInfo
                      ? userInfo.password
                      : ""
                    : state.password
                }
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Country</Form.Label>

              <Form.Select
                onChange={handleInputChange}
                value={
                  state.country === ""
                    ? "email" in userInfo
                      ? userInfo.country
                      : selected
                    : state.country
                }
                name="country"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {"email" in userInfo ? (
          <Button
            as="input"
            type="submit"
            onClick={handleUpdate}
            value="Update"
          />
        ) : (
          <Button
            as="input"
            type="submit"
            onClick={handleSubmit}
            value="Submit"
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default UserFrom;
