export const optimizeFormService = {

    validateStatusForm(editStatus: OptimizeEditStatus) {
		let errors = [];
		if (editStatus.location_origin === 1 && !editStatus.latitude) {
			errors.push({ path: 'latitude', message: errorMessages.blank });
		}
		if (editStatus.location_origin === 1 && !editStatus.longitude) {
			errors.push({ path: 'longitude', message: errorMessages.blank });
		}
		if (editStatus.location_origin === 1 && !editStatus.location) {
			errors.push({ path: 'location', message: errorMessages.blank });
		}
		if (editStatus.location_origin === 2 && !editStatus.location_note) {
			errors.push({ path: 'locationNote', message: errorMessages.blank });
		}
		return errors;
	},
};
