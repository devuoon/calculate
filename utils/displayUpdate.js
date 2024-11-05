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

// 백분율 계산하기
export function percentDisplay(value) {
    const tokens = currentInput(value); // 현재 입력값의 토큰을 가져옴
    let lastToken = tokens[tokens.length - 1]; // 마지막 토큰 가져옴

    // 마지막 토큰이 숫자인지 확인 (문자열을 숫자로 변환 후 확인)
    const lastTokenNumber = parseFloat(lastToken);
    if (!isNaN(lastTokenNumber)) {
        const percent = lastTokenNumber * 0.01; // 백분율 계산
        console.log(percent);

        // 마지막 토큰을 백분율 값으로 교체
        tokens[tokens.length - 1] = percent; // 배열에서 마지막 토큰 업데이트
        
        // 업데이트된 값을 입력창에 반영
        formulaDisplay.textContent = tokens.join(' '); // 모든 토큰을 문자열로 결합하여 입력창에 표시
    }
}
