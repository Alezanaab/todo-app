$(document).ready(function () {


	var util = {
		store: (namespace, data) => {
			if (data) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = JSON.parse(localStorage.getItem(namespace) || "[]");
				return store;
			}
		},

	}

	var App = {
		init: function () {
			this.todos = this.getAllTodos();
			this.tasks = this.todos.filter(todo => !todo.completed).length;
			this.events();
			console.log(this.tasks);
			this.viewAll();
			this.all = true;
			this.completed = false;
			this.active = false;
		},
		events: function () {
			$('label#todoscompleted').append('Task left ' + this.tasks);
			$('input#newTodo').on('keyup', this.createTodo.bind(this));
			$("ul#todo-items").on("click", "input[type=checkbox]", this.completedTodo.bind(this));
			$("ul#todo-items").on("click", "input[type=text]", this.showDelete.bind(this));
			$("ul#todo-items").on("focusout", "input[type=text]", this.hide.bind(this));
			$("ul#todo-items").on("keyup", "input[type=text]", (e) => {
				var index = $(e.target).closest("div.input-group").index();
				var todo = this.todos[index];
				console.log(todo);
				this.todos[index].todo = e.target.value;
				console.log(this.todos);
				$(this).val(e.target.value);
				util.store('todos', this.todos);
			});
			$("ul#todo-items").on("click", "span", this.deleteTodo.bind(this));

			$("#myButtons :input").on("change", (e) => {
				console.log(this.all, this.active, this.completed);

				if (e.target.id == 'all') {
					this.all = true;
					this.completed = false;
					this.active = false;
					this.viewAll();
				} else if (e.target.id == 'active') {
					this.all = false;
					this.completed = false;
					this.active = true;
					this.viewActive();
				} else if (e.target.id == 'completed') {
					this.all = false;
					this.completed = true;
					this.active = false;
					this.viewComplete();
				};
				console.log(this.all, this.active, this.completed);
			});
		},
		getAllTodos: function () {
			return util.store('todos');
		},
		showDelete: function (e) {
			var index = $(e.target).closest("div.input-group");
			$("i").css({ "visibility": "hidden" });
			index.find("i").css({ "visibility": "visible" });
			index.find("input.form-control").removeClass("lined-text");
		},
		hide: function (e) {
			var index = $(e.target).closest("div.input-group").index();
			console.log(index);
			$("i").css({ "visibility": "hidden" });
			console.log(this.todos[index].completed);
			if (this.todos[index].completed) {
				$(e.target).closest("div.input-group").find("input.form-control").addClass("lined-text");
			}
		},
		createTodo: function (e) {
			console.log(this.todos);
			if (e.keyCode === 13) {
				console.log(e.target.value);
				var todo = {
					todo: e.target.value,
					completed: false
				};
				this.todos.push(todo);
				util.store('todos', this.todos);
				this.viewElement(todo);
			} else {
				return;
			}
			$('input#newTodo').val('');
			$("#myButtons").find('label').removeClass('active');
			if (this.all) {
				this.all = true;
				this.completed = false;
				this.active = false;
				console.log($("#myButtons").find('label > input#all'));
				$("#myButtons").find('label > input#all').parent().addClass('active');
			} else if (this.active) {
				this.all = false;
				this.completed = false;
				this.active = true;
				console.log($("#myButtons").find('label > input#all'));
				$("#myButtons").find('label > input#all').parent().addClass('active');

			} else if (this.completed) {
				this.all = false;
				this.completed = true;
				this.active = false;
				console.log($("#myButtons").find('label > input#all'));
				$("#myButtons").find('label > input#all').parent().addClass('active');
			};
			this.viewAll();
		},
		deleteTodo: function (e) {
			var index = $(e.target).closest("div.input-group").index();
			var element = $('ul#todo-items');
			console.log('Is this task complete',this.todos[index].completed);
			if (!this.todos[index].completed) {
				this.tasks--;
				console.log('task', this.tasks);
				$('label#todoscompleted').text('Task left ' + this.tasks);
			}
			element.children().eq(index).remove();
			this.todos.splice(index, 1);
			localStorage.setItem('todos', JSON.stringify(this.todos));

		},
		completedTodo: function (e) {
			var index = $(e.target).closest("div.input-group").index();
			var input = $(e.target).closest("div.input-group").find('input.form-control').val();
			var element = $('ul#todo-items');
			console.log('input', input);
			var todo = this.todos.find(e => e.todo === input);
			console.log(this.todos.find(e => e.todo === input));
			console.log('cheked', this.checked);
			console.log('todo', todo);

			if (!todo.completed) {
				this.checked = true;
				console.log('input', input);

				this.tasks--;
				console.log('tasks', this.tasks);
				$('label#todoscompleted').text('Task left ' + this.tasks);
				this.todos.find(e => e.todo === input).completed = true;
			} else {
				this.checked = false;
				this.tasks++;
				console.log('tasks', this.tasks);
				$('label#todoscompleted').text('Task left ' + this.tasks);
				this.todos.find(e => e.todo === input).completed = false;
			}
			console.log(this.todos);
			console.log(this.tasks);

			localStorage.setItem('todos', JSON.stringify(this.todos));
			console.log(this.all, this.active, this.completed);

			if (this.active) {
				element.empty();
				this.viewActive();
			} else if (this.all) {
				element.empty();
				this.viewAll();
			} else if (this.completed) {
				element.empty();
				console.log(completed);
				this.viewComplete();
			} else {
				element.empty();
				this.viewAll();
			}
		},
		viewAll: function () {
			var todos = this.todos;
			var element = $('ul#todo-items');
			element.empty();
			if (todos) {
				todos.forEach(todo => {
					if (todo.completed) {
						todo = '<div class="input-group">' +
							'<div class="input-group-prepend">' +
							'<div class="input-group-text">' +
							'<input type="checkbox" aria-label="Checkbox for following text input" checked="checked">' +
							'</div>' +
							'</div>' +
							'<input type="text" class="form-control lined-text" aria-label="Text input with checkbox"  value="' + todo.todo + '">' +
							'<div class="input-group-append">' +
							'<span class="input-group-text">' +
							'<i class="fa fa-times"></i>' +
							'</span>' +
							'</div>' +
							'</div>';
						var html = $(todo);
						html.find('input[type=checkbox]').prop("checked", true);
					} else {
						todo = '<div class="input-group">' +
							'<div class="input-group-prepend">' +
							'<div class="input-group-text">' +
							'<input type="checkbox" aria-label="Checkbox for following text input">' +
							'</div>' +
							'</div>' +
							'<input type="text" class="form-control" aria-label="Text input with checkbox" value="' + todo.todo + '">' +
							'<div class="input-group-append">' +
							'<span class="input-group-text">' +
							'<i class="fa fa-times"></i>' +
							'</span>' +
							'</div>' +
							'</div>';
						var html = $(todo);
						html.find('input[type=checkbox]').prop("checked", false);
					}
					element.append(html);
				});
			}
		},
		viewActive: function () {
			console.log('viewActive');
			var todos = this.todos;
			var element = $('ul#todo-items');
			element.empty();
			if (todos) {
				todos.forEach(todo => {
					if (!todo.completed) {
						var todo = '<div class="input-group">' +
							'<div class="input-group-prepend">' +
							'<div class="input-group-text">' +
							'<input type="checkbox" aria-label="Checkbox for following text input" >' +
							'</div>' +
							'</div>' +
							'<input type="text" class="form-control" aria-label="Text input with checkbox" readonly value="' + todo.todo + '">' +
							'<div class="input-group-append">' +
							'<span class="input-group-text">' +
							'<i class="fa fa-times"></i>' +
							'</span>' +
							'</div>' +
							'</div>';
						html = $(todo);
						html.find('input[type=checkbox]').prop("checked", false);
						element.append(html);
					}
				});
			}
		},
		viewComplete: function () {
			console.log('viewCompleted');
			var todos = this.todos;
			console.log(todos);
			var element = $('ul#todo-items');
			element.empty();
			if (todos) {
				todos.forEach(todo => {
					if (todo.completed) {
						var todo = '<div class="input-group">' +
							'<div class="input-group-prepend">' +
							'<div class="input-group-text">' +
							'<input type="checkbox" aria-label="Checkbox for following text input">' +
							'</div>' +
							'</div>' +
							'<input type="text" class="form-control lined-text" aria-label="Text input with checkbox" readonly value="' + todo.todo + '">' +
							'<div class="input-group-append">' +
							'<span class="input-group-text">' +
							'<i class="fa fa-times"></i>' +
							'</span>' +
							'</div>' +
							'</div>';
						html = $(todo);
						html.find('input[type=checkbox]').prop("checked", true);
						element.append(html);
					}
				});
			}
		},
		viewElement: function (todo) {
			var element = $('ul#todo-items');
			var todo = '<div class="input-group">' +
				'<div class="input-group-prepend">' +
				'<div class="input-group-text">' +
				'<input type="checkbox" aria-label="Checkbox for following text input">' +
				'</div>' +
				'</div>' +
				'<input type="text" class="form-control" aria-label="Text input with checkbox" value="' + todo.todo + '">' +
				'<div class="input-group-append">' +
				'<span class="input-group-text"><i class="fa fa-times"></i></span>' +
				'</div>' +
				'</div>';
			html = $(todo);
			html.find('input[type=checkbox]').prop("checked", false);
			this.tasks++;
			console.log('tasks', this.tasks);
			$('label#todoscompleted').text('Task left ' + this.tasks);
			element.append(html);
		},
	};

	App.init();
});