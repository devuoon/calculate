const formulaDisplay = document.querySelector('.cal-ipt'); // 입력창
const resultDisplay = document.querySelector('.result'); // 결과창

export function currentInput(value) {
    console.log("value:", value);
    // 디스플레이 업데이트 로직
    formulaDisplay.textContent += value;
    const currentInput = formulaDisplay.textContent;
    
    // // 숫자와 연산자를 구분하기 위한 정규 표현식
    // const tokens = currentInput.match(/\d+|\D/g);
    // console.log(tokens);

    return currentInput;
}

// updateDisplay 함수는 수식 입력 또는 결과를 업데이트합니다.
export function updateDisplay(value) {
     // 결과창에 표시할 경우
     resultDisplay.textContent = value;
}

// 초기화 함수 (optional): 입력과 결과를 초기화할 때 사용할 수 있습니다.
export function clearDisplay() {
    formulaDisplay.textContent = '';
    resultDisplay.textContent = '';
}