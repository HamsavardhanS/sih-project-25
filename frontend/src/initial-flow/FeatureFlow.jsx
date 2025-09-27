// FeatureShowcase.jsx
import React, { useState, useRef, useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import gsap from "gsap";

const FeatureShowcase = ({ images, features }) => {
  const [index, setIndex] = useState(0);
  const imgRef = useRef(null);

  const showNextImage = () => {
    
    gsap.to(imgRef.current, {
      opacity: 0,
      x: -100,
      duration: 0.5,
      onComplete: () => {
        // Update image index
        setIndex((prev) => (prev + 1) % images.length);

        // Animate new image in
        gsap.fromTo(
          imgRef.current,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 0.5 }
        );
      },
    });
  };

  // Initial load animation
  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "grey.100",
        p: 4,
      }}
    >
      {/* Clickable Image Viewer */}
      <Box sx={{ mb: 4 }}>
        <Box
          component="img"
          ref={imgRef}
          src={images[index]}
          alt={`slide-${index}`}
          onClick={showNextImage} // 👈 Image itself is clickable
          sx={{
            width: 1000,
            height: 550,
            objectFit: "cover",
            borderRadius: 3,
            boxShadow: 3,
            cursor: "pointer", // shows hand cursor
          }}
        />
      </Box>

      {/* Features list */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          textAlign: "center",
        }}
      >
        {features.map((feature, i) => (
          <Card
            key={i}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="600">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default FeatureShowcase;
