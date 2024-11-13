import React, { ReactNode, useEffect, useState } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative", // To layer the background, circle, and children
        overflow: "hidden", // Hide anything that goes out of the circle
      }}
    >
      {/* Background Color Layer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -3, // Set background behind everything
          // backgroundColor: isDarkMode ? "#333" : "#fff", // Background color based on theme
        }}
      />
      {/* Green Circle Layer */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vmin", // Adjust circle size based on viewport size
          height: "80vmin",
          borderRadius: "50%", // Make it a circle
          backgroundColor: "#77bc3f", // Green circle color
          filter: "blur(100px)", // Apply blur effect to the whole circle
          zIndex: -2, // Put the circle behind the content
          // boxShadow: `0 0 30px ${
          //   isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
          // }`, // Adjust box-shadow for dark/light modes
        }}
      />

      {/* Children Layer */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default Layout;
