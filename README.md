# [24.10.11] 계산기 만들기

## 개발 계획

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

<br>

## 주요 기능

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

<br>

## 기능 구현 순서 및 계획서

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
