import { useAxios } from '~/api';
import { ApiUrls } from '~/api/apis';
import { addSuccess } from '~/helpers/notification';
import { getFormatterForType } from './listening-formatter';
import { detectMCQQuestionType } from './listening-formatter/mcq-options.formatter';
export const useListeningStore = defineStore('listening', () => {
	const components = reactive<Component[]>([]);
	const previewMode = ref(false);
	const questionType = ref('MULTIPLE_CHOICE');

	// Question type metadata storage
	const questionTypeMetadata = reactive<Map<string, QuestionTypeMetadata>>(new Map());

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
		// Auto-assign current questionType if not provided
		if (!component.questionType) {
			component.questionType = questionType.value;
		}
		components.push(component);
	}

	function deleteComponent(id: number) {
		const index = components.findIndex((c) => c.id === id);
		if (index !== -1) {
			components.splice(index, 1);
		}
	}

	function updateComponent(id: number, config: any) {
		const index = components.findIndex((c) => c.id === id);
		if (index !== -1) {
			components[index].config = config;
		}
	}

	function updateOption(componentId: number, idx: number, value: string) {
		const component = components.find((c) => c.id === componentId);
		if (component && component.type === 'MCQ_OPTIONS' && component.config.options) {
			component.config.options[idx] = value;
		}
	}

	function addOption(componentId: number) {
		const component = components.find((c) => c.id === componentId);
		if (component && component.type === 'MCQ_OPTIONS' && component.config.options) {
			const nextLetter = String.fromCharCode(65 + component.config.options.length);
			component.config.options.push(`${nextLetter}) `);
		}
	}

	function removeOption(componentId: string, optionIndex: number) {
		const component = components.find((c) => c.id == Number(componentId));
		if (component && component.type === 'MCQ_OPTIONS' && component.config.options) {
			if (component.config.options.length > 2) {
				const removedOption = component.config.options[optionIndex];
				component.config.options.splice(optionIndex, 1);

				if (component.config.multiSelect && Array.isArray(component.config.correctAnswer)) {
					component.config.correctAnswer = component.config.correctAnswer.filter((ans: string) => ans !== removedOption) as any;
				} else if (component.config.correctAnswer === removedOption) {
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

	// Set question type metadata (start/end numbers)
	function setQuestionTypeMetadata(type: string, startNumber: number, endNumber: number) {
		questionTypeMetadata.set(type, {
			startingQuestionNumber: startNumber,
			endingQuestionNumber: endNumber
		});
	}

	// Get question type metadata or calculate from components
	function getQuestionTypeMetadata(type: string): QuestionTypeMetadata {
		if (questionTypeMetadata.has(type)) {
			return questionTypeMetadata.get(type)!;
		}

		// Auto-calculate from components if not set
		const typeComponents = components.filter((c) => c.questionType === type);
		const questionNumbers = typeComponents.filter((c) => c.config.questionNumber).map((c) => c.config.questionNumber!);

		if (questionNumbers.length > 0) {
			return {
				startingQuestionNumber: Math.min(...questionNumbers),
				endingQuestionNumber: Math.max(...questionNumbers)
			};
		}

		return {
			startingQuestionNumber: 1,
			endingQuestionNumber: 1
		};
	}

	function transformToBackendFormat(): BackendQuestionData {
    const groupedByType = new Map<string, Component[]>();
    
    // Group components by question type
    components.forEach(component => {
      const type = component.questionType || questionType.value;
      if (!groupedByType.has(type)) {
        groupedByType.set(type, []);
      }
      groupedByType.get(type)!.push(component);
    });

    // Transform each question type using its specific formatter
    const questionTypes: BackendQuestionType[] = [];
    let displayOrder = 1;

    groupedByType.forEach((typeComponents, type) => {
      const metadata = getQuestionTypeMetadata(type);
      
      // 🔥 KEY CHANGE: Detect actual question type for MCQ
      let finalQuestionType = type;
      if (type === 'MULTIPLE_CHOICE') {
        finalQuestionType = detectMCQQuestionType(typeComponents);
      }
      
      // Get the appropriate formatter
      const formatter = getFormatterForType(type);
      const transformedComponents = formatter(typeComponents);

      questionTypes.push({
        type: finalQuestionType, // ✅ Use detected type
        displayOrder: displayOrder++,
        startingQuestionNumber: metadata.startingQuestionNumber,
        endingQuestionNumber: metadata.endingQuestionNumber,
        components: transformedComponents
      });
    });

    return { questionTypes };
  }

	async function saveQuestion(baseData: MaterialTestSectionRequestBase) {
		try {
			const formattedData = transformToBackendFormat();
			const pendingData = {...formattedData, ...baseData}
			// API call
			const result = await useAxios().postRequest(ApiUrls.TEST_SECTIONS, pendingData);
			console.log(result)
			// if (result.status === 200) {
			// 	addSuccess('Question saved successfully');
			// }

			
		} catch (error) {
			console.error('Error saving question:', error);
			throw error;
		}
	}

	return {
		// REACTIVE VALUES
		previewMode,
		questionType,
		components,
		questionTypeMetadata,

		// FUNCTIONS
		getDefaultConfig,
		addComponent,
		deleteComponent,
		moveComponent,
		updateComponent,
		updateOption,
		addOption,
		removeOption,
		setQuestionTypeMetadata,
		getQuestionTypeMetadata,
		transformToBackendFormat,
		saveQuestion,

		// API REQUESTS
		audioUpload
	};
});

// Type definitions - add to your global types file
