console.log('Скрипт подключен')

const STORAGE_KEY = 'todos'

const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const emptyState = document.getElementById('empty-state')
const counter = document.getElementById('counter')
const clearBtn = document.getElementById('clear-btn')

let todos = []

function loadTodos() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) {
            todos = []
            return
        }
        const parsed = JSON.parse(raw)
        todos = Array.isArray(parsed) ? parsed : []
    } catch (err) {
        console.error('Не удалось прочитать задачи из localStorage:', err)
        todos = []
    }
}

function saveTodos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (err) {
        console.error('Не удалось прочитать задачи из localStorage:', err)
    }
}

function render() {
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo" + (todo.done ? " todo--done" : "");
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo__checkbox";
    checkbox.checked = todo.done;

    const text = document.createElement("span");
    text.className = "todo__text";
    text.textContent = todo.text; // именно textContent!

    const del = document.createElement("button");
    del.type = "button";
    del.className = "todo__delete";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Удалить задачу");

    li.append(checkbox, text, del);
    list.append(li);
  });

  emptyState.hidden = todos.length > 0;

  const doneCount = todos.filter((t) => t.done).length;
  counter.textContent = `Всего: ${todos.length} | Выполнено: ${doneCount}`;
}

function addTodo(text) {
    todos.push({
        id: Date.now(),
        text: text.trim(),
        done: false,
        createdAt: new Date().toISOString(),
    })
    saveTodos()
    render()
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id)
    if (!todo) {
        return
    }
    todo.done = !todo.done
    saveTodos()
    render()
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id)
    saveTodos()
    render()
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value.trim()
    if (!text) return
    addTodo(text)
    input.value = ''
    input.focus()
})

list.addEventListener("click", (e) => {
  const li = e.target.closest(".todo");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains("todo__checkbox")) {
    toggleTodo(id);
  } else if (e.target.classList.contains("todo__delete")) {
    deleteTodo(id);
  }
});

clearBtn.addEventListener("click", (e)=> {
    if (todos.length === 0) {
        return
    }
    if (!confirm("Удалить все задачи?")) {
        return
    }
    todos = []
    saveTodos()
    render()
})

loadTodos()
render()