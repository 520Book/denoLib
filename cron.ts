export { cron, daily, start, stop };

type JobType = () => void;
enum TIME_PART {
  SECOND = 'SECOND',
  MINUTE = 'MINUTE',
  HOUR = 'HOUR',
  DAY_OF_WEEK = 'DAY_OF_WEEK',
  DAY_OF_MONTH = 'DAY_OF_MONTH',
  MONTH = 'MONTH',
}
const { DAY_OF_MONTH, DAY_OF_WEEK, HOUR, MINUTE, MONTH, SECOND } = TIME_PART;
const schedules = new Map<string, Array<JobType>>();
let schedulerTimeIntervalID: ReturnType<typeof setInterval> = 0;
let shouldStopRunningScheduler = false;


const isRange = (text: string) => /^\d\d?\-\d\d?$/.test(text);
const getTimePart = (date: Date, type: TIME_PART): number =>
  ({
    [SECOND]: date.getSeconds(),
    [MINUTE]: date.getMinutes(),
    [HOUR]: date.getHours(),
    [MONTH]: date.getMonth() + 1,
    [DAY_OF_WEEK]: date.getDay(),
    [DAY_OF_MONTH]: date.getDate(),
  }[type]);

function daily(cb: JobType) {
  cron(`1 0 0 * * *`, cb);
};

function cron (schedule: string = '', job: JobType) {
  let jobs = schedules.has(schedule)
    ? [...(schedules.get(schedule) || []), job]
    : [job];
  schedules.set(schedule, jobs);
};

function executeJobs() {
  const date = new Date();
  schedules.forEach((jobs, schedule) => {
    if (validate(schedule, date).didMatch) {
      jobs.forEach((job) => job());
    }
  });
};

function getRange (min: number, max: number) {
  const numRange = [];
  let lowerBound = min;
  while (lowerBound <= max) {
    numRange.push(lowerBound);
    lowerBound += 1;
  }
  return numRange;
};

function isMatched(date: Date, timeFlag: string, type: TIME_PART): boolean {
  const timePart = getTimePart(date, type);

  if (timeFlag === '*') {
    return true;
  } else if (Number(timeFlag) === timePart) {
    return true;
  } else if (timeFlag.includes('/')) {
    const [_, executeAt = '1'] = timeFlag.split('/');
    return timePart % Number(executeAt) === 0;
  } else if (timeFlag.includes(',')) {
    const list = timeFlag.split(',').map((num: string) => parseInt(num));
    return list.includes(timePart);
  } else if (isRange(timeFlag)) {
    const [start, end] = timeFlag.split('-');
    const list = getRange(parseInt(start), parseInt(end));
    return list.includes(timePart);
  }
  return false;
};

function start() {
  if (shouldStopRunningScheduler) {
    shouldStopRunningScheduler = false;
    runScheduler();
  }
};

function stop() {
  shouldStopRunningScheduler = true;
};

export const validate = (schedule: string, date: Date = new Date()) => {
  // @ts-ignore
  const timeObj: Record<TIME_PART, boolean> = {};

  const [
    dayOfWeek,
    month,
    dayOfMonth,
    hour,
    minute,
    second = '01',
  ] = schedule.split(' ').reverse();

  const cronValues = {
    [SECOND]: second,
    [MINUTE]: minute,
    [HOUR]: hour,
    [MONTH]: month,
    [DAY_OF_WEEK]: dayOfWeek,
    [DAY_OF_MONTH]: dayOfMonth,
  };

  for (const key in cronValues) {
    timeObj[key as TIME_PART] = isMatched(
      date,
      cronValues[key as TIME_PART],
      key as TIME_PART,
    );
  }

  const didMatch = Object.values(timeObj).every(Boolean);
  return {
    didMatch,
    entries: timeObj,
  };
};

const runScheduler = () => {
  schedulerTimeIntervalID = setInterval(() => {
    if (shouldStopRunningScheduler) {
      clearInterval(schedulerTimeIntervalID);
      return;
    }
    executeJobs();
  }, 1000);
};

runScheduler();