import React from "react";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState } from "react";
import Heading from "../components/layout/Heading";
import PostItem from "../module/post/PostItem";

const CategoryPageStyles = styled.div`
  padding-bottom: 100px;
`;

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const docRef = query(
        collection(db, "posts"),
        where("category.slug", "==", slug),
        where("status", "==", 1)
      );
      onSnapshot(docRef, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPosts(results);
      });
    }
    fetchData();
  }, [slug]);
  console.log(posts);
  return (
    <CategoryPageStyles>
      <Layout>
        <div className="container">
          <Heading className="pt-10">Danh mục: {slug}</Heading>
          <div className="grid-layout grid-layout--primary">
            {posts.map((item) => (
              <PostItem key={item.id} data={item}></PostItem>
            ))}
          </div>
        </div>
      </Layout>
    </CategoryPageStyles>
  );
};

export default CategoryPage;
