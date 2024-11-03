import { currentInput, updateDisplay, clearDisplay } from './displayUpdate.js'; // updateDisplay도 import
import { calculate } from './calculate.js';
import { operators } from './global.js';

const buttons = document.querySelectorAll(".cal-btn");

const handleButtonClick = (event) => {
    const value = event.target.value;

    if (value === '=') {
        const current = currentInput(); // 현재 수식
        const tokens = current.match(/\d+|\D/g); // 수식 토큰화
        const result = calculate(tokens); // 수식 계산
        updateDisplay(result); // 계산 결과 표시
    } else if(value === 'C'){
        clearDisplay();
    }else {
        currentInput(value); // 새 값으로 디스플레이 업데이트
    }
}

for (const button of buttons) {
    button.addEventListener('click', handleButtonClick);
}
