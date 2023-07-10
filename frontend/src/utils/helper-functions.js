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

export const replaceThirdCommaDot = (string) => {
  let commaCount = 0;
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    if (string[i] === ",") {
      commaCount++;
      if (commaCount === 3) {
        newString += " ·";
        continue;
      }
    }
    newString += string[i];
  }
  return newString;
};

export const capitalizeFirstChar = (words) => {
  let processedWord = words.trim().replace(/\s+/g, " ");
  const wordArr = processedWord.split(" ");
  const resArr = [];
  for (let word of wordArr) {
    const newWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
    resArr.push(newWord);
  }
  return resArr.join(" ");
};

export const USSTATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];
