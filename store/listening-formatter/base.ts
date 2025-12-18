// store/formatters/base.ts

/**
 * Base formatter - default transformation logic
 */
export function formatDefaultComponent(component: Component, index: number): BackendComponent {
  return {
    type: component.type,
    displayOrder: index + 1,
    questionNumber: component.config.questionNumber || null,
    correctAnswers: formatCorrectAnswers(component),
    data: formatComponentData(component)
  };
}

/**
 * Helper: Convert correctAnswer to array format
 */
export function formatCorrectAnswers(component: Component): string[] {
  const answer = component.config.correctAnswer;
  
  if (!answer) return [];
  
  if (Array.isArray(answer)) {
    return answer;
  }
  
  return [String(answer)];
}

/**
 * Helper: Remove metadata from component config
 */
export function formatComponentData(component: Component): Record<string, any> {
  const { correctAnswer, questionNumber, ...otherConfig } = component.config;
  return otherConfig;
}

/**
 * Base formatter for most question types
 */
export function formatDefaultComponents(components: Component[]): BackendComponent[] {
  return components.map((component, index) => 
    formatDefaultComponent(component, index)
  );
}