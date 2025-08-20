// calculate rotation of icon
export const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const toDeg = (rad: number) => (rad * 180) / Math.PI;

	const dLon = toRad(lng2 - lng1);
	const y = Math.sin(dLon) * Math.cos(toRad(lat2));
	const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
	return (toDeg(Math.atan2(y, x)) + 360) % 360; // Normalize to 0-360°
};
