steal('funcunit', 'funcunit/qunit').then(function() {
	
	// Handle multiple library testing
	var oldmodule = window.module;
	window.module = function(name, testEnvironment) {
		oldmodule(TODOLIB + '/' + name, testEnvironment);
	}
	
	module('js/todo.js', {
		setup: function() {
			S.open('../' + TODOLIB);
			S('#todoapp').then(function(el) {
				var doc = el[0].ownerDocument,
					win = doc.defaultView || doc.parentWindow;
				win.localStorage.removeItem('todos-canjs-' + TODOLIB);
			});
		},
		teardown: function() {
			S('#todoapp').then(function(el) {
				var doc = el[0].ownerDocument,
					win = doc.defaultView || doc.parentWindow;
				win.localStorage.removeItem('todos-canjs-' + TODOLIB);
			});
		}
	});
		
	test('Add a todo', function() {
		S('#new-todo').type('new todo\r');
		S('#todo-list .todo:last-child label').text('new todo', 'has new todo');
	});
	
	test('Edit a todo', function() {
		S('#new-todo').type('new todo\r');
		S('#todo-list .todo:last-child').dblclick();
		S('#todo-list .todo:last-child .edit').type('edited todo\r');
		S('#todo-list .todo:last-child label').text('edited todo', 'has edited todo');
	});
	
});
