import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';

export const useMaterialsStore = defineStore('materials', () => {
	const materials = ref<any>(null);
	const isLoading = ref(false);
	async function getMaterials(params: GetMaterialBookParams) {
		const response = await useAxios().getRequest(ApiUrls.MATERIALS, params);
		if (response.status === 200) {
			materials.value = response.data
		}
	}
	async function createMaterial(formData: CreateMaterialBookRequest) {
		const response = await useAxios().postRequest(ApiUrls.MATERIALS, { ...formData }, isLoading);
		return response;
	}

	async function deleteMaterial(materialId: string | number) {
		const response = await useAxios().deleteRequest(`${ApiUrls.MATERIALS}/${materialId}`);
		return response;
	}
	async function updateMaterial(materialId: string | number, formData: CreateMaterialBookRequest) {
		const response = await useAxios().putRequest(`${ApiUrls.MATERIALS}/${materialId}`, formData);
		return response;
	}

	return {
		isLoading,
		materials,
		getMaterials,
		createMaterial,
		deleteMaterial,
		updateMaterial
	};
});
