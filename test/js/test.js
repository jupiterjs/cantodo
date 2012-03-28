steal('funcunit', 'funcunit/qunit').then(function() {
	
	// Handle multiple library testing
	var oldmodule = window.module;
	window.module = function(name, testEnvironment) {
		oldmodule(TODOLIB + '/' + name, testEnvironment);
	};
	
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
	
	// Helpers for easily modifying todos
	var helpers = {
		add: function(nthChild, text) {
			S('#new-todo').type(text + '\r');
			S('#todo-list .todo:nth-child('+nthChild+') label').text(text, 'added a todo');
		},
		
		edit: function(nthChild, text) {
			S('#todo-list .todo:nth-child('+nthChild+')').dblclick();
			S('#todo-list .todo:nth-child('+nthChild+') .edit').type(text + '\r');
			S('#todo-list .todo:nth-child('+nthChild+') label').text(text, 'edited a todo');
		},
		
		complete: function(nthChild) {
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').then(function(el) {
				el.prop('checked', false);
			});
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').click();
			S('#todo-list .todo:nth-child('+nthChild+')').hasClass('done', true, 'completed a todo');
		},
		
		incomplete: function(nthChild) {
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').then(function(el) {
				el.prop('checked', true);
			});
			S('#todo-list .todo:nth-child('+nthChild+') .toggle').click();
			S('#todo-list .todo:nth-child('+nthChild+')').hasClass('done', false, 'incompleted a todo');
		},
		
		remove: function(nthChild) {
			S('#todo-list .todo:nth-child('+nthChild+') .destroy').click();
			S('#todo-list .todo:nth-child('+nthChild+')').missing('remove a todo');
		}
	};
		
	test('Add, edit, complete, incomplete, and remove a todo', function() {
		helpers.add(1, 'new todo');
		helpers.edit(1, 'edited todo');
		helpers.complete(1);
		helpers.incomplete(1);
		helpers.remove(1);
	});
	
});
