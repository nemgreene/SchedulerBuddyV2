import { KeyInterface, ModalKeyInterface } from "@/app/utilities/interfaces";
import { ModalSlice, setModal } from "@/lib/features/modal/modalSlice";
import React from "react";
import EntryForm from "../Forms/EntryForm";
import { useAppDispatch } from "@/lib/hooks";
import { Box } from "@mui/material";
import BlockForm from "../Forms/BlockForm";

export default function ModalHandler({ modalKey }: { modalKey: ModalSlice }) {
  const modalDict: { [key in ModalKeyInterface]: React.ReactElement } = {
    AddEntry: (
      <EntryForm
        variant={"add"}
        signature={modalKey.signature}
        formData={modalKey.data}
      />
    ),
    EditEntry: (
      <EntryForm
        variant={"edit"}
        signature={modalKey.signature}
        formData={modalKey.data}
      />
    ),
    AddBlock: (
      <BlockForm
        variant={"edit"}
        signature={modalKey.signature}
        data={modalKey.data}
      />
    ),
  };
  const dispatch = useAppDispatch();

  const selectModal = (key: ModalKeyInterface | undefined) => {
    const ret: React.ReactElement | undefined =
      modalDict[key as keyof typeof modalDict];
    if (ret) {
      return ret;
    } else {
      dispatch(
        setModal({ key: undefined, signature: undefined, data: undefined })
      );
    }
  };
  return <Box>{selectModal(modalKey.key)}</Box>;
}
