import { render, screen } from "@testing-library/react";
import RobotDetails from "./RobotDetails";
import * as VIAM from "@viamrobotics/sdk";

// Mock data with proper typing
const mockLocations = [
  {
    id: "loc-1",
    name: "Location 1",
    primaryOrgIdentity: {
      name: "Org 1",
    },
  },
] as VIAM.appApi.Location[];

const mockRobotOptions = [
  { key: "robot-1", text: "Robot 1" },
  { key: "robot-2", text: "Robot 2" },
];

const mockSelectedRobot = { key: "robot-1", text: "Robot 1" };

const mockSetSelectedRobot = jest.fn();

const mockRobotInfo = [
  {
    name: "Robot 1",
    location: "loc-1",
  },
] as VIAM.appApi.Robot[];

// The test
describe("RobotDetails", () => {
  it("renders robot names correctly", () => {
    render(
      <RobotDetails
        locations={mockLocations}
        robotOptions={mockRobotOptions}
        selectedRobot={mockSelectedRobot}
        setSelectedRobot={mockSetSelectedRobot}
        robotInfo={mockRobotInfo}
        pollCount={1}
      />
    );

    // Checks that Robot 1 is in the rendered output
    expect(screen.getByText("Robot 1")).toBeInTheDocument();
  });
});
