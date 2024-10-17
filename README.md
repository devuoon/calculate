# [24.10.11] 계산기 만들기

Created by: 윤지

![image.png](%5B24%2010%2011%5D%20%E1%84%80%E1%85%A8%E1%84%89%E1%85%A1%E1%86%AB%E1%84%80%E1%85%B5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%2011b998e0c20c80498d94cd8d4f20bbcf/image.png)

# 개발 일정

---

개발 일정 : 2024.10.10(목) ~ 2024.10.18(금) - 9일

| 일정           | 개발 기능                       |
| -------------- | ------------------------------- |
| 10월 10일 (목) | 개발 계획서 작성                |
| 10월 11일 (금) | 개발 계획서 수정 및 확인        |
| 10월 12일 (토) | 계산기 화면 구현                |
| 10월 13일 (일) | - 각 버튼 입력 기능             |
| - 계산 기능    |
| 10월 14일 (월) | - 각 버튼 입력 기능             |
| - 계산 기능    |
| 10월 15일 (화) | - 예외처리 ( 숫자 입력 )        |
| 10월 16일 (수) | - 예외처리 ( 수식에 괄호 추가 ) |
| 10월 17일(목)  | - 코드 확인 및 기능명세서 작성  |
| 10월 18일(금)  | - 최종 확인                     |

# 주요 기능

---

### 입력 및 지우기

1. 숫자 버튼 클릭하면 `inputField` 에 입력값
   1. 첫 입력은 무조건 숫자부터 시작하며 값이 없는 상태에서 기호 선택 방지
   2. 숫자 입력 후 연산기호 입력하면 그 다음은 무조건 숫자 ( 단, () 제외 / 숫자 - 기호 - 숫자 형태 유지)
2. 숫자 지우기 버튼을 클릭하면 오른쪽부터 한 글자씩 지우기
   1. ‘C’ 버튼 클릭 시 입력값 모두 초기화
3. 처음 괄호를 입력하면 ‘(’이 입력되고 두번째 입력은 ‘)’ 입력 (여러번 가능)

### 계산기능

1. 숫자 + 연산기호 다음 두번째 숫자 입력 부터 계산 기능 실행되고 결과값 `resultField`에 출력
2. 숫자 다음 ‘(’를 입력하면 곱하기 연산으로 인식한다.
   1. 괄호 안에 연산이 있으면 괄호를 먼저 계산한다.

# 기능 구현 순서 및 계획서

---

### 화면구현

1. 숫자 및 기호 버튼
   1. 버튼 wrap `display: grid`
2. 숫자 및 기호 입력 `inputField` (현재 수식 표시) / `currentInput` (문자열 변환)
3. 연산 결과값 `resultField` (수식 결과값 표시)

### 버튼 입력 / 계산기능

1. 클릭한 버튼 값 불러오기 `button.textContent`
   1. `buttons.forEach`로 모든 버튼 순회
2. 연산 수행하는 `calculate()` 함수 선언
3. 수식을 문자열로 파싱
4. 문자열 안에서 숫자와 기호 어떻게 구분? 예외처리는 ?
   1. 정규표현식 → 괄호 처리 어떻게 할건지
   2. .includes → 문자열을 배열로 변환 해야함
5. ‘=’ 버튼 클릭 시 연산 수행 `calculate()` 함수를 호출
   1. button.textContent === ‘=’
   2. 계산식 실행하고 `inputField` 초기화
6. ‘dec’ 버튼 클릭 시 한글자씩 삭제 `.slice(0,-1)`
7. ‘C’ 버튼 클릭 시 전체 초기화

### 예외처리

1. 첫번째는 무조건 숫자 입력 `!isNaN`
2. 소수점 연속으로 입력 불가능
   1. currentInput값 .slice(0,-1) 이 ‘.’ 일 때 소수점 입력 불가능
3. 연산기호는 연속으로 입력할 수 없다.
   1. currentInput값 .slice(0,-1)이 클릭한 버튼값(연산기호)과 같지 않아야 하는 조건문
4. 숫자 + ‘(’ 이면 곱하기 연산
5. 연산기호와 ‘(’는 연속으로 올 수 있음
6. 괄호 열고 닫기 순서대로 나타나야 함

### 결과값 업데이트

1. input의 값 변경해도 결과값 계속 업데이트 `inputField.value = currentInput`

# 계산기 만들기

---

![image.png](%5B24%2010%2011%5D%20%E1%84%80%E1%85%A8%E1%84%89%E1%85%A1%E1%86%AB%E1%84%80%E1%85%B5%20%E1%84%86%E1%85%A1%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%80%E1%85%B5%2011b998e0c20c80498d94cd8d4f20bbcf/image%201.png)

- index.html
  ```html
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="style.css" />
      <title>계산기 만들기</title>
    </head>

    <body>
      <input type="text" class="cal-ipt" disabled />
      <p class="result"></p>
      <div class="cal-wrap">
        <button class="cal-btn c-btn" value="C">C</button>
        <button class="cal-btn operator" value="%">%</button>
        <button class="cal-btn operator" value="()">( )</button>
        <button class="cal-btn oper-btn operator" value="/">÷</button>
        <button class="cal-btn num" value="7">7</button>
        <button class="cal-btn num" value="8">8</button>
        <button class="cal-btn num" value="9">9</button>
        <button class="cal-btn oper-btn operator" value="*">x</button>
        <button class="cal-btn num" value="4">4</button>
        <button class="cal-btn num" value="5">5</button>
        <button class="cal-btn num" value="6">6</button>
        <button class="cal-btn oper-btn operator" value="-">-</button>
        <button class="cal-btn num" value="1">1</button>
        <button class="cal-btn num" value="2">2</button>
        <button class="cal-btn num" value="3">3</button>
        <button class="cal-btn oper-btn operator" value="+">+</button>
        <button class="cal-btn num" value=".">.</button>
        <button class="cal-btn num" value="0">0</button>
        <button class="cal-btn" value="del">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="17" viewBox="0 0 24 17">
            <g data-name="그룹 11">
              <path data-name="합치기 1" d="M6 17 0 8.5 6 0h18v17z" />
              <g data-name="그룹 12" transform="translate(-1549.406 -405.713)">
                <rect
                  data-name="사각형 7"
                  width="1.884"
                  height="11.303"
                  rx=".942"
                  transform="rotate(45 288.65 2095.156)"
                  style="fill:#fff"
                />
                <rect
                  data-name="사각형 8"
                  width="1.884"
                  height="11.303"
                  rx=".942"
                  transform="rotate(-45 1275.003 -1675.292)"
                  style="fill:#fff"
                />
              </g>
            </g>
          </svg>
        </button>
        <button class="cal-btn equals-btn operator" value="=">=</button>
      </div>

      <script src="script.js"></script>
    </body>
  </html>
  ```
- script.js
  ```jsx
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
  ```
- style.css
  ```css
  body {
    width: 323px;
    border: 1px solid #c8c8c8;
    border-radius: 15px;
    margin: 80px auto;
    padding: 66px 24px 26px 24px;
  }

  input {
    width: 100%;
    padding: 10px;
    border: none;
    text-align: right;
    font-size: 20px;
    line-height: 21px;
    letter-spacing: 1px;
    color: #a4a4a4;
    background-color: #fff;
  }

  .result {
    text-align: right;
    margin: 30px 0 50px;
    font-size: 40px;
    line-height: 48px;
    height: 48px;
  }

  button {
    border: none;
    border-radius: 10px;
    background-color: #e1e4e5;
    width: 68px;
    height: 68px;
    font-size: 23px;
    font-weight: 500;
    line-height: 28px;
    transition: all 0.2s ease;
  }

  button:active {
    transform: scale(0.95); /* 클릭 시 버튼 크기 축소 */
    background-color: #d4d4d4; /* 클릭 시 배경색 변경 */
  }

  button.c-btn {
    background-color: #ffc5c5;
    color: #ff2e2e;
  }

  .c-btn:active {
    background-color: #faa4a4;
  }

  button.oper-btn {
    background-color: #ff9404;
    color: #fff;
  }

  .oper-btn:active {
    background-color: #e28201;
  }

  button.equals-btn {
    background-color: #30cb72;
    color: #fff;
  }

  .equals-btn:active {
    background-color: #22ab5c;
  }

  .cal-wrap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 16px;
    row-gap: 16px;
  }
  ```

# 추가 되어야 할 기능

---

1. 연산자, 괄호는 inputField 에서 css color 다르게 적용 ( 숫자와 연산자 구분하기)
2. 괄호 + 연산도 계산 가능하게 예외처리 ⇒ 지금은 연산 + 괄호만 처리 중
3.
