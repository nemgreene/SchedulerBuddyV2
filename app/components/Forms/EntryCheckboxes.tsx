import React from "react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";

export default function EntryCheckboxes({
  form,
  signature,
}: {
  form: any;
  signature?: string;
}) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const { showHeadCount } = watch();

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {signature === "locations" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={watch("showCapacity")}
                {...register("showCapacity")}
              />
            }
            label="Capacity"
          />
        )}
        {signature === "allocations" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={watch("showRatio")}
                {...register("showRatio")}
              />
            }
            label="Ratio"
          />
        )}
        {signature === "allocations" && (
          <FormControlLabel
            control={
              <Checkbox
                checked={watch("showHeadCount")}
                {...register("showHeadCount")}
              />
            }
            label="Head Count"
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={watch("showMatrix")}
              {...register("showMatrix")}
            />
          }
          label="Matrix"
        />
      </Box>
    </React.Fragment>
  );
}
