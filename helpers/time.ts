export function convertSecondsToHours(duration: number, separator = 'h ', ending: string = 'm', show: boolean = false): string {
  if (duration === 0) {
    return `00${separator}00${ending}` + (show ? '00' : '');
  }

  let hours: number = Math.floor(duration / 3600);
	let minutes: number = Math.floor((duration % 3600) / 60);
	let seconds: number = Math.floor((duration % 3600) % 60);

  return `${String(hours).padStart(2, '0')}${separator}${String(minutes).padStart(2, '0')}${ending}${show ? String(seconds).padStart(2, '0') : ''}`;
}
