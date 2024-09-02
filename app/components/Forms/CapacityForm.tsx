import { Box, InputLabel, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";

export default function CapacityForm({ form }: { form: any }) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const { showCapacity } = watch();

  return (
    <Box sx={{ opacity: showCapacity ? 1 : 0.5 }}>
      <Tooltip
        placement="left"
        arrow
        title={
          showCapacity
            ? "Some locations have a limited capacity for allocations"
            : null
        }
      >
        <InputLabel disabled={!showCapacity}>
          <Typography sx={{ pb: 2 }} variant="h5">
            Capacity
          </Typography>
        </InputLabel>
      </Tooltip>
      <TextField
        disabled={!showCapacity}
        type="number"
        fullWidth
        defaultValue={100}
        {...register("capacity", {
          required: {
            value: showCapacity,
            message: "Capacity must be a number",
          },
          min: { value: 0, message: "Must be non negative" },
          max: { value: 100, message: "Must be less then 100" },
        })}
        error={errors.capacity ? true : false}
        helperText={errors.capacity?.message || " "}
      />
    </Box>
  );
}
