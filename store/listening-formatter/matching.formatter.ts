// store/formatters/matching.formatter.ts
/**
 * MATCHING question type formatter
 * Converts 1 MATCHING component -> MATCHING_OPTIONS + multiple MATCHING_ITEMs
 */
export function formatMatchingComponents(components: Component[]): BackendComponent[] {
  const backendComponents: BackendComponent[] = [];
  let displayOrder = 1;

  components.forEach(component => {
    if (component.type === 'MATCHING') {
      // 1. Create MATCHING_OPTIONS component
      backendComponents.push({
        type: 'ADVANCED_OPTIONS_LIST',
        displayOrder: displayOrder++,
        
        questionNumber: null,
        correctAnswers: [],
        data: {
          questionText: component.config.questionText || '',
          questionInstruction: component.config.instruction || '',
          title: component.config.optionsTitle || 'Options',
          options: (component.config.matchingOptions || []).map((opt: any) => ({
            label: opt.id,
            text: opt.text
          })),
          displayStyle: component.config.displayStyle,
        }
      });

      // 2. Create MATCHING_ITEM for each item
      const startNumber = component.config.startNumber || 1;
      (component.config.matchingItems || []).forEach((item: any, index: number) => {
        backendComponents.push({
          type: 'MATCHING_ITEM',
          displayOrder: displayOrder++,
          questionNumber: startNumber + index,
          correctAnswers: item.correctAnswer ? [item.correctAnswer] : [],
          data: {
            text: item.text || ''
          }
        });
      });
    } else {
      // Other component types in MATCHING question
      backendComponents.push({
        type: component.type,
        displayOrder: displayOrder++,
        questionNumber: component.config.questionNumber || null,
        correctAnswers: component.config.correctAnswer ? [component.config.correctAnswer] : [],
        data: formatMatchingComponentData(component)
      });
    }
  });

  return backendComponents;
}

function formatMatchingComponentData(component: Component): Record<string, any> {
  const { correctAnswer, questionNumber, matchingOptions, matchingItems, ...otherConfig } = component.config;
  return otherConfig;
}