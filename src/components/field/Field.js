import React from "react";
import styled from "styled-components";

const FieldStyles = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
`;

function Field({ children }) {
  return <FieldStyles>{children}</FieldStyles>;
}

export default Field;
