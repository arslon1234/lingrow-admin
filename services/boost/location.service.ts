import { addSuccess } from '~/helpers/notification';
export const boostLocationService = {
	async copyLongLat(editStatus: BoostEventStatusForm) {
		if (!editStatus.latitude && !editStatus.longitude) return;
		await navigator.clipboard.writeText(`${editStatus.latitude ?? ''} ${editStatus.longitude ?? ''}`);
		addSuccess('Copied to clipboard');
	},
	async pasteLongLat(editStatus: BoostEventStatusForm) {
		const result = await navigator.clipboard.readText();
		const regex = /^([+-]?\d*\.?\d+)\s*[^0-9+-]*\s*([+-]?\d*\.?\d+)/;
		const match = result.match(regex);
		if (match) {
			const [lat, long]: number[] = [parseFloat(match[1]), parseFloat(match[2])];
			editStatus.latitude = lat;
			editStatus.longitude = long;
		}
	},
    async redirectToMap(editStatus: BoostEventStatusForm){
        if (!editStatus.latitude || !editStatus.longitude) return;
		await navigateTo(`https://www.google.com/maps?q=${editStatus.latitude},${editStatus.longitude}`, {
			open: {
				target: '_blank'
			}
		});
    }
};
