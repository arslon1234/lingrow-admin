import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useListeningStore = defineStore('listening', () => {
	const components = reactive<Component[]>([]);

	async function audioUpload(formData: FormData) {
		const result = await useAxios().postRequest(ApiUrls.AUDIO_UPLOAD, formData);
		if (result.status === 200) {
			addSuccess('Audio uploaded');
		}
		return result;
	}

	function getDefaultConfig(type: string): ComponentConfig {
		return defaults[type] || {};
	}

	function addComponent(component: Component) {
		components.push(component);
	}

	function deleteComponent(id: number) {
		const index = components.findIndex((c) => c.id === id);
		if (index !== -1) {
			components.splice(index, 1);
		}
	}

	function updateComponent(id: number, config: ComponentConfig) {
		const index = components.findIndex((c) => c.id === id);
		if (index !== -1) {
			components[index].config = config;
		}
	}

	function updateOption(componentId: number, idx: number, value: string) {
		const component = components.find((c) => c.id === componentId);
		if (component && component.config.options) {
			component.config.options[idx] = value;
		}
	}

	function addOption(componentId: number) {
		const component = components.find((c) => c.id === componentId);
		if (component && component.config.options) {
			component.config.options.push('');
		}
	}

	function moveComponent(id: number, direction: 'up' | 'down') {
		const index = components.findIndex((c) => c.id === id);
		if ((direction === 'up' && index > 0) || (direction === 'down' && index < components.length - 1)) {
			const targetIndex = direction === 'up' ? index - 1 : index + 1;
			const temp = components[index];
			components[index] = components[targetIndex];
			components[targetIndex] = temp;
		}
	}

	return {
		components,
		getDefaultConfig,
		addComponent,
		deleteComponent,
		moveComponent,
		updateComponent,
    updateOption,
    addOption,

		// API REQUESTS
		audioUpload
	};
});
