import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import * as moment from "moment";
import { extendMoment } from "moment-range";
import { DayInterface, ModalKeyInterface } from "@/app/utilities/interfaces";
import data from "@/app/utilities/dummyDataTesting01.json";
// import data from "../../utilities/dummyDataTesting01.json";
// import data from "../utilities/dummyData.json";
const extendedMoment = extendMoment(moment);

export interface ModalSlice {
  key: ModalKeyInterface | undefined;
}

const initialState: ModalSlice = {
  key: "AddEntry",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (
      state,
      action: PayloadAction<{
        key: ModalKeyInterface | undefined;
      }>
    ) => {
      state.key = action.payload.key;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;
