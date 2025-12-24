// store/formatters/index.ts
import { formatDefaultComponents } from '../base';
import { formatMatchingComponents } from './matching';
// import { formatFormCompletionComponents } from './form-completion.formatter';
import { formatMultipleChoiceComponents } from './mcq-options';
import { formatFormCompletionComponents } from './summary-completion';

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
  MULTIPLE_CHOICE_GROUPED: formatMultipleChoiceComponents,
  SUMMARY_COMPLETION: formatFormCompletionComponents
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
export * from '../base';
export * from './matching';
export * from './mcq-options';
export * from './form-completion';