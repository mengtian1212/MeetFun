export const formatDateTime = (timeData) => {
  const startDateTime = new Date(timeData);
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  };
  return startDateTime.toLocaleString("en-US", options);
};
