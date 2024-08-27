import { ModalKeyInterface } from "@/app/utilities/interfaces";
import { setModal } from "@/lib/features/modal/modalSlice";
import React from "react";
import { useDispatch } from "react-redux";
import EntryForm from "../Forms/EntryForm";

const modalDict: { [key in ModalKeyInterface]: React.ReactElement } = {
  AddEntry: <EntryForm variant={"add"} signature="Allocation" />,
  EditEntry: <div>EditEntry</div>,
};

export default function ModalHandler({
  modalKey,
}: {
  modalKey: ModalKeyInterface;
}) {
  const dispatch = useDispatch();

  const selectModal = (key: ModalKeyInterface) => {
    const ret: React.ReactElement | undefined =
      modalDict[key as keyof typeof modalDict];
    if (ret) {
      return ret;
    } else {
      dispatch(setModal({ key: undefined }));
    }
  };
  return <div>{selectModal(modalKey)}</div>;
}
