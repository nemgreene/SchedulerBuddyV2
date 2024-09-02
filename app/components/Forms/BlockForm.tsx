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
  data?:
    | (AllocationInterface & {
        startTime?: moment.Moment;
        endTime?: moment.Moment;
      })
    | undefined;
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

export default function BlockForm({
  variant,
  data,
  signature,
}: EntryFormProps): JSX.Element {
  const defaultValues = {
    ratioA: 1,
    ratioB: 100,
    showMatrix: Object.values(data?.matrix || {}).flat(2).length > 0,
    showRatio:
      data?.ratio && JSON.stringify(data?.ratio) !== "[1,100]" ? true : false,
    showCapacity: data?.capacity ? true : false,
    showHeadCount: data?.headCount ? true : false,
    headCount: 1,
    ...(data?.name && { name: data.name }),
    ...(data?.matrix && data?.matrix["I+"] && { matrixA: data.matrix["I+"] }),
    ...(data?.matrix && data?.matrix["I-"] && { matrixB: data.matrix["I-"] }),
    ...(data?.matrix && data?.matrix["P+"] && { matrixC: data.matrix["P+"] }),
    ...(data?.matrix && data?.matrix["P-"] && { matrixD: data.matrix["P-"] }),
    ...(data?.headCount && {
      headCount: data.headCount,
      showHeadCount: true,
    }),
    ...(data?.ratio && {
      ratioA: data.ratio[0],
      ratioB: data.ratio[1],
      showRatio: true,
    }),
    ...(data?.capacity && {
      capacity: data.capacity,
      showCapacity: true,
    }),
  };

  const form = useForm<Inputs>({
    defaultValues,
  });

  const { handleSubmit, reset, watch } = form;

  const dispatch = useAppDispatch();

  const { data: storeData } = useAppSelector((v: { dates: DateSlice }) => {
    return v.dates;
  });

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
        {`${data?.name}: Add Time Block`}
      </Typography>
      <Box
        sx={{
          pt: 2,
          pb: 2,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
        }}
      >
        <Typography variant="h5">{data?.startTime?.format("HH:mm")}</Typography>
        <Box sx={{ flex: 1 }}></Box>
        <Typography variant="h5">{data?.endTime?.format("HH:mm")}</Typography>
      </Box>
      {/* -----------------------------CheckBoxes----------------------------------- */}
      {/* <FormHeader>Advanced Data Input</FormHeader> */}
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
