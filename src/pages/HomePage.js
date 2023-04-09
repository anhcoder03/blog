import React from "react";
import styled from "styled-components";
import HomeBanner from "../module/home/HomeBanner";
import Layout from "../components/layout/Layout";
import HomeFeature from "../module/home/HomeFeature";
import HomeNewest from "../module/home/HomeNewest";
import HomeSimilar from "../module/home/HomeSimilar";

const HomePageStyles = styled.div``;

const HomePage = () => {
  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
        <HomeSimilar></HomeSimilar>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
