import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const PostImageStyles = styled.div`
  img {
    border-radius: inherit;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PostImage = ({ className = "", url = "", alt = "", to = null }) => {
  if (to)
    return (
      <NavLink to={to} style={{ display: "block" }}>
        <PostImageStyles className={`post-image ${className}`}>
          <img src={url} alt={alt} loading="lazy" />
        </PostImageStyles>
      </NavLink>
    );
  return (
    <PostImageStyles className={`post-image ${className}`}>
      <img src={url} alt={alt} loading="lazy" />
    </PostImageStyles>
  );
};

export default PostImage;
