import React, { useState, useRef, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, LinearProgress } from "@mui/material";
import gsap from "gsap";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CampaignIcon from "@mui/icons-material/Campaign";

// Animatic inside each card
// Animatic inside each card
const StepAnimatic = ({ stepIndex, triggerAnim }) => {
  const animRef = useRef(null);

  useEffect(() => {
    if (!triggerAnim || !animRef.current) return;

    const el = animRef.current;
    const items = el.querySelectorAll("li, .data, .ml-step, .alloc-step, .notify-step");

    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 0.5, ease: "power1.inOut" } });

    tl.fromTo(items, { opacity: 0 }, { opacity: 1, stagger: 0.5 });

    return () => tl.kill();
  }, [triggerAnim, stepIndex]);

  const renderContent = () => {
    switch (stepIndex) {
      case 0:
        return (
          <Box ref={animRef} className="anim-container">
            <Typography className="data">Collect Data</Typography>
            <Typography className="data">Clean & Normalize</Typography>
            <Typography className="data">Prepare for ML</Typography>
          </Box>
        );
      case 1:
        return (
          <Box ref={animRef} className="anim-container">
            <Typography className="ml-step">Feature Extraction</Typography>
            <Typography className="ml-step">Score Candidates</Typography>
            <Typography className="ml-step">Sort Results</Typography>
          </Box>
        );
      case 2:
        return (
          <Box ref={animRef} className="anim-container">
            <Typography className="alloc-step">Match Candidates</Typography>
            <Typography className="alloc-step">Check Fairness</Typography>
            <Typography className="alloc-step">Finalize Allocation</Typography>
          </Box>
        );
      case 3:
        return (
          <Box ref={animRef} className="anim-container">
            <Typography className="notify-step">Send Notifications</Typography>
            <Typography className="notify-step">Update Dashboard</Typography>
            <Typography className="notify-step">Get Confirmation</Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return renderContent();
};


const ProcessFlow = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [triggerAnim, setTriggerAnim] = useState(false);
  const stepRefs = useRef([]);
  const arrowRefs = useRef([]);

  const steps = [
    { title: "1. Extract Data", icon: <StorageIcon fontSize="large" color="primary" />, points: ["Collect raw facts", "Clean & normalize", "Prepare for ML"] },
    { title: "2. ML Engine Processing", icon: <SettingsIcon fontSize="large" color="primary" />, points: ["Feature extraction", "Calculate scores", "Sort results"] },
    { title: "3. Allocation System", icon: <AssignmentIcon fontSize="large" color="primary" />, points: ["Match candidates", "Ensure fairness", "Finalize allocation"] },
    { title: "4. Intimation", icon: <CampaignIcon fontSize="large" color="primary" />, points: ["Send notifications", "Update dashboards", "Ensure acknowledgment"] },
  ];

  const handleTap = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleRestart = () => {
    setCurrentStep(-1);
    setTriggerAnim(false);
  };

  useEffect(() => {
    if (currentStep >= 0 && stepRefs.current[currentStep]) {
      gsap.fromTo(
        stepRefs.current[currentStep],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      stepRefs.current[currentStep].scrollIntoView({ behavior: "smooth", inline: "center" });
    }

    // Trigger final animatic when all steps are displayed
    if (currentStep === steps.length - 1) {
      setTimeout(() => setTriggerAnim(true), 500);
      animateArrows();
    }
  }, [currentStep]);

  const animateArrows = () => {
    arrowRefs.current.forEach((arrow, idx) => {
      if (!arrow) return;
      const dot = document.createElement("div");
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.backgroundColor = "#1976d2";
      dot.style.borderRadius = "50%";
      dot.style.position = "absolute";
      dot.style.top = "50%";
      dot.style.left = 0;
      arrow.appendChild(dot);

      gsap.to(dot, {
        x: arrow.offsetWidth,
        duration: 1.2,
        repeat: -1,
        ease: "linear",
        delay: idx * 0.3
      });
    });
  };

  return (
    <Box
      onClick={handleTap}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ bgcolor: "#f9f9f9", p: 4, cursor: "pointer" }}
    >
      <Typography variant="h4" gutterBottom fontWeight="bold">ML Engine Workflow</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {currentStep < steps.length - 1 ? "(Tap to progress)" : "(Flow completed - Animatic)"}
      </Typography>

      <Box display="flex" flexDirection="row" alignItems="center" gap={2} sx={{ overflowX: "auto", py: 2, position: "relative" }}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {currentStep >= index && (
              <Card ref={(el) => (stepRefs.current[index] = el)} sx={{ width: 250, borderRadius: 3, boxShadow: 4, bgcolor: "white", textAlign: "left", p: 2, flexShrink: 0 }}>
                <CardContent>
                  <Box mb={1}>{step.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">{step.title}</Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {step.points.map((point, i) => (
                      <Typography key={i} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{point}</Typography>
                    ))}
                  </Box>
                  <StepAnimatic stepIndex={index} triggerAnim={triggerAnim} />
                </CardContent>
              </Card>
            )}
            {index < steps.length - 1 && currentStep >= index && (
              <Box
                ref={(el) => (arrowRefs.current[index] = el)}
                sx={{
                  width: 50,
                  height: 4,
                  bgcolor: "#1976d2",
                  borderRadius: 2,
                  position: "relative",
                  flexShrink: 0
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      <Box width="80%" mt={3}>
        <LinearProgress variant="determinate" value={currentStep === -1 ? 0 : ((currentStep + 1) / steps.length) * 100} sx={{ height: 10, borderRadius: 5 }} />
      </Box>

      {currentStep === steps.length - 1 && (
        <Button variant="contained" color="primary" onClick={handleRestart} sx={{ mt: 4 }}>Restart Flow</Button>
      )}
    </Box>
  );
};

export default ProcessFlow;
