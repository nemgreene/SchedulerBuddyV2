import React, { useState, useEffect, useCallback } from "react";

import * as Yup from "yup";

import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Checkbox,
  Grid,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const MenuProps = {
  variant: "menu",
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

export default function MultiSelect({
  control,
  options = [],
  registerKey,
  ...rest
}) {
  const [isOpen, setOpen] = useState(false);

  return (
    control &&
    registerKey && (
      <Controller
        {...rest}
        control={control}
        name={registerKey}
        render={({ field, ...rest }) => {
          return (
            <Select
              {...field}
              style={{ width: "100%" }}
              multiple
              value={field.value || []}
              onClose={(event) => {
                field.onBlur();
                setOpen(false);
              }}
              onChange={(e) => {
                field.onChange(
                  e.target.value.filter(
                    (x, _, self) =>
                      self.findIndex((v) => v.name === x.name) ===
                      self.findLastIndex((v) => v.name === x.name)
                  )
                );
              }}
              onOpen={() => setOpen(true)}
              open={isOpen}
              displayEmpty={true}
              MenuProps={MenuProps}
              renderValue={(selected) => {
                return (
                  selected
                    ?.map((option) => option.name)
                    .filter((v) => v)
                    .join(", ") || "Not Specified"
                );
              }}
              // {...otherOptions}
            >
              {options.map((option) => (
                <MenuItem key={option.id} value={option}>
                  <Checkbox
                    checked={
                      field.value?.map((v) => v.name).indexOf(option.name) >= 0
                    }
                  />
                  <ListItemText primary={option.name} />
                </MenuItem>
              ))}
            </Select>
          );
        }}
      />
    )
  );
}
