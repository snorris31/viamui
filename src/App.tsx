import { useEffect, useState } from "react";
import "./App.css";
import * as VIAM from "@viamrobotics/sdk";
import { createDataClient, createRobotClient } from "./hooks/useViamClient";
import {
  Stack,
  Text,
  IDropdownOption,
  Spinner,
  Icon,
  ActionButton,
} from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { ComponentName } from "./constants/components";
import CameraFeed from "./CameraFeed";
import RobotDetails from "./RobotDetails";
import { useRobotDashboard } from "./hooks/useRobotDashboard";

initializeIcons();

function App() {
  const {
    locations,
    robotOptions,
    selectedRobot,
    setSelectedRobot,
    robotInfo,
    pollCount,
    image,
    robotClient,
    isLoading,
    robotConnectErr,
  } = useRobotDashboard();

  return (
    <Stack
      verticalFill
      styles={{ root: { height: "100vh" } }}
      tokens={{ childrenGap: 20 }}
    >
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        styles={{
          root: {
            height: "78px",
            padding: "0 16px",
            backgroundColor: "#f3f2f1",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            borderBottom: "1px solid #ddd",
          },
        }}
      >
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <Icon iconName="Robot" styles={{ root: { fontSize: 25 } }} />

          <Text variant="xLarge">Viam Dashboard</Text>
        </Stack>
        <Stack>
          <Text variant="smallPlus" styles={{ root: { color: "#666" } }}>
            Logged in as: norrismsara@gmail.com
          </Text>
          <ActionButton iconProps={{ iconName: "SignOut" }} text="Sign Out" />
        </Stack>
      </Stack>

      <Stack
        horizontal
        tokens={{ childrenGap: 20 }}
        styles={{ root: { flexGrow: 1 } }}
      >
        <RobotDetails
          locations={locations}
          robotOptions={robotOptions}
          selectedRobot={selectedRobot}
          setSelectedRobot={setSelectedRobot}
          robotInfo={robotInfo}
          pollCount={pollCount}
        />
        <Stack
          tokens={{ childrenGap: 20 }}
          styles={{
            root: {
              flexGrow: 1,
              padding: 20,
              backgroundColor: "#FFFFFF",
              height: "90vh",
              width: "100vw",
              background: "white",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          {robotConnectErr?.length ? (
            <Text variant="mediumPlus">{robotConnectErr} </Text>
          ) : selectedRobot && !isLoading ? (
            <CameraFeed
              selectedRobot={selectedRobot.text}
              image={image}
              robotClient={robotClient}
            />
          ) : selectedRobot && isLoading ? (
            <Stack styles={{ root: { padding: 50 } }}>
              <Spinner />
            </Stack>
          ) : (
            <Text variant="medium">
              Please select a robot to view camera and controls. Please note
              this will only work if the robot is connected.
            </Text>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default App;
