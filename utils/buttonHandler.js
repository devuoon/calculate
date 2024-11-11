import {
  currentInput,
  updateDisplay,
  clearDisplay,
  deleteSingleDisplay,
  percentDisplay,
  parenthesesDisplay,
} from './displayUpdate.js';
import { calculate } from './calculate.js';

const buttons = document.querySelectorAll('.cal-btn');

const handleButtonClick = (event) => {
  const value = event.currentTarget.value;

  if (value === '=') {
    const tokens = currentInput(value); // currentInput 함수 호출
    if (tokens) {
      const result = calculate(tokens);
      console.log(result);
      if (result !== undefined) {
        updateDisplay(result);
      }
    }
  } else if (value === 'C') {
    clearDisplay();
  } else if (value === 'del') {
    deleteSingleDisplay();
  } else if (value === '%') {
    percentDisplay();
  } else if (value === '()') {
    parenthesesDisplay();
  } else {
    currentInput(value);
  }
};

for (const button of buttons) {
  button.addEventListener('click', handleButtonClick);
}
