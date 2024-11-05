import { currentInput, updateDisplay, clearDisplay, deleteSingleDisplay,percentDisplay } from './displayUpdate.js'; // updateDisplay도 import
import { calculate } from './calculate.js';

const buttons = document.querySelectorAll(".cal-btn");

const handleButtonClick = (event) => {
    const value = event.currentTarget.value;
    
    if (value === '=') {
        const tokens = currentInput(value); // 입력된 수식 토큰화해서 가져오기
        const result = calculate(tokens); // 수식 계산
        if (result !== undefined) { // result가 undefined가 아닐 때만 updateDisplay 실행
            updateDisplay(result); // 계산 결과 표시
        }
    } else if (value === 'C') {
        clearDisplay(); // Clear 버튼을 누르면 디스플레이 초기화
    } else if (value === 'del'){
        deleteSingleDisplay();
    } else if (value === '%'){
        percentDisplay();
    } else {
        currentInput(value); // 새 값으로 디스플레이 업데이트
    }
};

for (const button of buttons) {
    button.addEventListener('click', handleButtonClick);
}
