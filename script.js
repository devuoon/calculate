const inputField = document.querySelector(".cal-ipt");
const resultField = document.querySelector(".result");
const buttons = document.querySelectorAll(".cal-btn");

let currentInput = ""; // 현재 입력 값
let openParenthesisCount = 0; // 열린 괄호의 수

// 이벤트 핸들러 설정
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

// 버튼 클릭 이벤트 처리
function handleButtonClick(event) {
  const btnEvent = event.target;
  const value = event.target.textContent;
  const realValue = event.target.value;
  // 버튼의 클래스가 연산자인지 판별
  const isCurrentOperator = btnEvent.classList.contains("operator");
  // 마지막 입력
  const lastChar = currentInput.slice(-1);
  // 마지막 입력이 연산자인지 판별
  const isLastCharOperator = /[+\-*/%]/.test(lastChar);
  // 마지막 입력이 . 인지 판별
  const isLastDecimalPoint = lastChar === ".";

  if (value === "C") {
    clearInput();
  } else if (value === "=") {
    if ((isLastCharOperator && isCurrentOperator) || isLastDecimalPoint) {
      return; // 연산자가 연속으로 입력되는 것을 막음
    } else {
      displayResult(calculate(currentInput));
    }
  } else if (realValue === "del") {
    currentInput = currentInput.slice(0, -1); // 마지막 문자 삭제
    inputField.value = currentInput; // inputField 업데이트
  } else if (value === "%") {
    const match = currentInput.match(/(\d+(\.\d+)?)$/);
    if (match) {
      const lastNumber = match[0];
      const percentValue = Number(lastNumber) * 0.01;
      currentInput = currentInput.slice(0, -lastNumber.length) + percentValue;
      inputField.value = currentInput;
    }
  } else if (value === "()") {
    handleParenthesis();
  } else {
    if (currentInput === "" && isCurrentOperator) {
      return;
    }
    if (isLastCharOperator && isCurrentOperator) {
      return;
    }
    if (isLastDecimalPoint && value === ".") {
      return;
    }
    if (isLastCharOperator) {
      inputField.style.color = "red"; // 전체 입력창 텍스트 색상 변경
    } else {
      inputField.style.color = "black"; // 다른 경우에는 기본 색상
    }

    updateInput(value);
    console.log(currentInput);
  }
}

// 괄호 토글 기능 추가
function handleParenthesis() {
  const lastChar = currentInput.slice(-1);
  if (openParenthesisCount > 0 && !/[+\-*/(]/.test(lastChar)) {
    currentInput += ")";
    openParenthesisCount--;
  } else {
    currentInput += "(";
    openParenthesisCount++;
  }
  inputField.value = currentInput;
}

// 입력값을 업데이트하고 UI 갱신
function updateInput(value) {
  currentInput += value;
  inputField.value = currentInput;
  resultField.textContent = ""; // 결과 초기화
}

// 입력값과 결과를 초기화
function clearInput() {
  currentInput = "";
  openParenthesisCount = 0;
  inputField.value = currentInput;
  resultField.textContent = "";
}

// 결과를 화면에 표시
function displayResult(result) {
  resultField.textContent = result;
  currentInput = ""; // 입력값 초기화
}

// 계산 로직 수행
function calculate(expression) {
  try {
    const result = Function(`return ${expression}`)();
    return decimalCalculate(result);
  } catch (error) {
    console.error("Invalid Expression");
    return "Error";
  }
}

// 소수점 자릿수를 13자리로 제한하는 함수
function decimalCalculate(result) {
  if (result % 1 !== 0) {
    return parseFloat(result.toFixed(13));
  }
  return result;
}
