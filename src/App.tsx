import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// Import VIAM types and functions
import * as VIAM from "@viamrobotics/sdk";
import {
  Stack,
  Text,
  Dropdown,
  IDropdownOption,
  Image,
  ImageFit,
  Label,
  DefaultButton,
  Toggle,
  Separator
} from '@fluentui/react';


function App() {
  const [dataClient, setDataClient] = useState<VIAM.ViamClient>();
  const [robotClient, setRobotClient] = useState<VIAM.RobotClient | null>(null);
  const [cameraClient, setCameraClient] = useState<VIAM.CameraClient | null>(null);
  const [locations, setLocations] = useState<VIAM.appApi.Location[]>([]);
  const [robotOptions, setRobotOptions] = useState<{ key: string; text: string }[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<IDropdownOption | undefined>(undefined);
  const [cameraToggle, setCameraToggle] = useState<boolean>(false);
  const [part, setPart] = useState<VIAM.appApi.RobotPart | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>("");
  const [sensorValue, setSensorValue] = useState<string>("");
  const API_KEY_ID = "65004ced-6af2-4180-af36-4379e271bc37";
  const API_KEY = "7u4uu86t6npez87ywcbknszqxop939vj";
  

  useEffect(() => {
    const connect = async () => {
      // Replace "<API-KEY-ID>" (including brackets) with your machine's
      // Replace "<API-KEY>" (including brackets) with your machine's API key
      const opts: VIAM.ViamClientOptions = {
        serviceHost: "https://app.viam.com:443",
        credentials: {
          type: "api-key",
          authEntity: API_KEY_ID,
          payload: API_KEY,
        },
      };
      const client = await VIAM.createViamClient(opts);
      setDataClient(client);
      const organizations = await client.appClient.listOrganizations();
      const allLocations = [];

      for (const org of organizations) {
        const locations = await client.appClient.listLocations(org.id);
        allLocations.push(...locations);
      }
      console.log("loc",allLocations);
      setLocations(allLocations);
      const robotsArrays = await Promise.all(
        allLocations.map(location =>
        client.appClient.listRobots(location.id)
      )
      );
      const robots: VIAM.appApi.Robot[] = robotsArrays.flat();
      console.log(robots)
      const robotOptions = robots.map(machine => ({
        key: machine.id,
        text: machine.name,
      }));
      console.log(robotOptions)
      setRobotOptions(robotOptions)
    }
    connect();
  }, []);

useEffect(() => {
  if (!selectedRobot || !dataClient) return;
  let robotClient: VIAM.RobotClient | null = null;
  let sensorClient: VIAM.SensorClient | null = null;
  let cameraClient: VIAM.CameraClient | null = null;
  const connect = async () => {
    const robotParts = await dataClient.appClient.getRobotParts((selectedRobot.key as string));
    const mainPart = robotParts?.find(p => p.mainPart);
    if (!mainPart) return;

    setPart(mainPart);

    const host = mainPart.fqdn;
    robotClient = await VIAM.createRobotClient({
      host,
      credentials: {
        type: "api-key",
        authEntity: API_KEY_ID,
        payload: API_KEY,
      },
      signalingAddress: 'https://app.viam.com:443',
    });
    sensorClient = await new VIAM.SensorClient(robotClient, "sensor-3");
    setSensorValue(JSON.stringify(await sensorClient.getReadings()))
    setRobotClient(robotClient)
    // 3. Camera client
    cameraClient = new VIAM.CameraClient(robotClient, 'cam');
    setCameraClient(cameraClient);
    const leftMotor = new VIAM.MotorClient(robotClient, "left");
  }
  connect()
}, [selectedRobot])

useEffect(() => {
  if (!selectedRobot || !dataClient) return;

  let isMounted = true;
  let intervalId: NodeJS.Timeout;

  const connectAndStartPolling = async () => {
    // 1. Get robot part
    // 2. Connect RobotClient

    // 4. Polling loop
    const fetchFrame = async () => {
      if (!cameraClient) return;
      try {
        const mimeType = "image/jpeg";
        const frame = await cameraClient.renderFrame(mimeType);
        if (isMounted) {
          setImage(URL.createObjectURL(frame));
        }
      } catch (err) {
        console.error("Error fetching frame:", err);
      }
    };

    // Fetch immediately
    await fetchFrame();

    // Then poll
    intervalId = setInterval(fetchFrame, 5000);
  };

  connectAndStartPolling();

  return () => {
    isMounted = false;
    if (intervalId) clearInterval(intervalId);
  };
}, [cameraClient]);
  
const onButtonPress = async () => {
  if (!robotClient) return;
  console.log(robotClient)
  const leftMotor = new VIAM.MotorClient(robotClient, "left");
  console.log(leftMotor)
  await leftMotor.setPower(1.5);
  await leftMotor.goFor(5, 5)

  // Wait for 2 seconds
  await new Promise(res => setTimeout(res, 10000));

  // Stop
  await leftMotor.stop();
}

  // <Insert data client and query code here in later steps>

  // <Insert HTML block code here in later steps>
  return (
    <Stack verticalFill styles={{ root: { height: '100vh', padding: 20 } }} tokens={{ childrenGap: 20 }}>
      {/* Header */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="xLarge">Viam Dashboard</Text>
        <DefaultButton text="Sign Out" />
      </Stack>

      <Separator />

      {/* Main Content */}
      <Stack horizontal tokens={{ childrenGap: 20 }} styles={{ root: { flexGrow: 1 } }}>
        {/* Left Panel */}
        <Stack
          tokens={{ childrenGap: 15 }}
          styles={{ root: { width: 250, padding: 10, border: '1px solid #ddd', borderRadius: 4 } }}
        >
          <Text variant="large">Connected Robots</Text>
          <Dropdown
            placeholder="Select a robot"
            options={robotOptions}
            selectedKey={selectedRobot?.key}
            onChange={(e, option) => setSelectedRobot(option)}
          />
          <Label>Status: Connected</Label>
          <Label>Polling: Every 5s</Label>
        </Stack>

        {/* Right Panel */}
        <Stack
          tokens={{ childrenGap: 20 }}
          styles={{
            root: {
              flexGrow: 1,
              padding: 20,
              border: '1px solid #ddd',
              borderRadius: 4,
            },
          }}
        >
          <Text variant="large">Robot Details</Text>
          {selectedRobot ? (
            <Stack tokens={{ childrenGap: 10 }}>
              <Text variant="mediumPlus">Robot: {selectedRobot.text}</Text>
              <Label>Live Camera Feed</Label>
              <Image
                src={image}
                alt="Live camera"
                width={400}
                height={300}
                imageFit={ImageFit.cover}
              />

              <Label>Sensor Value</Label>
              <Text variant="medium">{sensorValue}</Text>

              <Separator />

              <Text variant="mediumPlus">Controls</Text>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <DefaultButton text="Move Robot" onClick={async() => onButtonPress()} />
                <DefaultButton text="Turn On Light" onClick={() => alert('Light toggled!')} />
                <Toggle
                  label="Switch Camera"
                  checked={cameraToggle}
                  onChange={(e, checked) => setCameraToggle(!!checked)}
                />
              </Stack>
            </Stack>
          ) : (
            <Text variant="medium">Please select a robot to view details.</Text>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default App;

