'use client'
import NextTopLoader from "nextjs-toploader";
import React from "react";

function NextLoader() {
  return (
    <NextTopLoader
     color={"#1A1A38"}
      initialPosition={0.08}
      crawlSpeed={200}
      height={4}
      crawl={true}
      showSpinner={false}
      zIndex={1600}
    />
  );
}

export default NextLoader;
