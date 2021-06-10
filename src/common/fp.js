export function h0(timestamp = Date.now()){
    const time = new Date(timestamp);

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);

    return time.getTime();
}