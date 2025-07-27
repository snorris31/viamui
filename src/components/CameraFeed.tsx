import React, { useEffect, useState } from "react";
import * as VIAM from "@viamrobotics/sdk";
import {
  Text,
  Image,
  ImageFit,
  Label,
  Separator,
  Stack,
} from "@fluentui/react";
import Controls from "./Controls";
import { ComponentName } from "../constants/components";

type CameraProps = {
  selectedRobot: string;
  image: string | undefined;
  robotClient: VIAM.RobotClient | null;
};

const CameraFeed: React.FC<CameraProps> = ({
  selectedRobot,
  image,
  robotClient,
}) => {
  const [sensorValue, setSensorValue] = useState<string>("");

  useEffect(() => {
    const connect = async () => {
      if (!robotClient) return;
      let sensorClient: VIAM.SensorClient | null = null;

      sensorClient = await new VIAM.SensorClient(
        robotClient,
        ComponentName.SensorClient
      );
      setSensorValue(JSON.stringify(await sensorClient.getReadings()));
    };
    connect();
  }, [robotClient]);
  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { height: "100vh" } }}>
      <Text variant="xLarge">Robot: "{selectedRobot}"</Text>
      <Text variant="medium">Sensor Value: {sensorValue}</Text>
      <Stack horizontal tokens={{ childrenGap: 30 }}>
        <Stack
          styles={{
            root: {
              position: "relative",
              height: "80vh",
              width: "85vw",
              paddingBottom: 20,
            },
          }}
        >
          <Image
            src={image}
            alt="Live camera"
            width={"100%"}
            height={"100%"}
            imageFit={ImageFit.cover}
            styles={{
              root: {
                position: "relative",
                height: "100%",
                width: "auto",
              },
            }}
          />
          <Stack
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            🟢 LIVE
          </Stack>
          <Stack
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            <Controls robotClient={robotClient} />
          </Stack>
        </Stack>
        {/* 
        <Stack horizontalAlign="start">
          {" "}
          <Controls robotClient={robotClient} />
        </Stack> */}
      </Stack>
    </Stack>
  );
};

export default CameraFeed;
