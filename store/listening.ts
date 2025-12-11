import { number } from 'zod';
import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';

export const useListeningStore = defineStore('listening', () => {
	const components = reactive<Component[]>([]);
	const previewMode = ref(false);
	const questionType = ref('FORM_COMPLETION');
	
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

	// ✅ MCQ option yangilash
	function updateOption(componentId: number, idx: number, value: string) {
		const component = components.find((c) => c.id === componentId);
		if (component && component.type === 'MCQ_OPTIONS' && component.config.options) {
			component.config.options[idx] = value;
		}
	}

	// ✅ MCQ option qo'shish (yangilangan)
	function addOption(componentId: number) {
		const component = components.find((c) => c.id === componentId);
		if (component && component.type === 'MCQ_OPTIONS' && component.config.options) {
			const nextLetter = String.fromCharCode(65 + component.config.options.length);
			component.config.options.push(`${nextLetter}) `);
		}
	}

	// ✅ MCQ option o'chirish (yangilangan - correctAnswer ni ham tozalaydi)
	function removeOption(componentId: string, optionIndex: number) {
		const component = components.find((c) => c.id == Number(componentId));
		if (component && component.type === 'MCQ_OPTIONS' && component.config.options) {
			// Kamida 2 ta option qolishi kerak
			if (component.config.options.length > 2) {
				const removedOption = component.config.options[optionIndex];
				component.config.options.splice(optionIndex, 1);
				
				// ✅ O'chirilgan option to'g'ri javob bo'lsa, uni correctAnswer dan olib tashlash
				if (component.config.multiSelect && Array.isArray(component.config.correctAnswer)) {
					// Multi-select: array dan o'chirish
					component.config.correctAnswer = component.config.correctAnswer.filter(
						(ans: string) => ans !== removedOption
					) as any;
				} else if (component.config.correctAnswer === removedOption) {
					// Single-select: bo'sh qilish
					component.config.correctAnswer = '';
				}
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