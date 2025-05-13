"use client";

import React from "react";

const MapView = ({ location }) => {
  const encodedLocation = encodeURIComponent(location);
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  const mapsLinkUrl = `https://www.google.com/maps?q=${encodedLocation}`;

  return (
    <div style={{ position: "relative", width: "100%", height: "300px" }}>
      <a
        href={mapsLinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 2,
          cursor: "pointer",
        }}
      />
      <iframe
        src={mapsEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapView;
