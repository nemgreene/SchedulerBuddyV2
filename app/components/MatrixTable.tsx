import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import {
  MartrixChildInterface,
  MatrixInterface,
  matrixSymbols,
} from "../utilities/interfaces";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function MatrixTable({ matrix }: { matrix: MatrixInterface }) {
  return (
    <TableContainer sx={{ width: "100%", maxWidth: "100%" }}>
      <Table aria-label="simple table" sx={{ width: "100%", maxWidth: "100%" }}>
        <TableHead>
          <TableRow>
            {Object.keys(matrix).map(
              (v: string, i: number) =>
                matrix[v].length > 0 && (
                  <Tooltip
                    key={i}
                    title={matrixSymbols[v]}
                    placement="top"
                    arrow
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -10],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <TableCell sx={{ p: 0.2 }} key={i} align="center">
                      {v}
                    </TableCell>
                  </Tooltip>
                )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(matrix)
            .sort((p: string, n: string) => matrix[p].length - matrix[p].length)
            .map((v, index) => {
              return (
                <TableRow key={index}>
                  {Object.keys(matrix).map(
                    (v, i) =>
                      matrix[v][index]?.name && (
                        <TableCell
                          key={i}
                          align="center"
                          sx={{ border: 0, p: 0.1 }}
                        >
                          <Typography sx={{ fontSize: ".9rem" }}>
                            {matrix[v][index]?.name}
                          </Typography>
                        </TableCell>
                      )
                  )}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
