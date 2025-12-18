// store/formatters/form-completion.formatter.ts
import { formatDefaultComponents } from './base';

/**
 * FORM_COMPLETION question type formatter
 * Uses default formatting logic
 */
export function formatFormCompletionComponents(components: Component[]): BackendComponent[] {
  return formatDefaultComponents(components);
}