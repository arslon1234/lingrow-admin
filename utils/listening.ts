export const IELTS_LISTENING_QUESTION_TYPES = [
	{
		key: 'MULTIPLE_CHOICE',
		name: 'Multiple Choice',
		description: 'Listen to the audio and choose the correct answer from several options (A, B, C...).'
	},
	{
		key: 'MATCHING',
		name: 'Matching',
		description: 'Match a list of items from the recording to a list of options given on the question paper.'
	},
	{
		key: 'PLAN_LABELLING',
		name: 'Plan Labelling',
		description: 'Label parts of a plan based on the information you hear.'
	},
	{
		key: 'MAP_LABELLING',
		name: 'Map Labelling',
		description: 'Label locations or areas on a map using clues from the recording.'
	},
	{
		key: 'DIAGRAM_LABELLING',
		name: 'Diagram Labelling',
		description: 'Label a diagram based on the details mentioned in the recording.'
	},
	{
		key: 'FORM_COMPLETION',
		name: 'Form Completion',
		description: 'Fill in missing information in a form using words from the audio.'
	},
	{
		key: 'NOTE_COMPLETION',
		name: 'Note Completion',
		description: 'Complete notes with missing words or phrases heard in the recording.'
	},
	{
		key: 'TABLE_COMPLETION',
		name: 'Table Completion',
		description: 'Fill in missing data in a table format using information from the recording.'
	},
	{
		key: 'FLOW_CHART_COMPLETION',
		name: 'Flow-chart Completion',
		description: 'Complete a flow chart to show a process or sequence described in the audio.'
	},
	{
		key: 'SUMMARY_COMPLETION',
		name: 'Summary Completion',
		description: 'Complete a summary of the listening passage using words from the recording.'
	},
	{
		key: 'SENTENCE_COMPLETION',
		name: 'Sentence Completion',
		description: 'Complete sentences with missing words you hear in the audio.'
	},
	{
		key: 'SHORT_ANSWER_QUESTIONS',
		name: 'Short Answer Questions',
		description: 'Answer questions using a limited number of words from the recording.'
	},
	{
		key: 'CLASSIFICATION',
		name: 'Classification',
		description: 'Classify items into categories according to the information you hear.'
	},
	{
		key: 'LABELING',
		name: 'Labeling',
		description: 'Label parts of a diagram, image, or structure mentioned in the recording.'
	}
];

export const COMPONENT_CATEGORIES = {
	TEXT: ['HEADER', 'SUBHEADER', 'PARAGRAPH', 'TEXT_LINE', 'INSTRUCTION_BOX'],
	INPUT: ['INPUT_LINE', 'INPUT_INLINE', 'MCQ_OPTIONS'],
	MEDIA: ['IMAGE', 'MAP'],
	STRUCTURE: ['TABLE_GRID', 'NUMBERED_LIST', 'BULLET_LIST']
};

export const QUESTION_TYPE_COMPONENTS: Record<string, string[]> = {
	MULTIPLE_CHOICE: ['HEADER', 'SUBHEADER', 'PARAGRAPH', 'INSTRUCTION_BOX', 'MCQ_OPTIONS', 'IMAGE'],

	MATCHING: ['HEADER', 'SUBHEADER', 'INSTRUCTION_BOX', 'PARAGRAPH', 'TABLE_GRID', 'NUMBERED_LIST'],

	PLAN_LABELLING: ['HEADER', 'INSTRUCTION_BOX', 'IMAGE', 'INPUT_LINE', 'NUMBERED_LIST'],

	MAP_LABELLING: ['HEADER', 'INSTRUCTION_BOX', 'MAP', 'INPUT_LINE', 'NUMBERED_LIST'],

	DIAGRAM_LABELLING: ['HEADER', 'INSTRUCTION_BOX', 'IMAGE', 'INPUT_LINE', 'NUMBERED_LIST'],

	FORM_COMPLETION: ['HEADER', 'SUBHEADER', 'INSTRUCTION_BOX', 'TEXT_LINE', 'INPUT_LINE', 'TABLE_GRID'],

	NOTE_COMPLETION: ['HEADER', 'SUBHEADER', 'INSTRUCTION_BOX', 'PARAGRAPH', 'INPUT_INLINE', 'BULLET_LIST'],

	TABLE_COMPLETION: ['HEADER', 'INSTRUCTION_BOX', 'TABLE_GRID', 'INPUT_LINE'],

	FLOW_CHART_COMPLETION: ['HEADER', 'INSTRUCTION_BOX', 'IMAGE', 'INPUT_INLINE', 'TEXT_LINE'],

	SUMMARY_COMPLETION: ['HEADER', 'INSTRUCTION_BOX', 'PARAGRAPH', 'INPUT_INLINE'],

	SENTENCE_COMPLETION: ['HEADER', 'INSTRUCTION_BOX', 'INPUT_INLINE', 'NUMBERED_LIST', 'TEXT_LINE'],

	SHORT_ANSWER_QUESTIONS: ['HEADER', 'INSTRUCTION_BOX', 'INPUT_LINE', 'NUMBERED_LIST', 'PARAGRAPH'],

	CLASSIFICATION: ['HEADER', 'INSTRUCTION_BOX', 'TABLE_GRID', 'NUMBERED_LIST', 'MCQ_OPTIONS'],

	LABELING: ['HEADER', 'INSTRUCTION_BOX', 'IMAGE', 'MAP', 'INPUT_LINE', 'NUMBERED_LIST']
};
export const defaults: Record<string, ComponentConfig> = {
	HEADER: { text: 'Heading', level: 3 },
	SUBHEADER: { text: 'Subheading' },
	PARAGRAPH: { text: 'Enter paragraph text...' },
	TEXT_LINE: { text: 'Text line' },
	INPUT_LINE: { label: 'Question 1', placeholder: 'Answer', maxLength: 50 },
	INPUT_INLINE: { beforeText: 'The answer is', afterText: 'here', placeholder: '___', correctAnswer: '', questionNumber: 1 },
	MCQ_OPTIONS: { options: ['A) ', 'B) ', 'C) '], multiSelect: false, questionText: '', questionNumber: 1 },
	IMAGE: { url: '', alt: '', caption: '' },
	MAP: { url: '', hotspots: [] },
	TABLE_GRID: { rows: 3, columns: 3, headers: [] },
	INSTRUCTION_BOX: {
		text: 'Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.'
	},
	NUMBERED_LIST: { items: ['Item 1'] },
	BULLET_LIST: { items: ['Point 1'] }
};
