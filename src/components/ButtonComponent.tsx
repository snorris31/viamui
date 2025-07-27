import React from "react";
import { DefaultButton, Icon } from "@fluentui/react";

type ControlsProps = {
  iconName: string;
  onClickHandler: any;
  text: string;
};

const ButtonComponent: React.FC<ControlsProps> = ({
  iconName,
  onClickHandler,
  text,
}) => {
  return (
    <DefaultButton
      styles={{
        root: {
          width: "150px",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "#FFFFFF",
        },
      }}
      onClick={onClickHandler}
    >
      <Icon iconName={iconName} styles={{ root: { marginRight: 5 } }} /> {text}
    </DefaultButton>
  );
};

export default ButtonComponent;
