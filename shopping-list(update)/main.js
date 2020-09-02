const items = document.querySelector(".items");
const input = document.querySelector(".footer__input");
const addBtn = document.querySelector(".footer__button");
const headerItemLength = document.querySelector(".header__items-length");
const allDeleteBtn = document.querySelector(".footer__btn-all-delete");

// 아이템의 ID
let id = window.localStorage.getItem("itemId") ?? 0;

function createItem(text) {
  const now = new Date();
  const created = `${now.getMonth() + 1}월 ${now.getDate()}일`;

  const itemRow = document.createElement("li");
  itemRow.setAttribute("class", "item__row");
  itemRow.setAttribute("data-id", id);

  itemRow.innerHTML = `
    <div class="item">
      <div class="item__context">
        <span class="item__name">${text}</span>
        <span class="item__created">${created}</span>
      </div>
      <button class="item__delete" data-id=${id}>
        <span class="fas fa-trash-alt" data-id=${id}></span>
      </button>
      </div>
    <div class="item__divider"></div>
  `;

  // const item = document.createElement("div");
  // item.setAttribute("class", "item");

  // const itemContext = document.createElement("div");
  // itemContext.setAttribute("class", "item__context");

  // const itemName = document.createElement("span");
  // itemName.setAttribute("class", "item__name");
  // itemName.innerText = text;

  // const itemCreated = document.createElement("span");
  // itemCreated.setAttribute("class", "item__created");
  // itemCreated.innerText = `${now.getMonth() + 1}월 ${now.getDate()}일`;

  // const itemDelete = document.createElement("button");
  // itemDelete.setAttribute("class", "item__delete");
  // itemDelete.innerHTML = `<span class="fas fa-trash-alt"></span>`;

  // const itemDivider = document.createElement("div");
  // itemDivider.setAttribute("class", "item__divider");

  // itemContext.append(itemName, itemCreated);
  // item.append(itemContext, itemDelete);
  // itemRow.append(item, itemDivider);

  // 이벤트 추가
  // itemRow.addEventListener("click", (event) => {
  //   const targetClassList = Object.values(event.target.classList);

  //   if (
  //     !targetClassList.includes("item__delete") &&
  //     !targetClassList.includes("fa-trash-alt")
  //   ) {
  //     return;
  //   }
  //   if (!confirm(`${text}를 삭제하시겠어요?`)) return;

  //   items.removeChild(itemRow);
  //   updateItemLength();
  // });

  id++;

  return itemRow;
}

window.addEventListener("load", () => {
  const loadedItems = window.localStorage.getItem("items");

  items.innerHTML = loadedItems ? loadedItems : "";
  updateItemLength();
});

window.addEventListener("beforeunload", () => {
  window.localStorage.setItem("items", items.innerHTML);
  window.localStorage.setItem("itemId", id);
});

items.addEventListener("click", (event) => {
  const { target } = event;
  if (
    target.className.includes("item__delete") ||
    target.className.includes("fa-trash-alt")
  ) {
    const toBeDeletedId = target.dataset.id;
    console.log(toBeDeletedId);
    const toBeDeleted = document.querySelector(
      `.item__row[data-id='${toBeDeletedId}']`
    );
    toBeDeleted.remove();
  }
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

  items.innerHTML = "";
  updateItemLength();
});

function updateItemLength() {
  const itemLength = items.childElementCount;
  headerItemLength.innerText = `${itemLength}개`;
}

function onAdd() {
  // input에 값이 없다면, 추가되지 않습니다.
  const itemName = input.value;
  if (itemName === "") {
    input.focus();
    return;
  }
  const newItem = createItem(itemName);

  items.append(newItem);

  newItem.scrollIntoView({ behavior: "smooth" });

  input.value = "";
  input.focus();

  updateItemLength();
}
