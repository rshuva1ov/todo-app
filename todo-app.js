(function () {
    let todoArray = []; // основной масив куда все будет стекать
  
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
      let appTitle = document.createElement('h2');
      appTitle.innerHTML = title;
      return appTitle;
    }
  
    // создаем и возаращаем форму для создания дела
    function createTodoItemForm() {
      let form = document.createElement('form');
      let input = document.createElement('input');
      let buttonWrapper = document.createElement('div');
      let button = document.createElement('button');
  
      form.classList.add('input-group', 'mb-3');
      input.classList.add('form-control');
      input.placeholder = 'Введите название нового раздела';
      buttonWrapper.classList.add('input-group-append');
      button.classList.add('btn', 'btn-primary');
      button.textContent = 'Добавить дело';
      button.disabled = true;
      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);
  
      input.addEventListener('input', function () {
        if (input.value.length > 0) {
          button.disabled = false;
        } else if (input.value.length == 0) {
          button.disabled = true;
        }
      });
  
      return {
        form,
        input,
        button,
      };
    }
  
    // создаем и возвращаем элемент списка
    function createTodoItem({
      name,
      done
    }) {
      let item = document.createElement('li');
      // кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement('div');
      let doneButton = document.createElement('button');
      let deleteButton = document.createElement('button');
  
      // создание id и его запись в итем
      let randomId = Math.random() * 15.75;
      item.id = randomId.toFixed(2);
  
      // устанавливаем стили для элемента списка, а также для размещения кнопок
      // в его правой части с помощью flex
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      item.textContent = name;
  
      buttonGroup.classList.add('btn-group', 'btn-group-sm');
      doneButton.classList.add('btn', 'btn-success');
      doneButton.textContent = 'Готово';
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Удалить';
  
      // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);
  
      if (done === true) {
        item.classList.add('list-group-item-success')
      }
  
      // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
      return {
        item,
        doneButton,
        deleteButton,
        buttonGroup
      }
    }
  
    // создаем и возвращаем список элементов
    function createTodoList() {
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list;
    }
  
    //проверка на id
    function changeItemDone(arr, item) {
      arr.map(obj => {
        if (obj.id === item.id & obj.done === false) {
          obj.done = true;
        } else if (obj.id === item.id & obj.done === true) {
          obj.done = false;
        }
      })
    }
  
    //обработчики событий на нажатие кнопки
    function completeButton(item, button) {
      button.addEventListener('click', function () {
        todoArray = JSON.parse(localStorage.getItem(key));
        item.classList.toggle('list-group-item-success');
        changeItemDone(todoArray, item);
        localStorage.setItem(key, JSON.stringify(todoArray));
      });
    }
  
    function removeButton(item, button) {
      button.addEventListener('click', function () {
        if (confirm('Вы уверены?') == true) {
          item.remove();
          todoArray = JSON.parse(localStorage.getItem(key));
          let newList = todoArray.filter(obj => obj.id !== item.id);
  
          localStorage.setItem(key, JSON.stringify(newList));
        }
      });
    }
  
    // функция создания дела
    function createTodoApp(container, title, defaultTasks = [], key) {
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();
  
      // обработка массива деффолтных дел
      for (let i = 0; i < defaultTasks.length; i++) {
        let defaultTodo = createTodoItem(defaultTasks[i]);
        todoList.append(defaultTodo.item);
  
        completeButton(defaultTodo.item, defaultTodo.doneButton);
        removeButton(defaultTodo.item, defaultTodo.deleteButton);
      }
  
      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);
  
      if (localStorage.getItem(key)) {
        todoArray = JSON.parse(localStorage.getItem(key));
  
        for (const obj of todoArray) {
          let todoItem = createTodoItem({
            name: todoItemForm.input.value,
            done: false
          });
  
          todoItem.item.textContent = obj.name;
          todoItem.item.id = obj.id;
  
          if (obj.done == true) {
            todoItem.item.classList.add('list-group-item-success');
          } else {
            todoItem.item.classList.remove('list-group-item-success');
          }
  
          completeButton(todoItem.item, todoItem.doneButton);
          removeButton(todoItem.item, todoItem.deleteButton);
  
          todoList.append(todoItem.item);
          todoItem.item.append(todoItem.buttonGroup);
        }
      }
  
      // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
      todoItemForm.form.addEventListener('submit', function (event) {
        // эта строчка необходима чтобы предотвратить стандартное действие браузера
        // в данном случае мы не хотим, чтобы страница презагружалась при отправке формы
        event.preventDefault();
  
        //добавляем дизейбл кнопке добавить дело
        todoItemForm.button.disabled = true;
        // игнорируем создание элемента, если пользователь ничего не ввел в поле
        if (!todoItemForm.input.value) {
          return;
        }
  
        let todoItem = createTodoItem({
          name: todoItemForm.input.value,
          done: false
        });
  
        // парсим массив из лс наружу
        let localStorageData = localStorage.getItem(key);
        if (localStorageData == null) {
          todoArray = [];
        } else {
          todoArray = JSON.parse(localStorageData);
        }
  
        // создаем объект который будет пушиться в основной масси
        function createItemObj(arr) {
          let itemObj = {};
          itemObj.name = todoItemForm.input.value;
          itemObj.id = todoItem.item.id;
          itemObj.done = false;
  
          arr.push(itemObj);
        }
        createItemObj(todoArray); // вызываем его
        localStorage.setItem(key, JSON.stringify(todoArray)); // записываем в лс
  
        completeButton(todoItem.item, todoItem.doneButton);
        removeButton(todoItem.item, todoItem.deleteButton);
  
        // создаем и добавляем в список новое дело с нахванием из поля для ввода
        todoList.append(todoItem.item);
  
        // обнуляем значение в поле, чтобы не пришлось стирать его вручную
        todoItemForm.input.value = '';
      })
    }
    window.createTodoApp = createTodoApp;
  })();
  
