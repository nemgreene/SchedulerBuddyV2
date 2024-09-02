import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import * as moment from "moment";
import { extendMoment } from "moment-range";
import {
  AllocationBlockInterface,
  AllocationInterface,
  DayInterface,
  KeyInterface,
} from "@/app/utilities/interfaces";
import data from "@/app/utilities/dummyDataTesting01.json";
// import data from "../../utilities/dummyDataTesting01.json";
// import data from "../utilities/dummyData.json";
const extendedMoment = extendMoment(moment);

export interface DateSlice {
  startTime: moment.Moment;
  endTime: moment.Moment;
  snapIncrement: number;
  timeSlots: Array<moment.Moment>;
  value: number;
  data: DayInterface | any;
}

const initialState: DateSlice = {
  value: 1,
  startTime: extendedMoment("9:00", "HH:mm"),
  endTime: extendedMoment("15:00", "HH:mm"),
  snapIncrement: 15,
  timeSlots: Array.from(
    extendedMoment
      .range(extendedMoment("9:00", "HH:mm"), extendedMoment("15:00", "HH:mm"))
      .by("minutes", { step: 15 })
  ),
  data: data,
};

export const dateSlice = createSlice({
  name: "dates",
  initialState,
  reducers: {
    updateTimes: (
      state,
      action: PayloadAction<{
        time: moment.Moment;
        key: "startTime" | "endTime";
      }>
    ) => {
      state[action.payload.key] = action.payload.time;
      state.timeSlots = Array.from(
        extendedMoment
          .range(state.startTime, state.endTime)
          .by("minutes", { step: 15 })
      );
    },
    addBlock: (
      state,
      action: PayloadAction<{
        data: AllocationInterface;
        block: AllocationBlockInterface;
      }>
    ) => {},

    addEntry: (
      state,
      action: PayloadAction<{
        key: KeyInterface;
        entry: AllocationInterface;
      }>
    ) => {
      state.data[action.payload.key as keyof DayInterface] = [
        ...state.data[action.payload.key as keyof DayInterface],
        action.payload.entry,
      ];
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTimes, addEntry, addBlock } = dateSlice.actions;

export default dateSlice.reducer;
