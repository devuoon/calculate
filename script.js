const inputField = document.querySelector(".cal-ipt");
const resultField = document.querySelector(".result");
const buttons = document.querySelectorAll(".cal-btn");

let currentInput = ""; // 현재 입력 값

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
    // 정규식을 사용하여 마지막 숫자 추출
    const match = currentInput.match(/(\d+(\.\d+)?)$/); // 마지막 숫자 매칭
    if (match) {
      const lastNumber = match[0]; // 추출된 마지막 숫자
      const percentValue = Number(lastNumber) * 0.01; // 백분율로 변환
      currentInput = currentInput.slice(0, -lastNumber.length) + percentValue; // 원래 입력에서 마지막 숫자를 백분율로 변환된 숫자로 교체
      inputField.value = currentInput; // UI 업데이트
    }
  } else {
    // 첫 입력에 연산자가 들어가지 않도록 하기
    if (currentInput === "" && isCurrentOperator) {
      return;
    }
    // 연산자가 연속으로 입력되는 것을 막음
    if (isLastCharOperator && isCurrentOperator) {
      return;
    }
    // 소숫점이 연속으로 입력되는 것을 막음
    if (isLastDecimalPoint && value === ".") {
      return;
    }

    updateInput(value);
    console.log(currentInput);
  }
}

// 입력값 하나씩 지우기
function removeLastCharacter(currentInput) {
  const slice = currentInput.slice(0, -1);
  console.log(slice);
  return slice;
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
  inputField.value = currentInput;
  resultField.textContent = "";
}

// 결과를 화면에 표시
function displayResult(result) {
  resultField.textContent = result;
  currentInput = ""; // 입력값 초기화
}

// 괄호 입력
function parentheses() {}

// 계산 로직 수행
function calculate(expression) {
  const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);

  // 곱셈 나눗셈 우선순위 계산
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const left = Number(tokens[i - 1]);
      const right = Number(tokens[i + 1]);
      const result = tokens[i] === "*" ? left * right : left / right;
      tokens.splice(i - 1, 3, result);
      i--; // 인덱스 조정
    }
  }

  // 덧셈 뺄셈 계산
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "+" || tokens[i] === "-") {
      const left = Number(tokens[i - 1]);
      const right = Number(tokens[i + 1]);
      const result = tokens[i] === "+" ? left + right : left - right;
      tokens.splice(i - 1, 3, result);
      i--; // 인덱스 조정
    }
  }
  // 최종 결과의 소수점 자릿수 조정
  return decimalCalculate(Number(tokens[0]));
}

// 소수점 자릿수를 13자리로 제한하는 함수
function decimalCalculate(result) {
  if (result % 1 !== 0) {
    // 소수점이 있을 경우
    return parseFloat(result.toFixed(13)); // 소수점 13자리까지만 남김
  }
  return result; // 정수일 경우 그대로 반환
}
