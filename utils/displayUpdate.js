import { resultHandlers, operators } from './global.js';

const formulaDisplay = document.querySelector('.cal-ipt'); // 입력창
const resultDisplay = document.querySelector('.result'); // 결과창

// 수식 입력 예외처리와 예외처리를 모두 통과한 수식은 토큰화 리턴
export function currentInput(value) {
    const currentInput = formulaDisplay.textContent;
    const tokens = currentInput.match(/\d+(\.\d+)?|\D/g) || []; // 빈 배열로 초기화
    console.log(tokens);
    // 예외처리 1. 첫 번째가 연산자일 경우
    if(tokens.length === 0 && operators.includes(value)) { 
        return; 
    }

    // 예외처리 2. 연산자가 연속으로 올 경우
    if(operators.includes(tokens[tokens.length-1]) && operators.includes(value)){
        return;
    }

    // 예외처리3. '=', 'del', 'C'는 수식에 입력 안함 
    if (!resultHandlers.includes(value)) {
        formulaDisplay.textContent += value; // valid한 경우에만 textContent에 추가
    }

    // 마지막으로 tokens 반환
    return tokens;
}

// 수식 결과
export function updateDisplay(value) {
    let displayValue;

    // 15자리 이상이면 e 표기법으로 변환
      if (value >= 1e15) {
        displayValue = value.toExponential(0); // 소수점 없이 e 표기법으로 변환
    } else {
        // 자연수인 경우, 소수점이 있는 경우에 따라 처리
        displayValue = value % 1 !== 0 ? parseFloat(value.toFixed(14)) : value;
    }
    // 결과창에 표시
    resultDisplay.textContent = displayValue;
}


// 입력 및 결과 초기화
export function clearDisplay() {
    formulaDisplay.textContent = '';
    resultDisplay.textContent = '';  
}

// 한글자 씩 지우기
export function deleteSingleDisplay(){
    const currentInput = formulaDisplay.textContent;
    if (currentInput.length > 0) {
        formulaDisplay.textContent = currentInput.slice(0, -1); // 마지막 글자 삭제
    }
}

export function percentDisplay() {
    const currentInputValue = formulaDisplay.textContent;
    const tokens = currentInputValue.match(/\d+(\.\d+)?|\D/g) || [];
    
    if (tokens.length === 0) return; // 입력된 값이 없으면 리턴

    // 마지막 입력된 값이 숫자인지 확인
    const lastToken = tokens[tokens.length - 1];
    if (!isNaN(lastToken)) { // 숫자인 경우에만 백분율 계산
        const percentageValue = parseFloat(lastToken) * 0.01;
        
        // 마지막 숫자를 백분율 값으로 대체하여 표시
        tokens[tokens.length - 1] = percentageValue;
        formulaDisplay.textContent = tokens.join(''); // 업데이트된 수식 표시
    }
}



