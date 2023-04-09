import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/auth-context";
import SignInPage from "../../pages/SignInPage";
import { toast } from "react-toastify";
const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 36px;
      letter-spacing: 1px;
    }
    &-main {
      display: grid;
      grid-template-columns: 250px minmax(0, 1fr);
      padding: 40px 20px;
      gap: 0 40px;
      align-items: start;
    }
  }
  @media screen and (max-width: 1023.98px) {
    width: 100%;
    .dashboard {
      &-main {
        display: block;
      }
    }
  }
`;
const DashboardLayout = ({ children }) => {
  const { userInfo } = useAuth();
  if (!userInfo) {
    toast.warning("Bạn cần đăng nhập để sử dụng tính năng này!");
    return <SignInPage></SignInPage>;
  }
  return (
    <DashboardStyles>
      <DashboardHeader></DashboardHeader>
      <div className="dashboard-main">
        <Sidebar></Sidebar>
        <div className="dashboard-children">
          <Outlet></Outlet>
        </div>
      </div>
    </DashboardStyles>
  );
};

export default DashboardLayout;
