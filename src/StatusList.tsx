import React, { useState } from "react";
import * as VIAM from "@viamrobotics/sdk";
import ButtonComponent from "./ButtonComponent";
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Panel,
  SelectionMode,
  Stack,
} from "@fluentui/react";

type StatusListProps = {
  isOpen: boolean;
  setOpenState: any;
};

const StatusList: React.FC<StatusListProps> = ({ isOpen, setOpenState }) => {
  const columns: IColumn[] = [
    {
      key: "component",
      name: "Component",
      fieldName: "component",
      minWidth: 70,
      maxWidth: 150,
      isResizable: true,
    },
    {
      key: "status",
      name: "Status",
      fieldName: "status",
      minWidth: 50,
      maxWidth: 100,
    },
  ];

  const items = [
    { key: "1", component: "Arm", status: "Loading" },
    { key: "2", component: "Base", status: "Offline" },
    { key: "3", component: "Camera", status: "Online" },
  ];
  return (
    <Panel
      isOpen={isOpen}
      onDismiss={() => setOpenState(false)}
      styles={{ main: { width: "80vw" } }}
    >
      <Stack>
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          isHeaderVisible={true}
          selectionMode={SelectionMode.none}
        />
      </Stack>
    </Panel>
  );
};
export default StatusList;
