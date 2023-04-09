import React from "react";
import DashboardHeading from "../dashboard/DashboardHeading";
import UserTable from "./UserTable";
import { Button } from "../../components/button";
import { useAuth } from "../../contexts/auth-context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserManage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const handleNavigateToAddUser = () => {
    if (userInfo.uid !== "VLbknqv6O2bGeTx1lIHAhwAZ3Aq2") {
      toast.error("Bạn không có quyền thực hiện thao tác này!");
      return;
    }
    navigate("/manage/add-user");
  };
  return (
    <div>
      <DashboardHeading title="Users" desc="Manage your user">
        <Button kind="ghost" height="60px" onClick={handleNavigateToAddUser}>
          Create User
        </Button>
      </DashboardHeading>
      <div className="mb-10 flex justify-end">
        <input
          type="text"
          placeholder="Search user..."
          className="py-4 px-5 border border-gray-300 rounded-lg"
          // onChange={handleInputFilter}
        />
      </div>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;
