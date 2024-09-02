import {
  Box,
  Grid,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";

export default function RatioForm({ form }: { form: any }) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const { showRatio } = watch();

  return (
    <Grid container sx={{ opacity: showRatio ? 1 : 0.5 }}>
      <Grid item xs={12}>
        <Tooltip
          placement="left"
          arrow
          title={
            showRatio
              ? "Some Allocations require a specific Allocation/Asset ratio"
              : null
          }
        >
          <InputLabel disabled={!showRatio}>
            <Typography sx={{ pb: 2 }} variant="h5">
              Ratio
            </Typography>
          </InputLabel>
        </Tooltip>
      </Grid>
      <Grid item sx={{ pr: 1 }} xs={6}>
        <TextField
          fullWidth
          type="number"
          disabled={!showRatio}
          label={"Assets"}
          // placeholder="ratioA"
          {...register("ratioA", {
            required: {
              value: errors.ratioB ? true : false,
              message: "Ratio B is not null, must not be null",
            },
            min: { value: 0, message: "Must be non negative" },
            max: { value: 100, message: "Must be less then 100" },
          })}
          error={errors.ratioA ? true : false}
          helperText={errors.ratioA?.message || " "}
        />
      </Grid>
      <Grid item sx={{ pl: 1 }} xs={6}>
        <TextField
          disabled={!showRatio}
          fullWidth
          type="number"
          label={"Allocations"}
          // placeholder="ratioA"
          {...register("ratioB", {
            required: {
              value: errors.ratioB ? true : false,
              message: "Ratio A is not null, must not be null",
            },
            min: { value: 0, message: "Must be non negative" },
            max: { value: 100, message: "Must be less then 100" },
          })}
          error={errors.ratioB ? true : false}
          helperText={errors.ratioB?.message || " "}
        />
      </Grid>
    </Grid>
  );
}
