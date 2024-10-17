const inputField = document.querySelector('.cal-ipt'); // 사용자 입력 필드
const resultField = document.querySelector('.result'); // 계산 결과 필드
const buttons = document.querySelectorAll('.cal-btn'); // 모든 버튼
let currentInput = ''; // 현재 입력 값

// 이벤트 핸들러 설정
buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

// 키보드 입력 이벤트 처리
document.addEventListener('keydown', handleKeyPress);

// 버튼 클릭 이벤트 처리
function handleButtonClick(event) {
  const btnEvent = event.target; // 클릭된 버튼
  const value = btnEvent.value; // 버튼의 실제 값 (삭제 등 특별 기능)

  // 버튼 별 조건문
  if (value === 'C') {
    clearInput();
  } else if (value === '=') {
    calculateResult();
  } else if (value === 'del') {
    removeLastCharacter();
  } else if (value === '%') {
    convertPercentage();
  } else if (value === '()') {
    handleParenthesis();
  } else {
    handleInput(value, btnEvent.classList.contains('operator')); // 연산자 여부를 체크
  }
}

// 키보드 입력 처리
function handleKeyPress(event) {
  const key = event.key;

  // 숫자 및 연산자 키 확인
  if (/^[0-9+\-*/().]$/.test(key)) {
    handleInput(key, /[+\-*/]/.test(key)); // 연산자 여부를 체크
  } else if (key === 'Enter') {
    calculateResult();
  } else if (key === 'Backspace') {
    removeLastCharacter();
  } else if (key === 'c' || key === 'C') {
    clearInput();
  }
}

// 입력값 업데이트 및 UI 갱신
function updateInput(value) {
  currentInput += value;
  inputField.value = currentInput;
  resultField.textContent = ''; // 결과 초기화
}

// 입력값을 초기화
function clearInput() {
  currentInput = '';
  inputField.value = currentInput;
  resultField.textContent = '';
}

// 결과 계산 및 표시
function calculateResult() {
  if (isLastCharOperator() || isLastDecimalPoint()) return;
  displayResult(calculate(currentInput));
}

// 마지막 문자 삭제
function removeLastCharacter() {
  currentInput = currentInput.slice(0, -1);
  inputField.value = currentInput;
}

// 백분율 변환
function convertPercentage() {
  const match = currentInput.match(/(\d+(\.\d+)?)$/);
  if (match) {
    const lastNumber = match[0];
    const percentValue = Number(lastNumber) * 0.01;
    currentInput = currentInput.slice(0, -lastNumber.length) + percentValue;
    inputField.value = currentInput;
  }
}

// 괄호 처리
function handleParenthesis() {
  const openCount = (currentInput.match(/\(/g) || []).length;
  const closeCount = (currentInput.match(/\)/g) || []).length;
  updateInput(openCount === closeCount ? '(' : ')');
}

// 입력 처리
function handleInput(value, isOperator) {
  if (
    isInitialOperator(value, isOperator) ||
    isRepeatOperator(isOperator) ||
    isRepeatDecimal(value)
  ) {
    return;
  }
  if (isOperatorAfterOpenParenthesis(value) || !isPatternInsideParenthesis(value)) {
    return;
  }
  updateInput(value);
}

// 첫입력값 연산자 방지
function isInitialOperator(value, isOperator) {
  return currentInput === '' && isOperator;
}

// 연산자 연속 입력 방지
function isRepeatOperator(isOperator) {
  return isLastCharOperator() && isOperator;
}

// 소수점 연속 입력 방지
function isRepeatDecimal(value) {
  return isLastDecimalPoint() && value === '.';
}

// 여는 괄호 뒤에 연산자 입력 방지
function isOperatorAfterOpenParenthesis(value) {
  return currentInput.slice(-1) === '(' && !/[0-9]/.test(value);
}

// 괄호 안의 패턴이 여는 괄호 + 숫자 + 연산자 + 숫자 + 닫는 괄호인지 검증
function isPatternInsideParenthesis(value) {
  const openCount = (currentInput.match(/\(/g) || []).length; // 여는 괄호 갯수
  const closeCount = (currentInput.match(/\)/g) || []).length; // 닫는 괄호 갯수
  const pattern = /\([0-9]+[+\-*/][0-9]+\)$/;
  if (openCount > closeCount) {
    return pattern.test(currentInput) || value !== ')';
  }
  return true;
}

// 마지막 입력이 연산자인지 확인
function isLastCharOperator() {
  return /[+\-*/%]/.test(currentInput.slice(-1));
}

// 마지막 입력이 소수점인지 확인
function isLastDecimalPoint() {
  return currentInput.slice(-1) === '.';
}

// 결과 화면에 표시
function displayResult(result) {
  resultField.textContent = result;
  currentInput = ''; // 입력값 초기화
}

// 계산 로직 수행
function calculate(expression) {
  expression = expression.replace(/(\d)(\()/g, '$1*$2');
  while (/\([^()]+\)/.test(expression)) {
    expression = expression.replace(/\([^()]+\)/, (match) => calculate(match.slice(1, -1)));
  }
  const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);

  // 곱셈 나눗셈 우선순위 계산
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      // 연산자 기준 왼쪽과 오른쪽 값
      const left = Number(tokens[i - 1]);
      const right = Number(tokens[i + 1]);
      const result = tokens[i] === '*' ? left * right : left / right;
      tokens.splice(i - 1, 3, result);
      i--; // 인덱스 조정
    }
  }

  // 덧셈 뺄셈 계산
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      const left = Number(tokens[i - 1]);
      const right = Number(tokens[i + 1]);
      const result = tokens[i] === '+' ? left + right : left - right;
      tokens.splice(i - 1, 3, result);
      i--;
    }
  }

  return decimalCalculate(Number(tokens[0]));
}

// 소수점 자릿수를 13자리로 제한하는 함수
function decimalCalculate(result) {
  return result % 1 !== 0 ? parseFloat(result.toFixed(13)) : result;
}
