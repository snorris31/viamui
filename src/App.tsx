import "./App.css";
import {
  Stack,
  Text,
  Image,
  Spinner,
  Icon,
  ActionButton,
  ImageFit,
} from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import CameraFeed from "./components/CameraFeed";
import RobotDetails from "./components/RobotDetails";
import { useRobotDashboard } from "./hooks/useRobotDashboard";
import logo from "./assets/viamlogo.png"; // adjust the path as needed

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
      tokens={{ childrenGap: 5 }}
    >
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        styles={{
          root: {
            height: "78px",
            padding: "0 16px",
            backgroundColor: "#000000",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            borderBottom: "1px solid #ddd",
          },
        }}
      >
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <Image
            src={logo}
            imageFit={ImageFit.cover}
            styles={{
              root: {
                position: "relative",
                height: "70px",
                width: "100px",
              },
            }}
          />
        </Stack>
        <Stack>
          <Text variant="smallPlus" styles={{ root: { color: "#FFFFFF" } }}>
            Logged in as: norrismsara@gmail.com
          </Text>

          <ActionButton
            iconProps={{ iconName: "SignOut" }}
            text="Sign Out"
            styles={{ root: { color: "#FFFFFF" } }}
          />
        </Stack>
      </Stack>

      <Stack
        horizontal
        tokens={{ childrenGap: 5 }}
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
          tokens={{ childrenGap: 10 }}
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
