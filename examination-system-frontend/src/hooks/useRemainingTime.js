import { useState, useEffect } from "react";
import { convertSecondsToObject } from "../utilities/dateAndTime.utility";

/*
startTime: Date obj
endTime: Date obj
 */
const useRemainingTime = (startTime, endTime) => {
  const [seconds, setSeconds] = useState(0);
  const [isIntervalFinished, setIsIntervalFinished] = useState(false);

  useEffect(() => {
    if (!startTime || !endTime) {
      return;
    }
    const startTimestamp = startTime.getTime();
    const endTimestamp = endTime.getTime();

    if (startTimestamp > endTimestamp) {
      setIsIntervalFinished(true);
    } else {
      const remainingMilliSeconds = endTimestamp - startTimestamp;

      setSeconds(Math.floor(remainingMilliSeconds / 1000));
    }
  }, [startTime, endTime]);

  useEffect(() => {
    const reduceSeconds = setInterval(
      () =>
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setIsIntervalFinished(true);
            return prevSeconds;
          } else {
            setIsIntervalFinished(false);
            return prevSeconds - 1;
          }
        }),
      1000
    );

    return () => clearInterval(reduceSeconds);
  }, []);

  return {
    ...convertSecondsToObject(seconds),
    isIntervalFinished,
  };
};

export default useRemainingTime;
