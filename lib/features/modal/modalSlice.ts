import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import * as moment from "moment";
import { extendMoment } from "moment-range";
import {
  AllocationInterface,
  DayInterface,
  KeyInterface,
  ModalKeyInterface,
} from "@/app/utilities/interfaces";
import data from "@/app/utilities/dummyDataTesting01.json";
// import data from "../../utilities/dummyDataTesting01.json";
// import data from "../utilities/dummyData.json";
const extendedMoment = extendMoment(moment);

export interface ModalSlice {
  key?: ModalKeyInterface | undefined;
  signature?: KeyInterface | undefined;
  data?:
    | (AllocationInterface & {
        startTime?: moment.Moment;
        endTime?: moment.Moment;
      })
    | undefined;
  onClose?: Function | undefined;
}

const initialState: ModalSlice = {
  key: undefined,
  signature: undefined,
  data: undefined,
  onClose: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (state, action: { payload: ModalSlice }) => {
      return { ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;
