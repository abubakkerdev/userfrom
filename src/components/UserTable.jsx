import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import { increment } from "../slice/counterSlice";
import { insertData } from "../slice/userSlice";
import axios from "axios";

function UserTable() {
  const [alluser, setAllUser] = useState([]);
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "get",
      url: "https://userfrom-api.vercel.app/api/v1/frontend/user/show",
    }).then(function (response) {
      setAllUser((data) => [...response.data.success]);
    });
  }, [count]);

  const handleDelete = async (id) => {
    await axios.post("https://userfrom-api.vercel.app/api/v1/frontend/user/destroy", {
      id,
    });
    dispatch(increment());
  };

  const handleEdit = async (id) => {
    const userData = await axios.post(
      "https://userfrom-api.vercel.app/api/v1/frontend/user/edit",
      {
        id,
      }
    );
    dispatch(insertData({ ...userData.data.success }));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Password</th>
          <th>Country</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {alluser.length > 0 ? (
          alluser.map((val, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{val.uname}</td>
              <td>{val.email}</td>
              <td>{val.password}</td>
              <td>{val.country}</td>
              <td>
                <ButtonGroup size="sm">
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleEdit(val._id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete(val._id);
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td>1</td>
            <td colSpan={5}>There was no value.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default UserTable;
