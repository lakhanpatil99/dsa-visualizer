/**
 * AlgoMania Operation Validator
 * Sanitizes and validates user input before mutating data structures.
 */

export class OperationValidator {
  static validateNumber(input, label = 'Value') {
    if (input == null || String(input).trim() === '') {
      return { isValid: false, error: `${label} cannot be empty.` };
    }
    const num = Number(input);
    if (isNaN(num)) {
      return { isValid: false, error: `${label} must be a valid number.` };
    }
    return { isValid: true, value: num };
  }

  static validateKey(key) {
    if (key == null || String(key).trim() === '') {
      return { isValid: false, error: 'Key cannot be blank.' };
    }
    return { isValid: true, key: String(key).trim() };
  }

  static validateIndex(index, maxIndex) {
    const res = this.validateNumber(index, 'Index');
    if (!res.isValid) return res;
    if (res.value < 0 || res.value > maxIndex) {
      return { isValid: false, error: `Index must be between 0 and ${maxIndex}.` };
    }
    return { isValid: true, index: Math.floor(res.value) };
  }
}

export default OperationValidator;
