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
  MatrixInterface,
  MartrixChildInterface,
  DayInterface,
} from "../../utilities/interfaces";
import MultiSelect from "@/app/components/Forms/MultiSelect";

export default function MatrixForm({
  storeData,
  form,
}: {
  storeData: DayInterface;
  form: any;
}) {
  const { resetField, control, watch, setValue } = form;
  const { matrixA, matrixB, matrixC, matrixD, showMatrix } = watch();

  const flatData = Object.keys(storeData).reduce(
    (acc: AllocationInterface[], curr: string) => [
      ...acc,
      ...storeData[curr as keyof DayInterface],
    ],
    []
  );

  return (
    <Box sx={{ opacity: showMatrix ? 1 : 0.5 }}>
      <br />
      <Tooltip
        placement="left"
        arrow
        title={
          showMatrix ? "Some entries have relationships to other entries" : null
        }
      >
        <InputLabel disabled={!showMatrix}>
          <Typography sx={{ pb: 0.5 }} variant="h5">
            Matrix
          </Typography>
        </InputLabel>
      </Tooltip>
      <Grid container>
        <Grid item sx={{ pr: 1 }} xs={6}>
          <InputLabel disabled={!showMatrix}>Must Have</InputLabel>
          <MultiSelect
            disabled={!showMatrix}
            options={flatData.filter((v) => {
              return matrixB &&
                matrixB
                  ?.map((v: MartrixChildInterface) => v.name)
                  .indexOf(v.name) !== -1
                ? false
                : true;
            })}
            registerKey={"matrixA"}
            control={control}
          />
        </Grid>
        <Grid item sx={{ pl: 1 }} xs={6}>
          <InputLabel disabled={!showMatrix}>Must Not Have</InputLabel>
          <MultiSelect
            disabled={!showMatrix}
            options={flatData.filter((v) => {
              return matrixA &&
                matrixA
                  ?.map((v: MartrixChildInterface) => v.name)
                  .indexOf(v.name) !== -1
                ? false
                : true;
            })}
            registerKey={"matrixB"}
            control={control}
          />
        </Grid>
        <Grid sx={{ pr: 1 }} xs={6}>
          <InputLabel disabled={!showMatrix}>Prefers To Have</InputLabel>
          <MultiSelect
            disabled={!showMatrix}
            options={flatData.filter((v) => {
              return matrixD &&
                matrixD
                  ?.map((v: MartrixChildInterface) => v.name)
                  .indexOf(v.name) !== -1
                ? false
                : true;
            })}
            registerKey={"matrixC"}
            control={control}
          />
        </Grid>
        <Grid item sx={{ pl: 1 }} xs={6}>
          <InputLabel disabled={!showMatrix}>Prefers To Not Have</InputLabel>
          <MultiSelect
            disabled={!showMatrix}
            options={flatData.filter((v) => {
              return matrixC &&
                matrixC
                  ?.map((v: MartrixChildInterface) => v.name)
                  .indexOf(v.name) !== -1
                ? false
                : true;
            })}
            registerKey={"matrixD"}
            control={control}
          />
        </Grid>
        <Grid item xs={12} sx={{ pt: 2 }}>
          <Button
            disabled={!showMatrix}
            onClick={() => {
              setValue("matrixA", []);
              setValue("matrixB", []);
              setValue("matrixC", []);
              setValue("matrixD", []);
            }}
            fullWidth
            variant="outlined"
            color={"warning"}
          >
            Reset Matrix
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
