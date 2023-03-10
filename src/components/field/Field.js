import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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
Field.propTypes = {
  children: PropTypes.node,
};

export default Field;
