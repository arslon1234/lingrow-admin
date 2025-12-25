// formatters/listening/input-inline.ts

/**
 * Format INPUT_INLINE component (can have multiple blanks)
 * Returns array of backend components (one per blank)
 */
export function formatInputInlineComponent(
  component: Component, 
  startDisplayOrder: number
): BackendComponent[] {
  const blanks = component.config.blanks || [];
  
  // If no blanks configured, return single component (fallback)
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
  
  // Multiple blanks: create separate component for each blank
  return blanks.map((blank: any, index: number) => ({
    type: 'INPUT_INLINE',
    displayOrder: startDisplayOrder + index,
    questionNumber: blank.questionNumber || null,
    correctAnswers: [
      blank.correctAnswer,
      ...(blank.alternativeAnswers || [])
    ].filter((ans: string) => ans && ans.trim() !== ''), // Remove empty values
    data: {
      text: component.config.text || '',
      blankIndex: index, // Track which blank this is
      placeholder: blank.placeholder || '___',
      // Optional: Include formatting metadata
      hasLineBreaks: (component.config.text || '').includes('\n'),
      hasParagraphBreaks: (component.config.text || '').includes('[p]')
    }
  }));
}