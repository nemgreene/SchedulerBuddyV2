"use client";
import { Box, Divider, Grid } from "@mui/material";
import React from "react";
import moment from "moment";

import {
  AllocationBlockInterface,
  AllocationInterface,
  DayCardVariant,
  KeyInterface,
  NiceNames,
  Phenome,
  PhenomeBlock,
} from "../utilities/interfaces";
import DayAperture from "./DayAperture";
import DayCard from "./DayCard";
import { useSelector } from "react-redux";

export default function DayContainer({
  data,
  niceNames,
  disabled = false,
  variant = "default",
  signature,
}: {
  data: AllocationInterface;
  niceNames: NiceNames[];
  disabled?: boolean;
  variant?: DayCardVariant;
  signature: KeyInterface;
}) {
  // const { startTime, endTime } = useSelector((v: { dates: DateSlice }) => {
  //   return v.dates;
  // });

  const heightDict = {
    compact: "50px",
    default: "150px",
  };

  const { name, blocks } = data;
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: heightDict[variant],
        mt: 3,
        mb: 1,
      }}
    >
      <DayAperture disabled={disabled} data={data} signature={signature}>
        <Box
          sx={{
            flexWrap: "nowrap",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            position: "relative",
            height: heightDict[variant],
          }}
        >
          {blocks?.map((v, i, a) => {
            return (
              <DayCard
                key={i}
                data={v}
                niceNames={niceNames}
                variant={variant}
              />
            );
          })}
        </Box>
      </DayAperture>
      {/* <Divider /> */}
    </Box>
  );
}
