import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

export const useDefectStore = defineStore('defect', () => {
	const vehicleDefects = ref<DefectResponse[]>();
	const trailerDefects = ref<DefectResponse[]>();

	async function getDefects(getPartial: boolean = false) {
		const response = await useAxios().getRequest(ApiUrls.DEFECTS_URL, { ...pagination(getPartial) });
		if (response.status === 200) {
			const defectsResponse: DefectResponse[] = response.data.successResult;
			const groupped = Object.groupBy(defectsResponse, ({ type }: DefectResponse) => type);
			vehicleDefects.value = groupped[0];
			trailerDefects.value = groupped[1];
		}
	}

	return {
		vehicleDefects,
		trailerDefects,
		getDefects
	};
});
