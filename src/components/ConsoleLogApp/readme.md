### 보완해야할 점과 해결?
setLog 함수가 비동기라서 console.log 함수가 너무 짧은 간격으로 호출되면 앞 메시지는 가져오지 못함. => 버퍼 array 둬서 해결함.

string 형식으로 출력해서 일부 스타일은 표시가 안됨 (ex. pixijs message)