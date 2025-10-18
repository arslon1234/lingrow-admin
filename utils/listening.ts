export const IELTS_LISTENING_QUESTION_TYPES = [
	{
		key: 'multipleChoice',
		name: 'Multiple Choice',
		description: 'Listen to the audio and choose the correct answer from several options (A, B, C...).'
	},
	{
		key: 'matching',
		name: 'Matching',
		description: 'Match a list of items from the recording to a list of options given on the question paper.'
	},
	{
		key: 'planLabelling',
		name: 'Plan Labelling',
		description: 'Label parts of a plan based on the information you hear.'
	},
	{
		key: 'mapLabelling',
		name: 'Map Labelling',
		description: 'Label locations or areas on a map using clues from the recording.'
	},
	{
		key: 'diagramLabelling',
		name: 'Diagram Labelling',
		description: 'Label a diagram based on the details mentioned in the recording.'
	},
	{
		key: 'formCompletion',
		name: 'Form Completion',
		description: 'Fill in missing information in a form using words from the audio.'
	},
	{
		key: 'noteCompletion',
		name: 'Note Completion',
		description: 'Complete notes with missing words or phrases heard in the recording.'
	},
	{
		key: 'tableCompletion',
		name: 'Table Completion',
		description: 'Fill in missing data in a table format using information from the recording.'
	},
	{
		key: 'flowChartCompletion',
		name: 'Flow-chart Completion',
		description: 'Complete a flow chart to show a process or sequence described in the audio.'
	},
	{
		key: 'summaryCompletion',
		name: 'Summary Completion',
		description: 'Complete a summary of the listening passage using words from the recording.'
	},
	{
		key: 'sentenceCompletion',
		name: 'Sentence Completion',
		description: 'Complete sentences with missing words you hear in the audio.'
	},
	{
		key: 'shortAnswerQuestions',
		name: 'Short Answer Questions',
		description: 'Answer questions using a limited number of words from the recording.'
	},
	{
		key: 'classification',
		name: 'Classification',
		description: 'Classify items into categories according to the information you hear.'
	},
	{
		key: 'labeling',
		name: 'Labeling',
		description: 'Label parts of a diagram, image, or structure mentioned in the recording.'
	}
];

export const availableComponents = {
	TEXT: ['HEADER', 'SUBHEADER', 'PARAGRAPH', 'TEXT_LINE', 'INSTRUCTION_BOX'],
	INPUT: ['INPUT_LINE', 'INPUT_INLINE', 'MCQ_OPTIONS'],
	MEDIA: ['IMAGE', 'MAP'],
	STRUCTURE: ['TABLE_GRID', 'NUMBERED_LIST', 'BULLET_LIST']
};

export const defaults: Record<string, ComponentConfig> = {
	HEADER: { text: 'Heading', level: 3 },
	SUBHEADER: { text: 'Subheading' },
	PARAGRAPH: { text: 'Enter paragraph text...' },
	TEXT_LINE: { text: 'Text line' },
	INPUT_LINE: { label: 'Question 1', placeholder: 'Answer', maxLength: 50 },
	INPUT_INLINE: { beforeText: 'The answer is', afterText: 'here', placeholder: '___' },
	MCQ_OPTIONS: { options: ['Option A', 'Option B', 'Option C', 'Option D'], multiSelect: false },
	IMAGE: { url: '', alt: '', caption: '' },
	MAP: { url: '', hotspots: [] },
	TABLE_GRID: { rows: 3, columns: 3, headers: [] },
	INSTRUCTION_BOX: { text: 'Instructions go here', variant: 'info' },
	NUMBERED_LIST: { items: ['Item 1', 'Item 2'] },
	BULLET_LIST: { items: ['Point 1', 'Point 2'] }
};
