// src/pages/AllocationConflictDemo.js
import React, { useState } from "react";
import { Card, CardContent, Typography, Grid, Box, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";

const initialStudents = [
  { id: 1, name: "Alice", score: 95, applied: ["AI Internship", "Backend Internship"], arrival: 1 },
  { id: 2, name: "Bob", score: 85, applied: ["AI Internship"], arrival: 2 },
  { id: 3, name: "Charlie", score: 82, applied: ["AI Internship"], arrival: 3 },
];

const initialInternships = [
  { id: 101, title: "AI Internship", slots: 2, allocated: [] },
  { id: 102, title: "Backend Internship", slots: 2, allocated: [] },
];

export default function AllocationConflictDemo() {
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([...initialStudents]);
  const [internships, setInternships] = useState([...initialInternships]);
  const [conflictChoice, setConflictChoice] = useState({});
  const [eliminated, setEliminated] = useState([]);

  const restartDemo = () => {
    setStep(1);
    setStudents([...initialStudents]);
    setInternships([...initialInternships]);
    setConflictChoice({});
    setEliminated([]);
    gsap.killTweensOf("*");
  };

  const handleChoiceChange = (studentName, choice) => {
    // Allocate Alice
    const newInternships = internships.map(i => ({ ...i, allocated: [...i.allocated] }));
    const alice = students.find(s => s.name === studentName);
    const chosenIntern = newInternships.find(i => i.title === choice);
    chosenIntern.allocated.push(studentName);

    // Allocate other students respecting remaining slots
    const remainingStudents = students.filter(s => s.name !== studentName)
      .sort((a, b) => b.score - a.score || a.arrival - b.arrival);

    const newEliminated = [];
    remainingStudents.forEach(s => {
      let allocated = false;
      for (let iTitle of s.applied) {
        const intern = newInternships.find(i => i.title === iTitle);
        if (intern.allocated.length < intern.slots) {
          intern.allocated.push(s.name);
          allocated = true;
          break;
        }
      }
      if (!allocated) newEliminated.push(s.name);
    });

    // Animate allocations
    newInternships.forEach(intern => {
      intern.allocated.forEach(name => {
        const el = document.getElementById(`${name}${intern.title.split(" ")[0]}`);
        if (el) gsap.to(el, { backgroundColor: "#4caf50", duration: 0.5 });
      });
    });
    newEliminated.forEach(name => {
      const s = students.find(st => st.name === name);
      s.applied.forEach(iTitle => {
        const el = document.getElementById(`${name}${iTitle.split(" ")[0]}`);
        if (el) gsap.to(el, { backgroundColor: "#f44336", duration: 0.5 });
      });
    });

    setInternships(newInternships);
    setConflictChoice({ [studentName]: choice });
    setEliminated(newEliminated);
    setStep(step + 1);
  };

  const explanations = [
    "Step 1: Display students and internships. Alice has top score → needs to choose.",
    "Step 2: Alice chooses internship → remaining students allocated according to available slots.",
    "Allocation completed ✅",
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Internship Allocation Conflict Demo
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Students & Scores</Typography>
          {students.slice().sort((a,b)=>b.score-a.score).map(s => (
            <Card key={s.id} className="studentCard" id={`${s.name}Backend`} sx={{ bgcolor:"#1e1e1e", color:"#fff", mb:2 }}>
              <CardContent>
                <Typography variant="h6">{s.name}</Typography>
                <Typography>Score: {s.score}</Typography>
                <Typography>Applied: {s.applied.join(", ")}</Typography>

                {step===1 && s.name==="Alice" && (
                  <FormControl fullWidth sx={{ mt:1 }}>
                    <InputLabel>Choose Internship</InputLabel>
                    <Select value="" onChange={(e)=>handleChoiceChange(s.name,e.target.value)}>
                      {s.applied.map(i=><MenuItem key={i} value={i}>{i}</MenuItem>)}
                    </Select>
                  </FormControl>
                )}

                {conflictChoice[s.name] && <Typography sx={{ mt:1, color:"#4caf50" }}>Chose: {conflictChoice[s.name]}</Typography>}
                {eliminated.includes(s.name) && <Typography sx={{ mt:1, color:"#f44336" }}>Unallocated ❌</Typography>}
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Internship Slots</Typography>
          {internships.map(i => (
            <Card key={i.id} sx={{ bgcolor:"#263238", color:"#fff", mb:2 }}>
              <CardContent>
                <Typography variant="h6">{i.title}</Typography>
                <Typography>Slots: {i.slots}</Typography>
                <div style={{ marginTop: "10px" }}>
                  {students.filter(s => s.applied.includes(i.title)).map(s=>(
                    <motion.div key={s.id} id={`${s.name}${i.title.split(" ")[0]}`} layout style={{padding:"8px", margin:"4px 0", borderRadius:"6px", background:"#424242"}}>
                      {s.name} (Score: {s.score})
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>

      <Box sx={{ mt:4, p:3, borderRadius:"10px", bgcolor:"#1a237e", color:"white", textAlign:"center" }}>
        <Typography variant="h6">{explanations[step-1]}</Typography>
      </Box>

      <Box sx={{ mt:3, textAlign:"center" }}>
        <Button variant="outlined" color="secondary" onClick={restartDemo}>Restart 🔄</Button>
      </Box>
    </Box>
  );
}
