import { Box, Grid } from "@mui/material";
import { Moment } from "moment";
import React from "react";
import useMeasure from "react-use-measure";
interface DayTableProps {
  timeSlots: Array<Moment>;
}

export default function DayTable({ timeSlots = [] }: DayTableProps) {
  const [ref, bounds] = useMeasure();

  const width: number = bounds.width / (timeSlots.length - 1);

  return (
    <Box
      className="DayTableContainer"
      sx={{
        width: "100%",
        userSelect: "none",
        position: "realtive",
        height: "100%",
      }}
      ref={ref}
    >
      <Grid
        container
        sx={{
          flexWrap: "nowrap",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            // transform: `translateX(${width * 0.5 + 1}px)`,
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width={`${width}`}
                height="1000"
                patternUnits="userSpaceOnUse"
              >
                <rect width={`${width}`} height="100" fill="url(#smallGrid)" />
                <path
                  d="M 0 0 L 0 1000"
                  fill="none"
                  stroke="gray"
                  strokeWidth="2"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* <svg width="100%" height="300px" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width={`${width}`}
                // height={`100%`}
                height={"1px"}
                patternUnits=""
              >
                <path
                  d={`M 0 0 L 0 0 0 ${width}`}
                  fill="none"
                  stroke="gray"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect width="100%" height="100px" fill="url(#grid)" />
          </svg> */}
        {/* {timeSlots.map((v, i) => (
          <Grid
            key={i}
            sx={{
              width: `calc(100%/${timeSlots.length})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {v.format("HH:mm")}
          </Grid>
        ))} */}
      </Grid>
    </Box>
  );
}
