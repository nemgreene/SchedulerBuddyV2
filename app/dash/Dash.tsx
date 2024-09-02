"use client";
import React from "react";
import TimetableContainer from "../timetable/TimetableContainer";
import { Box } from "@mui/material";

export default function Dash() {
  return (
    <Box>
      <TimetableContainer signature={"allocations"} />
    </Box>
  );
}
