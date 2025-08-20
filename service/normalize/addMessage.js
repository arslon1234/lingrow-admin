export function addErrorMessage(event, errorTitle = 'Default Error Title', ...messages) {
  event.messageType = "error";
  event.errorMessages = event.errorMessages || [];
  
  // Use for...of to iterate over messages
  for (const msg of messages) {
    if (!event.errorMessages.includes(msg)) { // Avoid duplicates
      event.errorMessages.push(msg);
    }
  }
  
  event.errorTitles = event.errorTitles || [];
  if (!event.errorTitles.includes(errorTitle)) { // Avoid duplicates
    event.errorTitles.push(errorTitle);
  }
}

export function addWarningMessage(event, warningTitle = 'Default Warning Title', ...messages) {
  if (event.messageType !== "error") { // Ensure warnings don't overwrite errors
    event.messageType = "warning";
  }
  
  event.warningMessages = event.warningMessages || [];
  
  // Use for...of to iterate over messages
  for (const msg of messages) {
    if (!event.warningMessages.includes(msg)) { // Avoid duplicates
      event.warningMessages.push(msg);
    }
  }
  
  event.warningTitles = event.warningTitles || [];
  if (!event.warningTitles.includes(warningTitle)) { // Avoid duplicates
    event.warningTitles.push(warningTitle);
  }
}
