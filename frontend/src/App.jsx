// import logo from './logo.svg';
// import './App.css';
// import InternshipFlowFull from './initial-flow/InternshipFlowCalc';
// import FeatureFlow from './initial-flow/FeatureFlow';
// import img1 from './images/img1.jpg';
// import img2 from './images/img2.jpg';
// import img3 from './images/img3.jpg';
// import img4 from './images/img4.jpg';
// import img5 from './images/img5.jpg';
// import ProcessFlow from './initial-flow/ProcessFlow';

// function App() {
//   const images = [
//     img1,
//     img2,
//     img4,
//     img5,
//   ];

//   const features = [
//     { title: " Registration ", description: " Using Mobile Number " },
//     { title: " Login ", description: " Using Mobile Number & Password " },
//     { title: " OTP Verification ", description: " Entered Up via OTP alone " },
//     { title: " Other Process ", description: " Lot of Verification Process " },
//   ];

//   return <ProcessFlow/>
//   return <FeatureFlow images={images} features={features} />;
// }

// export default App;
import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import InternshipFlowFull from './initial-flow/InternshipFlowCalc';
import FeatureFlow from './initial-flow/FeatureFlow';
import ProcessFlow from './initial-flow/ProcessFlow';
import img1 from './images/img1.jpg';
import img2 from './images/img2.jpg';
import img3 from './images/img3.jpg';
import img4 from './images/img4.jpg';
import img5 from './images/img5.jpg';
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function App() {
  const [activeTab, setActiveTab] = useState("process"); // Default tab

  const images = [img1, img2, img3, img4, img5];

  const features = [
    { title: "Registration", description: "Using Mobile Number" },
    { title: "Login", description: "Using Mobile Number & Password" },
    { title: "OTP Verification", description: "Entered via OTP alone" },
    { title: "Other Process", description: "Lot of Verification Process" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "process":
        return <ProcessFlow />;
      case "feature":
        return <FeatureFlow images={images} features={features} />;
      case "internship":
        return <InternshipFlowFull />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9f9f9" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <img src={logo} alt="Logo" style={{ width: 40, marginRight: 16 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Workflow App
          </Typography>
          <Button color="inherit" onClick={() => setActiveTab("process")}>Process Flow</Button>
          <Button color="inherit" onClick={() => setActiveTab("feature")}>Feature Flow</Button>
          <Button color="inherit" onClick={() => setActiveTab("internship")}>Internship Flow</Button>
        </Toolbar>
      </AppBar>

      {/* Render selected component */}
      <Box sx={{ px: 4 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;
