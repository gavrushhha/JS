const socket = io();

const root = document.querySelector("#root");
root.insertAdjacentHTML(
  "beforebegin",
  `
  <button class= "add_button btn btn-outline-dark">Добавить машину</button>
  `
);

const addButton = document.querySelector(".add_button");
addButton.addEventListener("click", () => {
  console.log("add button pressed");
  socket.emit(`car_add`);
});

function deleteCar(id) {
  const blockId = `car_${id}`;
  document.querySelector(`#${blockId}`).remove();
  socket.emit(`remove_car`, id);
}

function addCar(id, brand, model, color, number) {
  const blockId = `car_${id}`;

  root.insertAdjacentHTML(
    "beforebegin",
    `
        <div id=${blockId}>
          <span> </span>
          <span>Бренд машины:</span>
          <input class="brand"value="${brand}">
          <span>Модель машины:</span>
          <input class="model" value="${model}">
          <span>Цвет машины:</span>
          <input class="color" value="${color}">
          <span>Номер машины:</span>
          <input class="number" value="${number}">
          <button class= "save_button btn btn-outline-success">Сохранить</button>
          <button class= "delete_button btn btn-outline-danger">Удалить</button>
        </div>`
  );

  const saveButton = document.querySelector(`#${blockId} .save_button`);
  saveButton.addEventListener("click", () => {
    const id = document.querySelector(`#${blockId} .id`).value;
    const brand = document.querySelector(`#${blockId} .brand`).value;
    const model = document.querySelector(`#${blockId} .model`).value;
    const color = document.querySelector(`#${blockId} .color`).value;
    const number = document.querySelector(`#${blockId} .number`).value;


    socket.emit("car_update", {  id, brand, model, color, number });
  });

  const deleteButton = document.querySelector(`#${blockId} .delete_button`);
  deleteButton.addEventListener("click", () => deleteCar(id));
}

async function loadCar() {
  const response = await fetch("/cars/all");

  if (response.ok) {
    const cars = await response.json();
    console.log(cars);

    for (const car of cars) addCar(car.id, car.brand, car.model, car.color, car.number);
  } else {
    console.error(response.status);
  }
}
loadCar();

function updateCar(car) {
  const blockId = `car_${car.id}`;
  const id = document.querySelector(`#${blockId} .id`).value = car.id;
  document.querySelector(`#${blockId} .brand`).value = car.brand;
  document.querySelector(`#${blockId} .model`).value = car.model;
  document.querySelector(`#${blockId} .color`).value = car.color;
  document.querySelector(`#${blockId} .number`).value = car.number;

}

socket.on("car_updated", updateCar);
socket.on("car_removed", (id) => deleteCar(id));
socket.on("car_added", (id) => {
  console.log(`car added with id = ${id}`);
  addCar(id);
});
