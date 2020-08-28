const items = document.querySelector(".items");
const input = document.querySelector(".footer__input");
const addBtn = document.querySelector(".footer__button");
const headerItemLength = document.querySelector(".header__items-length");
const allDeleteBtn = document.querySelector(".footer__btn-all-delete");

window.addEventListener("load", () => {
  loadItemsFromBrowser();
});

window.addEventListener("beforeunload", () => {
  saveItemsInBrowser();
});

addBtn.addEventListener("click", () => {
  onAdd();
});

input.addEventListener("keypress", (event) => {
  if (!(event.key === "Enter")) return;
  onAdd();
});

allDeleteBtn.addEventListener("click", () => {
  if (!confirm("목록을 비울까요?")) return;

  deleteAllItems();
  updateItemLength();
});

function onAdd() {
  // input에 값이 없다면, 추가되지 않습니다.

  // 1. 사용자가 입력한 텍스트를 받아옴
  const itemName = input.value;
  if (itemName === "") {
    input.focus();
    return;
  }

  console.log(itemName);
  // 2. 새로운 아이템을 만듬 (텍스트 + 삭제 버튼)
  const newItem = createItem(itemName);

  // 3. items 컨테이너에 새로 만든 아이템을 추가한다
  items.append(newItem);

  // 4. 새로 만든 아이템으로 스크롤링
  newItem.scrollIntoView({ behavior: "smooth" });

  // 5. 인풋의 내용 초기화
  input.value = "";

  // 6. 인풋에 포커싱
  input.focus();

  // 7. 개수 업데이트
  updateItemLength();
}

function createItem(text) {
  const now = new Date();

  const itemRow = document.createElement("li");
  itemRow.setAttribute("class", "item__row");

  const item = document.createElement("div");
  item.setAttribute("class", "item");

  const itemContext = document.createElement("div");
  itemContext.setAttribute("class", "item__context");

  const itemName = document.createElement("span");
  itemName.setAttribute("class", "item__name");
  itemName.innerText = text;

  const itemCreated = document.createElement("span");
  itemCreated.setAttribute("class", "item__created");
  itemCreated.innerText = `${now.getMonth() + 1}월 ${now.getDate()}일`;

  const itemDelete = document.createElement("button");
  itemDelete.setAttribute("class", "item__delete");
  itemDelete.innerHTML = `<span class="fas fa-trash-alt"></span>`;
  itemDelete.addEventListener("click", () => {
    if (!confirm(`${text}를 삭제하시겠어요?`)) return;
    items.removeChild(itemRow);
    updateItemLength();
  });

  const itemDivider = document.createElement("div");
  itemDivider.setAttribute("class", "item__divider");

  itemContext.append(itemName, itemCreated);
  item.append(itemContext, itemDelete);
  itemRow.append(item, itemDivider);

  return itemRow;
}

function updateItemLength() {
  const itemLength = items.childElementCount;
  headerItemLength.innerText = `${itemLength}개`;
}

function deleteAllItems() {
  items.innerHTML = "";
}

function loadItemsFromBrowser() {
  const loadedItems = window.localStorage.getItem("items");

  items.innerHTML = loadedItems ? loadedItems : "";
  updateItemLength();
}

function saveItemsInBrowser() {
  window.localStorage.setItem("items", items.innerHTML);
}
