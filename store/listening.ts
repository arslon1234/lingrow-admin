import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useListeningStore = defineStore('listening', () => {
	const components = reactive<Component[]>([]);
	const previewMode = ref(false);
	const questionType = ref('MULTIPLE_CHOICE');
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

	function removeOption(componentId: string, optionIndex: number) {
		const component = components.find((c) => c.id == Number(componentId));
		if (component && component.config.options) {
			// Kamida 2 ta option qolishi kerak
			if (component.config.options.length > 2) {
				component.config.options.splice(optionIndex, 1);
			}
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
		// REACTIVE VALUES
		previewMode,
		questionType,

		// FUNCTIONS
		components,
		getDefaultConfig,
		addComponent,
		deleteComponent,
		moveComponent,
		updateComponent,
		updateOption,
		addOption,
		removeOption,

		// API REQUESTS
		audioUpload
	};
});
