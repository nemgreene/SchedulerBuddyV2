"use client";
import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
  AllocationInterface,
  DayInterface,
  ModalKeyInterface,
  NiceNames,
} from "../utilities/interfaces";
import DayContainer from "./DayContainer";
// import { DateSlice } from "../lib/features/DateSlice";
import EntryDetails from "../components/EntryDetails";
import { DateSlice } from "@/lib/features/dates/DateSlice";
import { setModal } from "@/lib/features/modal/modalSlice";

export default function TimetableContainer({
  signature,
}: {
  signature: string;
}) {
  const { data } = useAppSelector((v: { dates: DateSlice }) => {
    return v.dates;
  });

  const niceNames: NiceNames[] = [
    ...data.allocations,
    ...data.assets,
    ...data.locations,
  ].map((v: { name: string; id: string }) => ({ name: v.name, id: v.id }));

  const dispatch = useAppDispatch();
  return (
    <Grid container sx={{ width: "100vw", p: 2, pt: 1, pb: 1 }}>
      <Grid item xs={12} container>
        {data[signature as keyof DayInterface].map(
          (v: AllocationInterface, i: number) => (
            <Grid item xs={12} container key={i}>
              <Grid item xs={3}>
                <EntryDetails entryData={v} signature={signature} />
                {/* <EntryForm variant="add" signature={signature} /> */}
                {/* <DayContainer data={v} niceNames={niceNames} /> */}
              </Grid>
              <Grid item xs={9}>
                <DayContainer
                  data={v}
                  niceNames={niceNames}
                  signature={signature}
                />
              </Grid>
            </Grid>
          )
        )}
        <Grid item xs={3}>
          <Button
            fullWidth
            sx={{ pt: 10, pb: 10 }}
            onClick={() => {
              dispatch(
                setModal({
                  key: "AddEntry",
                  signature: signature,
                  data: undefined,
                })
              );
            }}
          >
            Add item
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
