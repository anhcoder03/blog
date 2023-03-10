import React from "react";
import styled from "styled-components";
import { LoadingSpinner } from "../loading";
import PropTypes from "prop-types";

const ButtonStyles = styled.button`
  cursor: pointer;
  padding: 0 25px;
  line-height: 1;
  height: ${(props) => props.height || "66px"};
  color: #fff;
  width: ${(props) => props.width};
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  display: block;
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const Button = ({
  type = "button",
  onClick = () => {},
  children,
  ...props
}) => {
  const { isLoading = false } = props;
  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
  return (
    <ButtonStyles type={type} onClick={onClick} {...props}>
      {child}
    </ButtonStyles>
  );
};
Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]).isRequired,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
export default Button;
