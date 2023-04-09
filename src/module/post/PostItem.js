import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import formatDate from "../../utils/formatDate";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 20px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;

const PostItem = ({ data }) => {
  return (
    <PostItemStyles>
      <PostImage url={data?.image} alt="" to={`/${data?.slug}`}></PostImage>
      <PostCategory
        className="post-category"
        to={`/category/${data?.category?.slug}`}
      >
        {data?.category?.name}
      </PostCategory>
      <PostTitle className="post-title" to={`/${data?.slug}`}>
        {data?.title}
      </PostTitle>
      <PostMeta
        date={formatDate(data?.createdAt?.seconds)}
        authorName={data?.user?.fullname}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
