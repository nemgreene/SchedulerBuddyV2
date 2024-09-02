import { Box, InputLabel, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";

export default function HeadCountForm({ form }: { form: any }) {
  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const { showHeadCount } = watch();

  return (
    <Box sx={{ opacity: showHeadCount ? 1 : 0.5 }}>
      <Tooltip
        placement="left"
        arrow
        title={
          showHeadCount
            ? "Some allocations represent multiple people. This information is used to calculate capacity at locations, but not assets "
            : null
        }
      >
        <InputLabel disabled={!showHeadCount}>
          <Typography sx={{ pb: 0.5 }} variant="h5">
            Head Count
          </Typography>
        </InputLabel>
      </Tooltip>
      <TextField
        disabled={!showHeadCount}
        type="number"
        fullWidth
        {...register("headCount", {
          required: {
            value: showHeadCount,
            message: "Head count must be a number",
          },
          min: { value: 0, message: "Must be non negative" },
          max: { value: 100, message: "Must be less then 100" },
        })}
        error={errors.headCount ? true : false}
        helperText={errors.headCount?.message || " "}
      />
    </Box>
  );
}
