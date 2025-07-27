import { Stack, Dropdown, Label, Text, IDropdownOption } from "@fluentui/react";
import * as VIAM from "@viamrobotics/sdk";

type RobotProps = {
  locations: VIAM.appApi.Location[];
  robotOptions: { key: string; text: string }[];
  selectedRobot: IDropdownOption | undefined;
  setSelectedRobot: any;
  robotInfo: VIAM.appApi.Robot[] | undefined;
  pollCount: number;
};

const RobotDetails: React.FC<RobotProps> = ({
  locations,
  robotOptions,
  selectedRobot,
  setSelectedRobot,
  robotInfo,
  pollCount,
}) => {
  return (
    <Stack
      tokens={{ childrenGap: 25 }}
      styles={{
        root: {
          width: "25%",
          padding: 20,
          background: "white",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          height: "90vh",
        },
      }}
    >
      <Text variant="xLarge">Connected Robots</Text>
      <Dropdown
        placeholder="Select a robot"
        options={robotOptions}
        selectedKey={selectedRobot?.key}
        onChange={(e, option) => setSelectedRobot(option)}
      />
      <Text variant="xLarge">Robot Info:</Text>
      {locations.map((location) => {
        return (
          <Stack>
            <Text>
              <b>Location</b>: {location.name}
            </Text>
            <Text>
              <b>Organization</b>:{" "}
              {location.primaryOrgIdentity?.name ?? "No Primary Org"}
            </Text>
            <Text>
              <b>Robots</b>:{" "}
              {robotInfo?.filter((item) => item.location === location.id)
                ?.length
                ? robotInfo
                    ?.filter((item) => item.location === location.id)
                    .map((item) => item.name)
                    .join(", ")
                : "N/A"}
            </Text>
          </Stack>
        );
      })}
      <Label>Polling: Every 5s</Label>
      <Label>Refresh Count: {pollCount}</Label>
    </Stack>
  );
};

export default RobotDetails;
