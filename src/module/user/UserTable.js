import React from "react";
import { useState } from "react";
import { Table } from "../../components/table";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import LabelStatus from "../../components/label/LabelStatus";
import { useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import formatDate from "../../utils/formatDate";
import { userRole, userStatus } from "../../utils/constants";
import Swal from "sweetalert2";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const colRef = collection(db, "users");
      onSnapshot(colRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setUserList(results);
      });
    }
    fetchData();
  }, []);

  const handleDeleteCategory = async (userId) => {
    const colRef = doc(db, "users", userId);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // await deleteUser(userId);
        await deleteDoc(colRef);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>info</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((item) => (
              <tr key={item.id}>
                <td title={item.id} className="max-w-[100px] truncate">
                  {item.id}
                </td>
                <td>
                  <div className="flex items-center gap-x-3">
                    <img
                      src={item.photoURL}
                      alt={item?.username}
                      className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p>{item.fullname}</p>
                      <p className="text-sm text-gray-300">
                        {formatDate(item?.createdAt?.seconds)}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <em className="text-gray-400">{item.email}</em>
                </td>
                <td>
                  {item.status === userStatus.ACTIVE && (
                    <LabelStatus type="success">Active</LabelStatus>
                  )}
                  {item.status === userStatus.PENDING && (
                    <LabelStatus type="warning">Pending</LabelStatus>
                  )}
                  {item.status === userStatus.BAN && (
                    <LabelStatus type="danger">Ban</LabelStatus>
                  )}
                </td>
                <td>
                  {item.role === userRole.ADMIN && (
                    <LabelStatus type="admin">Admin</LabelStatus>
                  )}
                  {item.role === userRole.MOD && (
                    <LabelStatus type="warning">Mod</LabelStatus>
                  )}
                  {item.role === userRole.USER && (
                    <LabelStatus type="user">User</LabelStatus>
                  )}
                </td>
                <td>
                  <div className="flex gap-5 text-gray-400">
                    <ActionView></ActionView>
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${item.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteCategory(item.id)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
