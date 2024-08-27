import React from "react";
import { AllocationInterface, MatrixInterface } from "../utilities/interfaces";
import { Box, Button, Grid } from "@mui/material";

interface EntryDetailsProps {
  entryData: AllocationInterface & {
    matrix: MatrixInterface;
    ratio?: Array<number>;
    capacity?: number;
    headCount?: number;
    name: string;
    id?: string;
  };
}

export default function EntryDetails({ entryData }: EntryDetailsProps | any) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ flex: 1 }}>{entryData.name}</Box>
      <Box sx={{ pr: 1, pl: 1 }}>
        <Button>Edit</Button>
      </Box>
      <Box></Box>
    </Box>
  );
}
