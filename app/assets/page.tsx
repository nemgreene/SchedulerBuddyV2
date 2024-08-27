"use client";

import { Box, Grid } from "@mui/material";
import React from "react";
import TimetableContainer from "../timetable/TimetableContainer";
import { Provider, useSelector } from "react-redux";

export default function page() {
  return <TimetableContainer stateKey={"assets"} />;
}
