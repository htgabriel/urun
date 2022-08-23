function formatTimeString(time, showMsecs) {
	let msecs = time % 1000;
	
	if (msecs < 10) {
		msecs = `00${msecs}`;
	} else if (msecs < 100) {
		msecs = `0${msecs}`;
	}
	
	let seconds = Math.floor(time / 1000);
	let minutes = Math.floor(time / 60000);
	let hours = Math.floor(time / 3600000);
	seconds = seconds - minutes * 60;
	minutes = minutes - hours * 60;
	let formatted;
	if (showMsecs) {
		formatted = `${minutes < 10 ? 0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}:${msecs}`;
	} else {
		formatted = `${minutes < 10 ? 0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
	}
	
	return formatted;
}

function convertNumToTime(number) {
	let sign = (number >= 0) ? 1 : -1;
	
	number = number * sign;
	
	let hour = Math.floor(number);
	let decpart = number - hour;
	
	let min = 1 / 60;
	decpart = min * Math.round(decpart / min);
	
	let minute = Math.floor(decpart * 60) + '';
	
	if(minute < 10) minute = `0${minute}`;
	if(hour < 10) hour = `0${hour}`;
	
	sign = sign === 1 ? '' : '-';

	return `${sign+hour}:${minute}`;
}

export { formatTimeString, convertNumToTime };
