## 만들면서 어려웠던 점?
mousePosition을 아무 생각 없이 useState로 처음에 관리했는데 그러면 매 프레임마다 rerender가 발생해서 성능이 매우 떨어지게 됨. useRef로 해서 해결함.

