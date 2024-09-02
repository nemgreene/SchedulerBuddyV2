import React from "react";
import { AllocationInterface, MatrixInterface } from "../utilities/interfaces";
import { Box, Button, Grid } from "@mui/material";
import { setModal } from "@/lib/features/modal/modalSlice";
import { useAppDispatch } from "@/lib/hooks";

interface EntryDetailsProps {
  signature: string;
  data: AllocationInterface;
  entryData: AllocationInterface & {
    matrix: MatrixInterface;
    ratio?: Array<number>;
    capacity?: number;
    headCount?: number;
    name: string;
    id?: string;
  };
}

export default function EntryDetails({
  entryData,
  signature,
}: EntryDetailsProps | any) {
  const dispatch = useAppDispatch();
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ flex: 1 }}>{entryData.name}</Box>
      <Box sx={{ pr: 1, pl: 1 }}>
        <Button
          onClick={() => {
            dispatch(
              setModal({
                key: "EditEntry",
                signature: signature,
                data: entryData,
              })
            );
          }}
        >
          Edit
        </Button>
      </Box>
      <Box></Box>
    </Box>
  );
}
