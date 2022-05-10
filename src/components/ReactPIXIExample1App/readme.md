## 문제점?
어떤 것이 원인인지는 모르겠지만 처음에 이 페이지로 바로 접근하면 `[react-reconciler.development.js:1488] Uncaught Error: Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.` 에러가 발생함. 다른 페이지에 먼저 접근하고 이 페이지로 오면 제대로 렌더링 됨.

=> 아마도 상위 component가 생성되기 전에 react-pixi의 Stage 컴포넌트가 호출이 되어서 그런 것 같음. [App.tsx](../../App.tsx)에서 `renderChildren` 변수를 추가해서 의존성이 생기도록 해서 해결함. [App.tsx](../../App.tsx)에서는 처음에 연산이 큰 작업이 없으니 성능하락 등의 체감은 없음.