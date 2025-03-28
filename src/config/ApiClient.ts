import axios from "axios";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const WS_ENDPOINT = import.meta.env.VITE_WS_ENDPOINT;

export const ApiClient = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const WebSocketClient = (endURL: string) => {
  return new WebSocket(WS_ENDPOINT + endURL + "/ws");
};
