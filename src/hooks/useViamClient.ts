import * as VIAM from "@viamrobotics/sdk";
import { EnvKeys } from "../constants/env";

export async function createDataClient(): Promise<VIAM.ViamClient> {
  const client = await VIAM.createViamClient({
    serviceHost: "https://app.viam.com:443",
    credentials: {
      type: "api-key",
      authEntity: process.env[EnvKeys.API_KEY_ID] ?? "",
      payload: process.env[EnvKeys.API_KEY] ?? "",
    },
  });
  return client;
}

export async function createRobotClient(
  host: string
): Promise<VIAM.RobotClient> {
  const robotClient = await VIAM.createRobotClient({
    host,
    credentials: {
      type: "api-key",
      authEntity: process.env[EnvKeys.API_KEY_ID] ?? "",
      payload: process.env[EnvKeys.API_KEY] ?? "",
    },
    signalingAddress: process.env[EnvKeys.SIGNALING_ADDRESS] ?? "",
  });
  return robotClient;
}
