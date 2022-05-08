## 만들면서 어려웠던 점?
mousePosition을 아무 생각 없이 useState로 처음에 관리했는데 그러면 매 프레임마다 rerender가 발생해서 성능이 매우 떨어지게 됨. useRef로 해서 해결함.

blur 효과는 넣으면 미적으로는 좋지만 성능하락이 커짐. 특히 모바일에서는 30프레임 이하로 떨어지기도 함. html dom element라면 css로 할 수도 있겠지만 canvas 내의 요소라서 그런 접근은 어려움. 어디서 읽기로는 alpha 옵션을 끄면 성능 향상이 있다고 함.

레티나 디스플레이같은 경우에 선명도를 위해서 canvas크기에 devicePixelRatio값을 곱해서 만들었는데 그럴 경우에는 touch나 mouse 위치 값을 devicePixelRatio로 나누어야 정확한 위치를 얻을 수 있음.