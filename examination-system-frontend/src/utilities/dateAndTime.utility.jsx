import moment from "moment";

export const convertDateTimeToObject = (dateTimeString) => {
  const [firstPart, secondPart] = dateTimeString.split(" ");

  const [year, month, day] = firstPart.split("-");
  const [hours, minutes, seconds] = secondPart.split(":");

  const timestamp = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  ).getTime();

  return { year, month, day, hours, minutes, seconds, timestamp };
};

export const convertSecondsToObject = (time) => {
  const seconds = time % 60;
  time = Math.floor(time / 60);
  const minutes = time % 60;
  time = Math.floor(time / 60);
  const hours = time % 24;
  time = Math.floor(time / 24);
  const days = time;

  return { seconds, minutes, hours, days };
};

/*
input: 2 => output: 02
input: 0 => output: 00
input: 12 => output: 12
 */
export const standardTime = (time) => {
  if (time === 0) return "00";
  if (time < 10) return `0${time}`;
  return time;
};

/*
input: object with keys: days, hours, minutes, seconds
output: string like: `1 day, 2 hours, 3 minutes`
 */
export const convertObjectToString = (obj) => {
  let output = "";
  if (obj.days > 0) {
    output = output + obj.days + " сут";// + (obj.days > 1 ? "s" : "");
  }
  if (obj.hours > 0) {
    if (output.length > 0 && output[output.length - 1] !== ",") {
      output = output + ", ";
    }
    output = output + obj.hours + " ч";// + (obj.hours > 1 ? "s" : "");
  }
  if (obj.minutes > 0) {
    if (output.length > 0 && output[output.length - 1] !== ",") {
      output = output + ", ";
    }
    output = output + obj.minutes + " м";// + (obj.minutes > 1 ? "s" : "");
  }
  return output;
};

export const convertToUTC = (datetime) => {
  let format;
  if (moment(datetime, "YYYY-MM-DD HH:mm:ss") === datetime) {
    format = "YYYY-MM-DD HH:mm:ss";
  } else {
    format = moment.ISO_8601;
  }
  return moment(datetime, format).utc().format("YYYY-MM-DD HH:mm:ss");
};

export const convertFromUTC = (datetime) => {
  let format;
  if (moment(datetime, "YYYY-MM-DD HH:mm:ss") === datetime) {
    format = "YYYY-MM-DD HH:mm:ss";
  } else {
    format = moment.ISO_8601;
  }
  return moment.utc(datetime, format).local().format("YYYY-MM-DD HH:mm:ss");
};

export const isDateInThePast = (datetime) => {
  let format;
  if (moment(datetime, "YYYY-MM-DD HH:mm:ss") === datetime) {
    format = "YYYY-MM-DD HH:mm:ss";
  } else {
    format = moment.ISO_8601;
  }

  return moment(datetime, format).isBefore(new Date());
};

export const convertFromUTCToHumanReadable = (datetime) => {
  let format;
  if (moment(datetime, "YYYY-MM-DD HH:mm:ss") === datetime) {
    format = "YYYY-MM-DD HH:mm:ss";
  } else {
    format = moment.ISO_8601;
  }
  return moment.utc(datetime, format).local().fromNow();
};

export const convertToHumanReadable = (datetime) => {
  let format;
  if (moment(datetime, "YYYY-MM-DD HH:mm:ss") === datetime) {
    format = "YYYY-MM-DD HH:mm:ss";
  } else {
    format = moment.ISO_8601;
  }
  return moment(datetime, format).fromNow();
};
