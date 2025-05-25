export const formatTimestamp = (timestamp: number) => {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return formatter.format(timestamp);
};
