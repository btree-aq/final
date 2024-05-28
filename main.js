const taskInput = document.querySelector('.task-input input');
const addButton = document.querySelectorAll('.text-input, .add-button');
const taskBox = document.querySelector('.task-box');
const filters = document.querySelectorAll('.filters span');
const clearAllBtn = document.querySelector('.clear-button');
const pendingTasks = document.querySelector('.footer-note');


let todos = JSON.parse(localStorage.getItem('todo-list'));
let isEditedTask = false;

showTask('all');

addButton.forEach((addEvent) => {
	if (addEvent.id == 'text-input') {
		addEvent.addEventListener('keyup', (e) => taskEvents(e));
	} else {
		addEvent.addEventListener('click', (e) => taskEvents(e));
	}
});
filters.forEach((btn) => {
	btn.addEventListener('click', () => {
		document.querySelector('span.active').classList.remove('active');
		btn.classList.add('active');
		showTask(btn.id);
		taskInput.focus();
	});
});
pendingTasks.addEventListener('click', filterBtn);
clearAllBtn.addEventListener('click', clearAllCompleted);

function taskEvents(e) {
	let inputValue = taskInput.value.trim();
	if ((e.key == 'Enter' || e.type == 'click') && inputValue) {
		if (!isEditedTask) {
			if (!todos) {
				todos = [];
			}
			let taskInfo = { name: inputValue, status: 'pending' };
			todos.push(taskInfo);
		} else {
			isEditedTask = false;
			todos[editId].name = inputValue;
		}
		localStorage.setItem('todo-list', JSON.stringify(todos));

		showTask('all');
		taskInput.value = '';
	}
	taskInput.focus();
}

function showTask(filter) {
	let li = '';
	let numOfPendingTasks = 0;
	if ((filter === 'all') || (filter === 'pending') ) {
		document.querySelector('.clear-button').style.visibility = "hidden"
		} else {
			document.querySelector('.clear-button').style.visibility = "visible";
	};


	if (todos) {
		todos.forEach((currentValue, index) => {
			let isCompleted = currentValue.status == 'completed' ? 'checked' : '';

			if (filter == currentValue.status || filter == 'all') {
				li += `<li class="task">
								<div class="task-container">
									<label for="${index}">
										<input type="checkbox" onclick="updateStatus(this)" id="${index}" ${isCompleted} />
										<p id="text${index}" class ="${isCompleted}">${currentValue.name}</p>
									</label>
									<div class="settings">
										<ul class="task-menu">

											<li onclick="deleteTask(${index})"><i class="fa-solid fa-trash" style="color: #cfd8dc;"></i></li>
										</ul>
									</div>
								</div>
							</li>`;
			}
			if (todos[index].status == 'pending') {
				numOfPendingTasks++;
			}
		});
	}

	if (filter == 'all') {
		filters.forEach((btn) => {
			if (btn.id == 'all') {
				document.querySelector('span.active').classList.remove('active');
				btn.classList.add('active');
			}
		});
	}

	taskBox.innerHTML = li || `<span>There aren´t tasks</span>`;

}

function filterBtn() {
	filters.forEach((btn) => {
		if (btn.id == 'pending') {
			document.querySelector('span.active').classList.remove('active');
			btn.classList.add('active');
		}
	});
	showTask('pending');
	taskInput.focus();
}

function updateStatus(selectedTask) {
	let task = selectedTask.parentElement.lastElementChild;
	if (selectedTask.checked) {
		task.classList.add('checked');
		todos[selectedTask.id].status = 'completed';
	} else {
		task.classList.remove('checked');
		todos[selectedTask.id].status = 'pending';
	}
	showTask('all');
	localStorage.setItem('todo-list', JSON.stringify(todos));
}

function showMenu(selectedtask) {
	let taskMenu = selectedtask.parentElement.lastElementChild;
	taskMenu.classList.add('show');
	document.addEventListener('click', (e) => {
		if (e.target.tagName != 'I' || e.target != selectedtask) {
			taskMenu.classList.remove('show');
		}
	});
}

function deleteTask(index) {
	todos.splice(index, 1);
	localStorage.setItem('todo-list', JSON.stringify(todos));
	showTask('all');
}

function clearAll() {
	todos.splice(0, todos.length);
	localStorage.setItem('todo-list', JSON.stringify(todos));
	showTask('all');
	taskInput.focus();
}

function clearAllCompleted() {
	todos = todos.filter((e) => (e.status != 'completed'))
	localStorage.setItem('todo-list', JSON.stringify(todos));
	showTask('completed');
	taskInput.focus();
}
