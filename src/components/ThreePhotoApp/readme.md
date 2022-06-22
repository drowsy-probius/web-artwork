## PIXI를 이용하여 3D photo 이미지 만들기
두 개의 이미지가 필요함
- 원본 이미지
- 깊이 정보가 담겨진 이미지 (depth map)

## depth map 생성하기
사용자로부터 입력을 받을 수 있어야 한다.

그래서 선택된 이미지와 같은 해상도를 가진 캔버스를 하나 만들어서

캔버스 위에 어느 물체가 앞에 있는지 그릴 수 있도록 구현했다.

여기서 고려해야 할 문제가 생긴다.

depth map은 검은색에서 흰색까지의 범위를 가지고 검은색은 멀리 있는 곳을 나타내고
흰색은 가까이에 있는 곳을 나타낸다.

단순하게 적용하려면 canvas의 배경을 검은색으로 해야 하는데 그렇게 한다면
이미지 위에 덧그리는 구현으로는 선택된 이미지를 보면서 사용자가 depth map을
그리기에 불편해진다.

이에 대한 해결책으로 canvas를 새로 만드는 것으로 해결했다.

사용자가 그리는 canvas의 배경은 없게 설정한 뒤에 새로운 canvas를 생성한다.

새로운 canvas의 배경은 검은색으로 정하고 depth 정보가 있는 canvas에서 이미지를 가져온다.


## 구현하기
기존 이미지와 depth map 이미지 둘 다 sprite로 생성해서 app.stage에 추가해야 한다.

기존 이미지는 업로드 한 내용으로 추가하면 되고 depth map은 위에서 설명한 대로 이미지를 구성하고
canvas에서 toDataURL메소드로 이미지 주소를 생성하면 된다.

그 다음에는 PIXI.filters에 내장된 DisplacementFilter를 사용하면 끝이다.


## 참고자료
(1)[https://redstapler.co/3d-photo-from-image-javascript-tutorial/]


![demo](./3d_demo.gif)