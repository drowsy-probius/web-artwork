### 이게 왜 필요함?
모바일 환경에서 console 메시지를 보고싶음. 그런데 내가 찾아본 내용으로는 기존의 모바일 디버깅 도구는 데스크탑과 연결되어 있어야 console 내용을 볼 수 있음. 굳이 그러고 싶지 않아서 모바일 환경이면 웹 페이지 왼쪽 하단에 console내용 출력해주는 것을 만들었음.


### 어떻게 사용함?
루트 component에 추가하면 됨


### 보완해야할 점과 해결?
setLog 함수가 비동기라서 console.log 함수가 너무 짧은 간격으로 호출되면 앞 메시지는 가져오지 못함. => useState로 버퍼 둬서 해결함.

string 형식으로 html에 출력하는 것이라서 일부 스타일은 표시가 안됨 (ex. pixijs message). 나중에 후처리 하는 방식을 배워서 해결 하던가 해야지


![demo](./demo.gif)


<!-- <video width="100%" height="100%" controls>
  <source src="demo.mp4" type="video/mp4">
</video> -->


