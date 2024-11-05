// ===== 전역 변수 및 DOM 요소 =====
const inputField = document.querySelector('.cal-ipt'); // 사용자 입력 필드
const resultField = document.querySelector('.result'); // 계산 결과 필드
const buttons = document.querySelectorAll('.cal-btn'); // 모든 버튼
let currentInput = ''; // 현재 입력 값

// ===== 입력 및 출력 처리 함수 =====

// 입력값 업데이트 및 UI 갱신
const updateInput = function (value) {
  const displayValue = value === '*' ? 'X' : value === '/' ? '÷' : value;
  const span = document.createElement('span');
  span.textContent = displayValue;

  // 연산자일 경우 색상 변경
  if (/[+\-*/]/.test(value)) {
    span.style.color = '#ff9405';
    span.style.padding = '0 3px';
  }

  inputField.appendChild(span);
  currentInput += value;
  resultField.textContent = ''; // 결과 초기화
};

// 입력값을 초기화
const clearInput = function () {
  currentInput = '';
  inputField.textContent = ''; // contenteditable을 사용하는 경우 textContent로 초기화
  resultField.textContent = '';
};

// 마지막 문자 삭제
const removeLastCharacter = function () {
  currentInput = currentInput.slice(0, -1);
  inputField.removeChild(inputField.lastChild); // 마지막 요소 제거
};

// 백분율 변환
const convertPercentage = function () {
  const match = currentInput.match(/(\d+(\.\d+)?)$/);
  if (match) {
    const lastNumber = match[0];
    const percentValue = Number(lastNumber) * 0.01;
    currentInput = currentInput.slice(0, -lastNumber.length) + percentValue;
    clearInput();
    updateInput(currentInput);
  }
};

// 괄호 처리
const handleParenthesis = function () {
  const openCount = (currentInput.match(/\(/g) || []).length;
  const closeCount = (currentInput.match(/\)/g) || []).length;
  updateInput(openCount === closeCount ? '(' : ')');
};

// ===== 입력 검증 함수 =====

// 첫입력값 연산자 방지
const isInitialOperator = (value, isOperator) => currentInput === '' && isOperator;

// 연산자 연속 입력 방지
const isRepeatOperator = (isOperator) => isLastCharOperator() && isOperator;

// 소수점 연속 입력 방지
const isRepeatDecimal = (value) => isLastDecimalPoint() && value === '.';

// 소수점의 유효한 형식인지 확인
const isInvalidDecimalSequence = function (value) {
  const numbers = currentInput.split(/[\+\-\*\/%]/);
  const lastNumber = numbers[numbers.length - 1];
  return value === '.' && lastNumber.includes('.');
};

// 여는 괄호 뒤에 연산자 입력 방지
const isOperatorAfterOpenParenthesis = (value) =>
  currentInput.slice(-1) === '(' && !/[0-9]/.test(value);

// 괄호 안의 패턴이 여는 괄호 + 숫자 + 연산자 + 숫자 + 닫는 괄호인지 검증
const isPatternInsideParenthesis = function (value) {
  const openCount = (currentInput.match(/\(/g) || []).length;
  const closeCount = (currentInput.match(/\)/g) || []).length;
  const pattern = /\([0-9]+[+\-*/][0-9]+\)$/;
  return openCount > closeCount ? pattern.test(currentInput) || value !== ')' : true;
};

// 마지막 입력이 연산자인지 확인
const isLastCharOperator = () => /[+\-*/%]/.test(currentInput.slice(-1));

// 마지막 입력이 소수점인지 확인
const isLastDecimalPoint = () => currentInput.slice(-1) === '.';

// 입력 처리
const handleInput = function (value, isOperator) {
  if (
    isInitialOperator(value, isOperator) ||
    isRepeatOperator(isOperator) ||
    isRepeatDecimal(value) ||
    isInvalidDecimalSequence(value) ||
    isOperatorAfterOpenParenthesis(value) ||
    !isPatternInsideParenthesis(value)
  ) {
    return;
  }
  updateInput(value);
};

// ===== 결과 표시 및 계산 함수 =====

// 결과 계산 및 표시
const calculateResult = function () {
  if (isLastCharOperator() || isLastDecimalPoint()) return;
  displayResult(calculate(currentInput));
};

// 결과 화면에 표시
const displayResult = (result) => (resultField.textContent = result);

// 계산 로직 수행
const calculate = function (expression) {
  expression = expression.replace(/(\d)(\()/g, '$1*$2');
  while (/\([^()]+\)/.test(expression)) {
    expression = expression.replace(/\([^()]+\)/, (match) => calculate(match.slice(1, -1)));
  }
  const tokens = expression.match(/(\d+(\.\d+)?|\D)/g);

  // 곱셈 나눗셈 우선순위 계산
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
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
};

// 소수점 자릿수를 13자리로 제한하는 함수
const decimalCalculate = (result) => (result % 1 !== 0 ? parseFloat(result.toFixed(13)) : result);

// ===== 이벤트 처리 함수 =====

// 버튼 클릭 이벤트 처리
const handleButtonClick = function (event) {
  const btnEvent = event.target;
  const value = btnEvent.value;

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
    handleInput(value, btnEvent.classList.contains('operator'));
  }
};

// 키보드 입력 처리
const handleKeyPress = function (event) {
  const key = event.key;

  if (/^[0-9+\-*/().]$/.test(key)) {
    handleInput(key, /[+\-*/]/.test(key));
  } else if (key === 'Enter') {
    calculateResult();
  } else if (key === 'Backspace') {
    removeLastCharacter();
  } else if (key === 'c' || key === 'C') {
    clearInput();
  }
};

// ===== 이벤트 핸들러 설정 =====
buttons.forEach((button) => button.addEventListener('click', handleButtonClick));
document.addEventListener('keydown', handleKeyPress);
