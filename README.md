## Demo pages

- [Web Artworks](https://demo.papago.duckdns.org)

상단에 메뉴있음.

- [Wave static page](https://k123s456h.github.io/web-artwork/wave)

javascript로만 작성한 wave 페이지. 업데이트 안함


### TODO



## 문제 발생과 해결
resize시에 프레임 저하가 생김. 아마도 requestAnimationFrame 함수 관련된 문제인 것으로 보임.
`const requestAnimationFrameRef = useRef(requestAnimationFrame(animate));` 로 초기화 하던 코드를 `const requestAnimationFrameRef = useRef<number>(-1);`으로 초기화 하고 `useEffect`의 callback에서 `requestAnimationFrameRef.current = requestAnimationFrame(animate);` 코드를 사용하면서 해결함.

retina display를 위해서 devicePixelRatio 값으로 canvas.width, canvas.height에 곱하는데 이 때 canvas.style.width, canvas.style.height는 그대로 유지해야 함. [useCanvas.tsx](./src/components/useCanvas.ts) 참고

useEffect에서 함수 호출 시에 dependency를 작성하는게 까다롭네 => const로 함수 선언하는데 useCallback 사용해서 해결함.

[기타 최적화 팁](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)


## libraries

pure canvas or...


for 2D graphics: [PixiJS](https://pixijs.com), [tutorial](https://pixijs.com/tutorials)

[react-pixi](https://github.com/inlet/react-pixi) (react 18에서 이슈 있음)



for 3D graphics: [three.js](https://threejs.org)

[react-three-fiber](https://github.com/pmndrs/react-three-fiber)



```
참고 사이트
https://fff.cmiscm.com

```