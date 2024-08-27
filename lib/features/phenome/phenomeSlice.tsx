import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { Phenome } from "@/app/utilities/interfaces";

export interface PhenomeSlice {
  phenome: Phenome;
}

const initialState: PhenomeSlice = {
  phenome: {},
};

export const phenomeSlice = createSlice({
  name: "phenome",
  initialState,
  reducers: {
    setStorePhenome: (
      state,
      action: PayloadAction<{
        phenome: {};
      }>
    ) => {
      state.phenome = action.payload.phenome;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStorePhenome } = phenomeSlice.actions;

export default phenomeSlice.reducer;
