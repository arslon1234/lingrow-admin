// store/formatters/index.ts
import { formatDefaultComponents } from './base';
import { formatMatchingComponents } from './matching.formatter';
import { formatFormCompletionComponents } from './form-completion.formatter';
import { formatMultipleChoiceComponents } from './mcq-options.formatter';


/**
 * Component formatter function type
 */
export type ComponentFormatter = (components: Component[]) => BackendComponent[];

/**
 * Registry of formatters for each question type
 */
export const questionTypeFormatters: Record<string, ComponentFormatter> = {
  MATCHING: formatMatchingComponents,
  FORM_COMPLETION: formatFormCompletionComponents,
  NOTE_COMPLETION: formatDefaultComponents,
  TABLE_COMPLETION: formatDefaultComponents,
  SENTENCE_COMPLETION: formatDefaultComponents,
  MULTIPLE_CHOICE: formatMultipleChoiceComponents,
  MULTIPLE_CHOICE_GROUPED: formatMultipleChoiceComponents
  // ... boshqa typelar uchun default formatter yoki maxsus formatter
};

/**
 * Get formatter for specific question type
 */
export function getFormatterForType(type: string): ComponentFormatter {
  return questionTypeFormatters[type] || formatDefaultComponents;
}

/**
 * Export all formatters
 */
export * from './base';
export * from './matching.formatter';
// export * from './multiple-choice.formatter';
export * from './form-completion.formatter';