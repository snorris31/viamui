import { IDropdownOption } from "@fluentui/react";
import { useEffect, useState } from "react";
import * as VIAM from "@viamrobotics/sdk";
import { ComponentName } from "../constants/components";
import { createDataClient, createRobotClient } from "./useViamClient";

export function useRobotDashboard() {
  const [dataClient, setDataClient] = useState<VIAM.ViamClient>();
  const [pollCount, setPollCount] = useState<number>(0);
  const [robotClient, setRobotClient] = useState<VIAM.RobotClient | null>(null);
  const [cameraClient, setCameraClient] = useState<VIAM.CameraClient | null>(
    null
  );
  const [locations, setLocations] = useState<VIAM.appApi.Location[]>([]);
  const [robotOptions, setRobotOptions] = useState<
    { key: string; text: string }[]
  >([]);
  const [robotInfo, setRobotInfo] = useState<VIAM.appApi.Robot[]>();
  const [selectedRobot, setSelectedRobot] = useState<
    IDropdownOption | undefined
  >(undefined);
  const [image, setImage] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [robotConnectErr, setRobotConnectErr] = useState<string | undefined>(
    ""
  );

  useEffect(() => {
    const connect = async () => {
      const client = await createDataClient();
      setDataClient(client);
      const organizations = await client.appClient.listOrganizations();
      const allLocations = [];

      for (const org of organizations) {
        const locations = await client.appClient.listLocations(org.id);

        allLocations.push(...locations);
      }
      setLocations(allLocations);
      const robotsArrays = await Promise.all(
        allLocations.map((location) => client.appClient.listRobots(location.id))
      );
      const robots: VIAM.appApi.Robot[] = robotsArrays.flat();
      setRobotInfo(robots);
      const robotOptions = robots.map((machine) => ({
        key: machine.id,
        text: machine.name,
      }));
      setRobotOptions(robotOptions);
    };
    connect();
  }, []);

  useEffect(() => {
    if (!selectedRobot || !dataClient) return;
    let robotClient: VIAM.RobotClient | null = null;
    let cameraClient: VIAM.CameraClient | null = null;
    const connect = async () => {
      try {
        const robotParts = await dataClient.appClient.getRobotParts(
          selectedRobot.key as string
        );
        const mainPart = robotParts?.find((p) => p.mainPart);
        if (!mainPart) return;

        const host = mainPart.fqdn;
        try {
          robotClient = await createRobotClient(host);
          setRobotClient(robotClient);
          if (!robotClient) return;
          // 3. Camera client
          cameraClient = new VIAM.CameraClient(
            robotClient,
            ComponentName.CameraClient
          );
          setCameraClient(cameraClient);
        } catch (err: any) {
          console.error("Error creating robot client:", err);
          setRobotConnectErr(err.toString());
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error connecting to robot:", err);
      }
    };
    connect();
  }, [selectedRobot]);

  useEffect(() => {
    if (!selectedRobot || !dataClient) return;

    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const connectAndStartPolling = async () => {
      const fetchFrame = async () => {
        if (!cameraClient) return;
        try {
          const mimeType = "image/jpeg";
          const frame = await cameraClient.renderFrame(mimeType);
          if (isMounted) {
            setPollCount((prev) => prev + 1);
            setImage(URL.createObjectURL(frame));
          }
        } catch (err) {
          console.error("Error fetching frame:", err);
        }
      };

      await fetchFrame();
      intervalId = setInterval(fetchFrame, 5000);
    };

    connectAndStartPolling();

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [cameraClient]);

  return {
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
  };
}
