
/**
 * Format INPUT_INLINE component (can have multiple blanks)
 * Returns array of backend components (one per blank)
 */
export function formatInputInlineComponent(
  component: Component, 
  startDisplayOrder: number
): BackendComponent[] {
  const blanks = component.config.blanks || [];
  
  // If no blanks configured, return single component
  if (blanks.length === 0) {
    return [{
      type: 'INPUT_INLINE',
      displayOrder: startDisplayOrder,
      questionNumber: component.config.questionNumber || null,
      correctAnswers: component.config.correctAnswer ? [component.config.correctAnswer] : [],
      data: {
        text: component.config.text || '',
        beforeText: component.config.beforeText || '',
        afterText: component.config.afterText || '',
        placeholder: component.config.placeholder || '___'
      }
    }];
  }
  
  // Multiple blanks: create separate component for each
  return blanks.map((blank: any, index: number) => ({
    type: 'INPUT_INLINE',
    displayOrder: startDisplayOrder + index,
    questionNumber: blank.questionNumber || null,
    correctAnswers: [
      blank.correctAnswer,
      ...(blank.alternativeAnswers || [])
    ].filter(Boolean),
    data: {
      text: component.config.text || '',
      blankIndex: index,
      placeholder: blank.placeholder || '___'
    }
  }));
}