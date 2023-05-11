(function () {
  //объявляем функцию создания "названия списка дел", аргументом получаем само название в виде текста
  function createAppTitle(title) {
    //создаем название списка дел
    let appTitle = document.createElement("h2");
    //присваеваем названию текст названия
    appTitle.innerHTML = title;
    //возвращаем называние списка дел
    return appTitle;
  }
  //объявляем функцию создания формы списка дел
  function createTodoItemForm() {
    //создаем саму форму
    let form = document.createElement("form");
    //создаем инпут
    let input = document.createElement("input");
    //создаем див в который будем помещать кнопку, для правильной стилизации стилизации через бутстрап
    let buttonWrapper = document.createElement("div");
    //создаем саму кнопку создания дела
    let button = document.createElement("button");

    //присваиваем форму стили через классы бустрап
    form.classList.add("input-group", "mb-3");
    //присваиваем инпуту стили через классы бустрап
    input.classList.add("form-control");
    //присваеваем инпуту плейсхолдер
    input.placeholder = "Введите название нового дела";
    //присваиваем диву с кнопкой стили через классы бустрап
    buttonWrapper.classList.add("input-group-append");
    //присваиваем кнопке стили через классы бустрап и добавляем текст кнопке
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    //привязываем кнопку к диву
    buttonWrapper.append(button);
    //привязываем инпут к форме
    form.append(input);
    //привязываем див с кнопкой к форме
    form.append(buttonWrapper);

    //возвразаем объект с формой, инпутом и кнопкой, чтоб в дальнейшем можно было привязать к ним слушатели
    return {
      form,
      input,
      button,
    };
  }
  //объявляем функцию создания списка дел
  function createTodoList() {
    //создаем спискок дел
    let list = document.createElement("ul");
    //добавляем списку дел стили через классы бутстрап
    list.classList.add("list-group");
    //возвращаем список дел
    return list;
  }
  //объявляем функцию создания дела, аргументом передаем текст(название дела)
  function createTodoItem(name, done, todos, oldID = null) {
    //создаем новое дело
    let item = document.createElement("li");
    let id = oldID
      ? oldID
      : todos.length > 0
      ? todos[todos.length - 1].id + 1
      : 1;
    let todo = {
      id,
      name,
      done,
    };
    //создаем группу кнопок("Готово" и "Удалить") и объединяем их в группу для стилизации
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    //добавляем стили через классы бутсрап для дела
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-item-center"
    );
    //добавляем текст дела в само дело
    item.textContent = name;

    //добавляем стили через классы бутстрап для группы кнопок дела и текст для самих кнопок
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    //привязываем кнопки к группе кнопок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    //привязываем группу кнопок к делу
    item.append(buttonGroup);

    //возвращаем объект, в котором содержиться дело и кнопки, чтоб можно было привязать их к слушателям
    return {
      item,
      todo,
      doneButton,
      deleteButton,
    };
  }
  function getLocalStorageTodos(todos, todoList, listName) {
    //проверяем существование списка дел
    if (todos) {
        //если список дел есть, перебираем каждое дело и добавляем его в список
      for (const todo of todos) {
        //создаем дело 
        let todoItem = createTodoItem(todo.name, todo.done, todos, todo.id);
        //привязываем слушатель на клик кнопки "Готово" у дела
        todoItem.doneButton.addEventListener("click", function () {
          todoItem.item.classList.toggle("list-group-item-success");
          let index = todos.findIndex((e) => e.id === todoItem.todo.id);
          console.log(index);
          todos[index].done = !todos[index].done;

          //обновляем localStorage
          localStorage.removeItem(listName);
          localStorage.setItem(listName, JSON.stringify(todos));
        });
        //привязываем слушатель на клик кнопки "Удалить" у дела
        todoItem.deleteButton.addEventListener("click", function () {
          if (confirm("Вы уверены?")) {
            todoItem.item.remove();
            let index = todos.findIndex((e) => e.id === todoItem.todo.id);
            todos.splice(index, 1);

            //обновляем localStorage
            localStorage.removeItem(listName);
            localStorage.setItem(listName, JSON.stringify(todos));
          }
        });
        //если дело завершено, то указываем соотвествующий класс бутстрап для изменения стилей
        if (todo.done) {
          todoItem.item.classList.toggle("list-group-item-success");
        }
        //добавляем дело в список дел
        todoList.append(todoItem.item);
      }
    }
  }

  //объявляем функцию создания приложения, аргументом передаем контейнер страницы, название списка дел
  function createTodoApp(container, title = "Список дел", listName) {
    let localStorage = window.localStorage;
    console.log(localStorage);
    //создаем название списка дел
    let todoAppTitle = createAppTitle(title);
    //создаем форму добавления дел
    let todoItemForm = createTodoItemForm();
    //создаем список дел
    let todoList = createTodoList();
    let todos = JSON.parse(localStorage.getItem(listName)) ? JSON.parse(localStorage.getItem(listName)): [];
    //добавляем созданные переменные в контейнер страницы
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    //устанавливаем кнопке создания дела атрибут disabled
    todoItemForm.button.disabled = true;
    //добавляем все дела из localStorage
    getLocalStorageTodos(todos, todoList, listName);

    todoItemForm.input.addEventListener("input", function () {
      //проверяем, если инпут формы пустой, но нажали на энтер или кнопку "создать", то ничего не делаем
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
      } else {
        todoItemForm.button.disabled = false;
      }
    });
    //привязываемся к событию создания дела в "форме создания дел"
    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();
      //проверяем, если инпут формы пустой, но нажали на энтер или кнопку "создать", то ничего не делаем
      if (!todoItemForm.input.value) {
        return;
      }
      //В противном случае создаем новое дело, аргументом передаем текст из инпута
      let todoItem = createTodoItem(todoItemForm.input.value, false, todos);

      //привязываем слушатель на клик кнопки "Готово" у дела
      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");
        let index = todos.findIndex((e) => e.id === todoItem.todo.id);
        todos[index].done = !todos[index].done;

        //обновляем localStorage
        localStorage.removeItem(listName);
        localStorage.setItem(listName, JSON.stringify(todos));
      });
      //привязываем слушатель на клик кнопки "Удалить" у дела
      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          todoItem.item.remove();
          let index = todos.findIndex((e) => e.id === todoItem.todo.id);
          todos.splice(index, 1);

          //обновляем localStorage
          localStorage.removeItem(listName);
          localStorage.setItem(listName, JSON.stringify(todos));
        }
      });
      //Добавляем дело в список дел
      todoList.append(todoItem.item);
      todos.push(todoItem.todo);
      //зачищаем инпут
      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;

      //добавляем в localStorage
      localStorage.removeItem(listName);
      localStorage.setItem(listName, JSON.stringify(todos));
    });
  }

  //глобально регистрируем функцию создания приложения
  window.createTodoApp = createTodoApp;
})();
