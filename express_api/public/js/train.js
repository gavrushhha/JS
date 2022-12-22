const socket = io();

const root = document.querySelector("#root");
root.insertAdjacentHTML(
  "beforebegin",
  `<button class= "add_button">Добавить пользователя</button>`
);

const addButton = document.querySelector(".add_button");
addButton.addEventListener("click", () => {
  console.log("add button pressed");
  socket.emit(`user_add`);
});

function deleteUser(id) {
  const blockId = `user_${id}`;
  document.querySelector(`#${blockId}`).remove();
  socket.emit(`remove_user`, id);
}

function addUser(id, full_name, docs) {
  const blockId = `user_${id}`;

  root.insertAdjacentHTML(
    "beforebegin",
    `
        <div id=${blockId}>
          <span>Ваше имя:</span>
          <input class="full_name"value="${full_name}">
          <span>Номер и серия паспорта:</span>
          <input class="docs" value="${docs}">
          <button class= "save_button btn btn-primary">Сохранить</button>
          <button class= "delete_button btn btn-primary">Удалить</button>
        </div>`
  );

  const saveButton = document.querySelector(`#${blockId} .save_button`);
  saveButton.addEventListener("click", () => {
    const full_name = document.querySelector(`#${blockId} .full_name`).value;
    const id = document.querySelector(`#${blockId} .id`).value;
    const docs = document.querySelector(`#${blockId} .docs`).value;

    socket.emit("user_update", { id, full_name, docs });
  });

  const deleteButton = document.querySelector(`#${blockId} .delete_button`);
  deleteButton.addEventListener("click", () => deleteUser(id));
}

async function loadUser() {
  const response = await fetch("/trains/all");

  if (response.ok) {
    const trains = await response.json();
    console.log(trains);

    for (const user of trains) addUser(user.id, user.full_name, user.docs);
  } else {
    console.error(response.status);
  }
}
loadUser();

function updateUser(user) {
  const blockId = `user_${user.id}`;
  document.querySelector(`#${blockId} .full_name`).value = user.full_name;
  document.querySelector(`#${blockId} .docs`).value = user.docs;
}

socket.on("user_updated", updateUser);
socket.on("user_removed", (id) => deleteUser(id));
socket.on("user_added", (id) => {
  console.log(`user added with id = ${id}`);
  addUser(id);
});
