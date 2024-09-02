"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
  Input,
  Select,
  MenuItem,
  Grid,
  ListItemText,
} from "@mui/material";
import React, { PropsWithChildren, use, useEffect, useState } from "react";
import {
  AllocationInterface,
  DayInterface,
  KeyInterface,
} from "../../utilities/interfaces";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, Form, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addEntry, DateSlice } from "@/lib/features/dates/DateSlice";
import { setModal } from "@/lib/features/modal/modalSlice";
import MultiSelect from "@/app/components/Forms/MultiSelect";
import MatrixForm from "./MatrixForm";
import HeadCountForm from "./HeadCountForm";
import CapacityForm from "./CapacityForm";
import RatioForm from "./RatioForm";
import EntryCheckboxes from "./EntryCheckboxes";
type variant = "add" | "edit";

interface EntryFormProps {
  variant: variant;
  formData?: AllocationInterface | undefined;
  signature?: KeyInterface;
}

type Inputs = {
  matrixA: AllocationInterface[];
  matrixB: AllocationInterface[];
  matrixC: AllocationInterface[];
  matrixD: AllocationInterface[];
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
  const defaultValues = {
    ratioA: 1,
    ratioB: 100,
    showMatrix: Object.values(formData?.matrix || {}).flat(2).length > 0,
    showRatio:
      formData?.ratio && JSON.stringify(formData?.ratio) !== "[1,100]"
        ? true
        : false,
    showCapacity: formData?.capacity ? true : false,
    showHeadCount: formData?.headCount ? true : false,
    headCount: 1,
    ...(formData?.name && { name: formData.name }),
    ...(formData?.matrix &&
      formData?.matrix["I+"] && { matrixA: formData.matrix["I+"] }),
    ...(formData?.matrix &&
      formData?.matrix["I-"] && { matrixB: formData.matrix["I-"] }),
    ...(formData?.matrix &&
      formData?.matrix["P+"] && { matrixC: formData.matrix["P+"] }),
    ...(formData?.matrix &&
      formData?.matrix["P-"] && { matrixD: formData.matrix["P-"] }),
    ...(formData?.headCount && {
      headCount: formData.headCount,
      showHeadCount: true,
    }),
    ...(formData?.ratio && {
      ratioA: formData.ratio[0],
      ratioB: formData.ratio[1],
      showRatio: true,
    }),
    ...(formData?.capacity && {
      capacity: formData.capacity,
      showCapacity: true,
    }),
  };

  const form = useForm<Inputs>({
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  const dispatch = useAppDispatch();

  const { data: storeData } = useAppSelector((v: { dates: DateSlice }) => {
    return v.dates;
  });

  const FormHeader = ({ children }: PropsWithChildren<{}>) => (
    <div>
      <Typography sx={{ pb: 1 }} variant="h5">
        {children}
      </Typography>
    </div>
  );

  const { showCapacity, showHeadCount, showMatrix } = watch();

  const onSubmit = ({
    matrixA = [],
    matrixB = [],
    matrixC = [],
    matrixD = [],
    ratioA,
    ratioB,
    capacity,
    headCount,
    name,
    ...rest
  }: Inputs) => {
    let insert: AllocationInterface = {
      id: `${signature}_${name
        .match(/[a-z0-9]+/gi)
        ?.join("")
        ?.toLowerCase()}`,
      name,
      blocks: [],
      matrix: showMatrix
        ? {
            "I+": matrixA.map(({ name, id }: AllocationInterface) => ({
              name,
              id,
            })),
            "I-": matrixB.map(({ name, id }: AllocationInterface) => ({
              name,
              id,
            })),
            "P+": matrixC.map(({ name, id }: AllocationInterface) => ({
              name,
              id,
            })),
            "P-": matrixD.map(({ name, id }: AllocationInterface) => ({
              name,
              id,
            })),
          }
        : {
            "I+": [],
            "I-": [],
            "P+": [],
            "P-": [],
          },
      ...(showCapacity && { capacity }),
      ...(showHeadCount && { headCount }),
      ...(ratioA && ratioB && { ratio: [ratioA, ratioB] }),
    };
    if (signature && variant === "add") {
      dispatch(addEntry({ key: signature, entry: insert }));
      reset();
      dispatch(
        setModal({ key: undefined, signature: undefined, data: undefined })
      );
      // dispatch(setModal({ key: undefined, signature: undefined }));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
        {`${variant} ${signature}`}
      </Typography>
      <br />
      <InputLabel>
        <Typography
          variant="h5"
          sx={{ textTransform: "capitalize", pt: 1, pb: 1 }}
        >
          {signature} Name*
        </Typography>
      </InputLabel>
      <TextField
        fullWidth
        {...register("name", {
          required: { value: true, message: "Must enter name" },
        })}
        error={errors.name ? true : false}
        helperText={errors.name?.message || " "}
      />

      {/* -----------------------------CheckBoxes----------------------------------- */}
      <FormHeader>Advanced Data Input</FormHeader>
      <EntryCheckboxes form={form} signature={signature} />
      <br />
      {/* -----------------------------Ratio----------------------------------- */}
      {signature === "allocations" && <RatioForm form={form} />}
      {/* -----------------------------Capacity----------------------------------- */}
      {signature === "locations" && <CapacityForm form={form} />}
      {/* -----------------------------Head Count----------------------------------- */}
      {signature === "allocations" && <HeadCountForm form={form} />}
      {/* -----------------------------Matrix----------------------------------- */}
      <MatrixForm form={form} storeData={storeData} />
      <br />
      <Button fullWidth variant="outlined" sx={{ p: 3 }} type="submit">
        Submit
      </Button>
    </Box>
  );
}
