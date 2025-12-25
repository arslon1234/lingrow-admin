// store/formatters/form-completion.formatter.ts
import { formatDefaultComponents } from '../base';

/**
 * FORM_COMPLETION question type formatter
 * Uses default formatting logic
 */
export function formatFormCompletionComponents(components: Component[]): BackendComponent[] {
  return formatDefaultComponents(components);
}



// // store/formatters/form-completion.formatter.ts
// import type { Component, BackendComponent } from '~/store/types/listening.types';
// import { formatDefaultComponent } from './base';
// import { formatInputInlineComponent } from './helpers/input-inline.helper';

// /**
//  * FORM_COMPLETION question type formatter
//  * Handles INPUT_INLINE components with multiple blanks
//  */
// export function formatFormCompletionComponents(components: Component[]): BackendComponent[] {
//   const backendComponents: BackendComponent[] = [];
//   let displayOrder = 1;

//   components.forEach(component => {
//     if (component.type === 'INPUT_INLINE') {
//       // INPUT_INLINE can expand to multiple components
//       const inlineComponents = formatInputInlineComponent(component, displayOrder);
//       backendComponents.push(...inlineComponents);
//       displayOrder += inlineComponents.length;
      
//     } else if (component.type === 'INPUT_LINE') {
//       // INPUT_LINE stays as single component
//       backendComponents.push({
//         type: 'INPUT_LINE',
//         displayOrder: displayOrder++,
//         questionNumber: component.config.questionNumber || null,
//         correctAnswers: component.config.correctAnswer 
//           ? [component.config.correctAnswer] 
//           : [],
//         data: {
//           label: component.config.label || '',
//           placeholder: component.config.placeholder || '',
//           maxLength: component.config.maxLength || 50
//         }
//       });
      
//     } else {
//       // Other components (HEADER, INSTRUCTION_BOX, etc.) use default formatting
//       backendComponents.push({
//         ...formatDefaultComponent(component, displayOrder - 1),
//         displayOrder: displayOrder++
//       });
//     }
//   });

//   return backendComponents;
// }