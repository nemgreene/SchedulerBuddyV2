import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { use, useEffect } from "react";
import { KeyInterface } from "../../utilities/interfaces";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import { Form, useForm } from "react-hook-form";

type variant = "add" | "edit";
interface EntryFormProps {
  variant: "add" | "edit";
  formData?: {};
  signature?: KeyInterface;
}

type Inputs = {
  matrix?: string;
  ratioA: number;
  ratioB: number;
  capacity?: number;
  headCount?: number;
  name: string;
  showRatio: boolean;
  showCapacity: boolean;
  showHeadCount: boolean;
  showMatrix: boolean;
};

export default function EntryForm({
  variant,
  formData,
  signature,
}: EntryFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      showRatio: true,
      showCapacity: true,
      showHeadCount: true,
      showMatrix: true,
    },
  });
  console.log(watch(), errors);
  const {
    matrix,
    ratioA,
    ratioB,
    capacity,
    headCount,
    name,
    showRatio,
    showCapacity,
    showHeadCount,
    showMatrix,
  } = watch();
  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <InputLabel>{signature} Name*</InputLabel>
      <TextField
        {...register("name", {
          required: { value: true, message: "Must enter name" },
        })}
        error={errors.name ? true : false}
        helperText={errors.name?.message || " "}
        // label={`${signature} Name`}
        // required={true}
      />

      <InputLabel sx={{ pb: 1 }}>Advanced</InputLabel>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <FormControlLabel
          control={<Checkbox {...register("showRatio")} />}
          label="Ratio"
        />
        <FormControlLabel
          control={<Checkbox {...register("showCapacity")} />}
          label="Capacity"
        />
        <FormControlLabel
          control={<Checkbox {...register("showHeadCount")} />}
          label="HeadCount"
        />
        <FormControlLabel
          control={<Checkbox {...register("showMatrix")} />}
          label="Matrix"
        />
      </Box>

      {/* Ratio */}
      {showRatio && (
        <Box>
          <InputLabel sx={{ pb: 1 }}>Ratio(Optional)</InputLabel>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box>
              <InputLabel>Assets</InputLabel>
              <TextField
                type="number"
                // placeholder="ratioA"
                defaultValue={1}
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
            </Box>

            <Box>
              <InputLabel>Allocations</InputLabel>
              <TextField
                type="number"
                defaultValue={100}
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
            </Box>
          </Box>
        </Box>
      )}
      {showCapacity && (
        <Box>
          <InputLabel>Capacity</InputLabel>
          <TextField
            type="number"
            // placeholder="ratioA"
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
      )}
      {showHeadCount && (
        <Box>
          <InputLabel>Capacity</InputLabel>
          <TextField
            type="number"
            // placeholder="ratioA"
            defaultValue={1}
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
      )}
      <Button type="submit">Submit</Button>
    </Box>
  );
}
