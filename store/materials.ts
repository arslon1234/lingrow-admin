import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addError, addSuccess } from '~/helpers/notification';

export const useMaterialsStore = defineStore('materials', () => {
	const materials = ref<any>(null);

	async function getMaterials(params: GetMaterialBookParams) {
		const response = await useAxios().getRequest(ApiUrls.MATERIALS, params);
		if (response.status === 200) {
			console.log(response);
		}
	}
	async function createMaterial(formData: CreateMaterialBookRequest) {
		const response = await useAxios().postRequest(ApiUrls.MATERIALS, { ...formData });
        return response
        // if (response.status === 201) {
        //     addSuccess('Material successfully created')
        // }
	}

	return {
		materials,
		getMaterials,
        createMaterial
	};
});
