const inputField = document.querySelector(".cal-ipt");
const resultField = document.querySelector(".result");
const buttons = document.querySelectorAll(".cal-btn");

let currentInput = ""; // 현재 입력 값

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      reset(); // 초기화
    } else if (value === "del") {
      currentInput = currentInput.slice(0, -1); // 마지막 문자 삭제
      inputField.value = currentInput; // inputField 업데이트
    } else if (value === "=") {
      // '=' 클릭 시 계산
      if (currentInput) {
        const result = calculate(currentInput); // 문자열을 계산
        resultField.textContent = result; // 결과 표시
        reset(); // 초기화
      }
    } else {
      handleInput(value); // 입력 처리
    }
  });
});

// 입력을 처리하는 함수
function handleInput(value) {
  currentInput += value; // 현재 입력에 추가
  inputField.value = currentInput; // inputField 업데이트
}

// 계산 함수
function calculate(input) {
  // 1단계: 곱셈 및 나눗셈 처리
  let regex = /(\d+\.?\d*)([*\/])(\d+\.?\d*)/; // 곱셈 및 나눗셈 정규 표현식

  while (regex.test(input)) {
    input = input.replace(regex, (match, num1, operator, num2) => {
      return operator === "*"
        ? (Number(num1) * Number(num2)).toString()
        : (Number(num1) / Number(num2)).toString();
    });
  }

  // 2단계: 덧셈 및 뺄셈 처리
  regex = /(\d+\.?\d*)([+-])(\d+\.?\d*)/; // 덧셈 및 뺄셈 정규 표현식
  while (regex.test(input)) {
    input = input.replace(regex, (match, num1, operator, num2) => {
      return operator === "+"
        ? (Number(num1) + Number(num2)).toString()
        : (Number(num1) - Number(num2)).toString();
    });
  }

  return input; // 최종 결과 반환
}

// 초기화 함수
function reset() {
  currentInput = "";
  inputField.value = ""; // inputField 초기화
}
