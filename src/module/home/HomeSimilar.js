import React from "react";
import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostItem from "../post/PostItem";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useEffect } from "react";
import { useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 40px;
    align-items: start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;

const HomeSimilar = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(colRef, where("status", "==", 1));
    onSnapshot(queries, (snapshot) => {
      let results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
    });
  }, []);
  if (posts.length <= 0) return null;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Bài viết liên quan</Heading>
        <div className="similar-post">
          <Swiper
            spaceBetween={30}
            slidesPerView={2}
            modules={[Navigation]}
            loop={true}
            navigation
            breakpoints={{
              // when window width is >= 640px
              1440: {
                slidesPerView: 4,
              },
              970: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 2,
              },
              720: {
                slidesPerView: 2,
              },
            }}
          >
            {posts.map((item) => (
              <SwiperSlide key={item.id}>
                <PostItem data={item}></PostItem>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeSimilar;
