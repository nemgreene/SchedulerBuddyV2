"use client";
import { ModalSlice, setModal } from "@/lib/features/modal/modalSlice";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Modal from "@mui/material/Modal";
import { Box, Typography } from "@mui/material";
import ModalHandler from "./ModalHandler";

export default function ModalWrapper({
  children,
}: React.PropsWithChildren<{}>) {
  const modal = useAppSelector((v: { modal: ModalSlice }) => {
    return v.modal;
  });

  const dispatch = useAppDispatch();
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
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
          if (modal.onClose) {
            try {
              modal.onClose();
            } catch (error) {}
          }
          dispatch(
            setModal({ key: undefined, signature: undefined, data: undefined })
          );
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>{modal.key && <ModalHandler modalKey={modal} />}</div>
        </Box>
      </Modal>
      {children}
    </Box>
  );
}
