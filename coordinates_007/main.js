const targetElement = document.querySelector(".target");
const horizontalLineElement = document.querySelector(".line-x");
const verticalLineYElement = document.querySelector(".line-y");
const coordinatesElement = document.querySelector(".coordinates");

window.addEventListener("load", () => {
  const targetRect = targetElement.getBoundingClientRect();

  window.addEventListener("mousemove", (event) => {
    changeCoordinate(event.pageX, event.pageY);
    changePositionOfTargetElement(event.pageX, event.pageY);
    changePositionOfLineElement(event.pageX, event.pageY);
  });

  function changeCoordinate(x, y) {
    coordinatesElement.innerHTML = `${x}px, ${y}px`;
  }

  function changePositionOfTargetElement(x, y) {
    const coordX = x - targetRect.width / 2;
    const coordY = y - targetRect.height / 2;
    targetElement.style.transform = `translate(${coordX}px, ${coordY}px)`;
  }

  function changePositionOfLineElement(x, y) {
    horizontalLineElement.style.transform = `translateY(${y}px)`;
    verticalLineYElement.style.transform = `translateX(${x}px)`;
  }
});

// 성능 개선 전
// top과 left를 사용했었기 때문에
// 매번 layout을 다시 그리고 있어
// 성능 개선이 필요한 코드
// function changePositionOfTargetElement(x, y) {
//   targetElement.style.top = `${y}px`;
//   targetElement.style.left = `${x}px`;
// }

// function changePositionOfLineElement(x, y) {
//   horizontalLineElement.style.top = `${y}px`;
//   verticalLineYElement.style.left = `${x}px`;
// }
