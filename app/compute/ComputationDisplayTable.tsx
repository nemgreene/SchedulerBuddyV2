"use client";

import React, { useState, useEffect, ReactNode } from "react";
import {
  Phenome,
  KeyInterface,
  OutputInterface,
  OutputBlock,
} from "../utilities/interfaces";
import { Grid } from "@mui/material";
import DayContainer from "../timetable/DayContainer";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DayAperture from "../timetable/DayAperture";
import DayCard from "../timetable/DayCard";

export default function ComputationDisplayTable({
  phenome,
  updateFilter,
  filterKey,
  setFilterKey,
}: {
  phenome: OutputInterface | {};
  filterKey: KeyInterface;
  updateFilter: Function;
  setFilterKey: Function;
}) {
  const renderFiltered = (ret: OutputInterface) => {
    const keys: KeyInterface[] = ["assets", "allocations", "locations"];
    return (
      <React.Fragment>
        {Object.keys(ret).map((name, i) => {
          return (
            <Grid item container xs={12} key={i} sx={{ padding: "5px" }}>
              <Grid item xs={12}>
                {name}
              </Grid>
              <Grid item xs={12}>
                <DayAperture key={i} disabled={true} signature={filterKey}>
                  <React.Fragment>
                    {keys.map((keyName, index) => {
                      return Array.from(
                        new Set(
                          ret[name as keyof OutputInterface][
                            keyName as keyof OutputBlock
                          ].map((v) => v.name)
                        )
                      ).map((rowName, index) => {
                        const blocks = ret[name as keyof OutputInterface][
                          keyName as keyof OutputBlock
                        ].filter((v) => v.name === rowName);
                        return (
                          <Box
                            key={index}
                            className="OuptutDayContainer"
                            sx={{
                              flexWrap: "nowrap",
                              display: "flex",
                              flexDirection: "row",
                              position: "relative",
                              // height: heightDict[variant],
                              height: "50px",
                            }}
                          >
                            {blocks?.map((v, i, a) => {
                              return (
                                <DayCard
                                  key={i}
                                  data={v}
                                  niceNames={[]}
                                  variant={"compact"}
                                />
                              );
                            })}
                          </Box>
                        );
                      });
                    })}
                  </React.Fragment>
                </DayAperture>
              </Grid>
            </Grid>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <Grid container sx={{ p: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterKey}
          label="Age"
          onChange={(v) => {
            updateFilter(v.target.value);
            setFilterKey(v.target.value as string);
          }}
        >
          <MenuItem value={"assets"}>assets</MenuItem>
          <MenuItem value={"allocations"}>allocations</MenuItem>
          <MenuItem value={"locations"}>locations</MenuItem>
        </Select>
      </FormControl>
      {renderFiltered(phenome)}
    </Grid>
  );
}
