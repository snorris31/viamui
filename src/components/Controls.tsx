import { Stack, Toggle, Text } from "@fluentui/react";
import React, { useState } from "react";
import * as VIAM from "@viamrobotics/sdk";
import ButtonComponent from "./ButtonComponent";
import StatusList from "./StatusList";

type ControlsProps = {
  robotClient: VIAM.RobotClient | null;
};

const Controls: React.FC<ControlsProps> = ({ robotClient }) => {
  const [cameraToggle, setCameraToggle] = useState<boolean>(false);
  const [componentButtonClicked, setComponentButtonClicked] =
    useState<boolean>(false);
  const onButtonPress = async () => {
    if (!robotClient) return;
    const leftMotor = new VIAM.MotorClient(robotClient, "left");
    await leftMotor.setPower(1.5);
    await leftMotor.goFor(5, 5);

    // Wait for 2 seconds
    await new Promise((res) => setTimeout(res, 10000));

    // Stop
    await leftMotor.stop();
  };
  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      horizontalAlign="center"
      styles={{
        root: {
          flexGrow: 1,
          padding: 10,
          borderRadius: 4,
        },
      }}
    >
      <Text variant="large" styles={{ root: { color: "#FFFFFF" } }}>
        Controls
      </Text>
      <Stack horizontalAlign="start">
        <ButtonComponent
          iconName="DoubleDownArrow"
          onClickHandler={onButtonPress}
          text="Move Robot"
        />
      </Stack>
      <ButtonComponent
        iconName="Lightbulb"
        text="Turn on Light"
        onClickHandler={() => {}}
      />
      <ButtonComponent
        iconName="StatusCircleQuestionMark"
        onClickHandler={() => {
          setComponentButtonClicked(true);
        }}
        text="ComponentStatus"
      />
      <Stack horizontal horizontalAlign="center">
        <Toggle
          checked={cameraToggle}
          onChange={(e, checked) => setCameraToggle(!!checked)}
          styles={{ root: { width: "50px", marginRight: 10 } }}
        />
        <Text styles={{ root: { color: "#FFFFFF" } }}>Switch Camera</Text>
      </Stack>
      <StatusList
        isOpen={componentButtonClicked}
        setOpenState={setComponentButtonClicked}
      />
    </Stack>
  );
};

export default Controls;
