import React from "react";
import { Card } from "antd";
import Watchlist from "./Watchlist";
import Chartdata from "./Chartdata";
function Index() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#EBECEF",
        // display: "flex",
        // alignItems: "center",
      }}
    >
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <h2>Trade Panel</h2>
      </div>

      <div
        style={{
          width: "100%",
          height: "90%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Watchlist />
        <Chartdata />
      </div>
    </div>
  );
}

export default Index;
