"use client";
import { ModalSlice, setModal } from "@/lib/features/modal/modalSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import { Box, Typography } from "@mui/material";
import ModalHandler from "./ModalHandler";

export default function ModalWrapper({
  children,
}: React.PropsWithChildren<{}>) {
  const modal = useSelector((v: { modal: ModalSlice }) => {
    return v.modal;
  });

  const dispatch = useDispatch();
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box>
      <Modal
        open={modal.key ? true : false}
        onClose={() => {
          dispatch(setModal({ key: undefined }));
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>{modal.key && <ModalHandler modalKey={modal.key} />}</div>
        </Box>
      </Modal>
      {children}
    </Box>
  );
}
