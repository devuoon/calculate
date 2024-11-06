import { currentInput, updateDisplay, clearDisplay, deleteSingleDisplay, percentDisplay } from './displayUpdate.js';
import { calculate } from './calculate.js';
import { operators } from './global.js';

const buttons = document.querySelectorAll(".cal-btn");

const handleButtonClick = (event) => {
    const value = event.currentTarget.value;
    
    if (value === '=') {
        const tokens = currentInput(value);
        const result = calculate(tokens);
        if (result !== undefined) {
            updateDisplay(result);
        }
    } else if (value === 'C') {
        clearDisplay();
    } else if (value === 'del') {
        deleteSingleDisplay();
    } else if (value === '%') {
        percentDisplay();
    } else if (operators.includes(value)) { // [+,-,*,/] 연산자 클릭 처리
        currentInput(value);
    } else {
        currentInput(value);
    }
};

for (const button of buttons) {
    button.addEventListener('click', handleButtonClick);
}
