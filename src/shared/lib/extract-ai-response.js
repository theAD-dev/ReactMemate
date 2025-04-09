/**
 * Extracts JSON data from AI response string
 * @param {string} aiResponseString - The AI response string containing JSON data
 * @returns {Object|null} - Parsed JSON object or null if extraction fails
 */
export const extractAIResponseData = (aiResponseString) => {
  try {
    // Check if the input is already an object
    if (typeof aiResponseString === 'object' && aiResponseString !== null) {
      // If it's an array with the specific structure from the AI response
      if (Array.isArray(aiResponseString) && aiResponseString.length > 0 && Array.isArray(aiResponseString[0])) {
        // Find the text entry in the array
        const textEntry = aiResponseString[0].find(entry => entry[0] === 'text');
        if (textEntry && textEntry[1]) {
          aiResponseString = textEntry[1];
        }
      } else {
        // If it's already a valid object, return it
        return aiResponseString;
      }
    }

    // If it's a string, extract the JSON part
    if (typeof aiResponseString === 'string') {
      // Look for JSON pattern between triple backticks
      const jsonMatch = aiResponseString.match(/```json\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Try to find JSON without the markdown formatting
      const jsonStart = aiResponseString.indexOf('{');
      const jsonEnd = aiResponseString.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = aiResponseString.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting AI response data:', error);
    return null;
  }
};

/**
 * Formats the AI response data for the expenses form
 * @param {Object} data - The extracted AI response data
 * @returns {Object} - Formatted data for the expenses form
 */
export const formatExpenseDataFromAI = (data) => {
  if (!data) return null;
  
  // Parse the amount from the total_amount field
  let amount = "0.00";
  if (data.total_amount) {
    // Remove currency symbol and commas
    amount = data.total_amount.replace(/[A-Za-z$,]/g, '').trim();
  }
  
  // Determine GST calculation type based on gst_included
  let gstCalculation = 'no'; // Default to No GST
  if (data.gst_included === true) {
    gstCalculation = 'in'; // GST Inclusive
  } else if (data.gst_included === false) {
    gstCalculation = 'ex'; // GST Exclusive
  }
  
  // Calculate GST amounts
  const amountValue = parseFloat(amount) || 0;
  let subtotal = amountValue;
  let tax = 0;
  
  if (gstCalculation === 'in') {
    tax = amountValue * 0.10 / 1.10;
    subtotal = amountValue - tax;
  } else if (gstCalculation === 'ex') {
    tax = subtotal * 0.10;
  }
  
  // Format the due date if available
  let dueDate = null;
  if (data.due_date) {
    try {
      dueDate = new Date(data.due_date);
    } catch (e) {
      console.error('Error parsing due date:', e);
    }
  }
  
  return {
    invoice_reference: data.invoice_number || '',
    amount: amountValue.toFixed(2),
    'gst-calculation': gstCalculation,
    gst: gstCalculation === 'ex',
    nogst: gstCalculation === 'no',
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    totalAmount: (subtotal + tax).toFixed(2),
    note: data.description || '',
    due_date: dueDate,
    date: new Date(), // Default to current date
  };
};
