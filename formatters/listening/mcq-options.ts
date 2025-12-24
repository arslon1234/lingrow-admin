// store/formatters/multiple-choice.formatter.ts
import { formatDefaultComponent } from '../base';

/**
 * MULTIPLE_CHOICE question type formatter
 * Handles both single and grouped (multi-select) MCQ formats
 */
export function formatMultipleChoiceComponents(components: Component[]): BackendComponent[] {
  const backendComponents: BackendComponent[] = [];
  let displayOrder = 1;

  components.forEach(component => {
    // Handle MCQ_OPTIONS component
    if (component.type === 'MCQ_OPTIONS') {
      const isGrouped = component.config.multiSelect === true;

      if (isGrouped) {
        // GROUPED MCQ: Split into MCQ_GROUPED_OPTION components
        backendComponents.push(...formatGroupedMCQ({...component, type: "MULTIPLE_CHOICE_GROUPED"}, displayOrder));
        displayOrder += (component.config.options?.length || 1);
      } else {
        // SINGLE MCQ: Keep as MCQ_OPTIONS
        backendComponents.push(formatSingleMCQ(component, displayOrder));
        displayOrder++;
      }
    } else {
      // Other components (HEADER, INSTRUCTION_BOX, etc.)
      backendComponents.push({
        ...formatDefaultComponent(component, displayOrder - 1),
        displayOrder: displayOrder++
      });
    }
  });

  return backendComponents;
}

/**
 * Format Single Answer MCQ
 */
function formatSingleMCQ(component: Component, displayOrder: number): BackendComponent {
  const options = (component.config.options || []).map((optionText: string, idx: number) => ({
    label: String.fromCharCode(65 + idx), // A, B, C, D...
    text: optionText.trim()
  }));

  // Get correct answer letter (find which option is correct)
  const correctAnswerText = component.config.correctAnswer;
  const correctAnswerLetter = getCorrectAnswerLetter(
    correctAnswerText!, 
    component.config.options || []
  );

  return {
    type: 'MCQ_OPTIONS',
    displayOrder,
    questionNumber: component.config.questionNumber || null,
    correctAnswers: correctAnswerLetter ? [correctAnswerLetter] : [],
    data: {
      questionText: component.config.questionText || '',
      options,
      multipleSelect: false
    }
  };
}

/**
 * Format Grouped MCQ (Multi-select)
 * Returns array of MCQ_GROUPED_OPTION components
*/

export function detectMCQQuestionType(components: Component[]): 'MULTIPLE_CHOICE' | 'MULTIPLE_CHOICE_GROUPED' {
  const hasGroupedMCQ = components.some(c => 
    c.type === 'MCQ_OPTIONS' && c.config.multiSelect === true
  );
  
  return hasGroupedMCQ ? 'MULTIPLE_CHOICE_GROUPED' : 'MULTIPLE_CHOICE';
}

function formatGroupedMCQ(component: Component, startDisplayOrder: number): BackendComponent[] {
  const options = component.config.options || [];
  const correctAnswers: string[] = Array.isArray(component.config.correctAnswer) 
    ? component.config.correctAnswer 
    : [];
  
  const startQuestionNumber = component.config.questionNumber || 1;
  const endQuestionNumber = component.config.questionNumberEnd || startQuestionNumber;
  
  // Calculate how many correct answers are needed
  const expectedAnswerCount = endQuestionNumber - startQuestionNumber + 1;
  
  // Create MCQ_GROUPED_OPTION for each option
  return options.map((optionText: string, idx: number) => {
    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D...
    const isCorrect = correctAnswers.includes(optionText);
    
    // Assign question number only to correct answers
    let questionNumber = null;
    let correctAnswersArray: string[] = [];
    
    if (isCorrect) {
      const correctIndex = correctAnswers.indexOf(optionText);
      if (correctIndex < expectedAnswerCount) {
        questionNumber = startQuestionNumber + correctIndex;
        correctAnswersArray = [optionLetter];
      }
    }

    return {
      type: 'MCQ_GROUPED_OPTION',
      displayOrder: startDisplayOrder + idx,
      questionNumber,
      correctAnswers: correctAnswersArray,
      data: {
        label: optionLetter,
        text: optionText.trim()
      }
    };
  });
}

/**
 * Helper: Get correct answer letter from option text
 */
function getCorrectAnswerLetter(correctAnswerText: string, options: string[]): string | null {
  if (!correctAnswerText) return null;
  
  const index = options.indexOf(correctAnswerText);
  if (index === -1) return null;
  
  return String.fromCharCode(65 + index); // A, B, C, D...
}

/**
 * Validate MCQ component configuration
 */
export function validateMCQComponent(component: Component): string[] {
  const errors: string[] = [];
  
  if (!component.config.options || component.config.options.length < 2) {
    errors.push('At least 2 options required');
  }
  
  if (component.config.multiSelect) {
    const expectedCount = (component.config.questionNumberEnd || component.config.questionNumber || 1) 
      - (component.config.questionNumber || 1) + 1;
    const actualCount = Array.isArray(component.config.correctAnswer) 
      ? component.config.correctAnswer.length 
      : 0;
    
    if (actualCount !== expectedCount) {
      errors.push(`Expected ${expectedCount} correct answers, but got ${actualCount}`);
    }
  } else {
    if (!component.config.correctAnswer) {
      errors.push('Correct answer is required');
    }
  }
  
  return errors;
}