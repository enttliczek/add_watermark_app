import axios from "axios";

export const fetchHistory = () =>
  axios.get("/api/conversation/history").then((r) => r.data);

export const sendMessage = (message) =>
  axios.post("/api/conversation/message", { message }).then((r) => r.data);

export const clearHistory = () =>
  axios.delete("/api/conversation/history").then((r) => r.data);
