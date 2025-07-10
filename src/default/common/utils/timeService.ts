export function getTimeGap(timeString: string): string {
  const currentTime: Date = new Date();
  const providedTime: Date = new Date(timeString);

  const timeDifference: number = providedTime.getTime() - currentTime.getTime();
  const millisecondsPerDay: number = 1000 * 60 * 60 * 24;

  const absoluteTimeDifference: number = Math.abs(timeDifference);

  if (absoluteTimeDifference < millisecondsPerDay) {
    const hours: number = Math.floor(absoluteTimeDifference / (1000 * 60 * 60));
    return `${hours}h`;
  } else if (absoluteTimeDifference < 7 * millisecondsPerDay) {
    const days: number = Math.floor(
      absoluteTimeDifference / millisecondsPerDay
    );
    return `${days}d`;
  } else {
    const weeks: number = Math.floor(
      absoluteTimeDifference / (7 * millisecondsPerDay)
    );
    return `${weeks}w`;
  }
}
