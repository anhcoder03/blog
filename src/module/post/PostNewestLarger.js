import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import formatDate from "../../utils/formatDate";
const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 10px;
    }
    @media screen and (max-width: 1023.98px) {
      &-image {
        height: 250px;
      }
    }
  }
`;

const PostNewestLarge = ({ data }) => {
  return (
    <PostNewestLargeStyles>
      <PostImage to={`/${data?.slug}`} url={data.image} alt=""></PostImage>
      <PostCategory className="post-category">
        {data?.category?.name}
      </PostCategory>
      <PostTitle size="big" className="post-title" to={`/${data?.slug}`}>
        {data?.title}
      </PostTitle>
      <PostMeta
        date={formatDate(data?.createdAt?.seconds)}
        authorName={data?.user?.fullname}
      ></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
