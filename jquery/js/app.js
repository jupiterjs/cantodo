(function() {

can.Control('Todos',{

	// Initialize the Todos list
	init : function(){
		var self = this;
		
		// Setup statistics.
		this.stats = new can.Observe({
			completed: 0,
			total: 0,
			remaining: 0
		});
	
		// Clear the new Todo entry
		$("#new-todo").val('').focus();
	
		// Render the Todos
		Todo.findAll({}, function(todos) {
			self.todos = todos.sort();
			self.updateStats();
			$('#todo-list').append(can.view('../common/views/todos', { todos: self.todos }));
			$('#stats').append(can.view('../common/views/stats', { stats: self.stats }));
		});
	},
		
	// Listen for when a new Todo has been entered
	"#new-todo keyup" : function(el, ev){
		if(ev.keyCode == 13){
			var todo = new Todo({
				text : el.val(),
				complete : false
			}).save(function() {
				el.val('');
			});
		}
	},
	
	// Handle a newly created Todo
	"{Todo} created" : function(list, ev, item){
		$('#todo-list').append(can.view('../common/views/todo', { todo: item }));
		this.updateStats(1);
	},
	
	// Listen for editing a Todo
	".todo dblclick" : function(el) {
		var view = el.children('.view');
		view.data('todo').attr('editing', true).save(function() {
			el.children('.edit').focus();
		});
	},
	
	// Listen for an edited Todo
	".todo .edit keyup" : function(el, ev){
		if(ev.keyCode == 13){
			this[".todo .edit blur"].apply(this, arguments);
		}
	},
	".todo .edit blur" : function(el, ev) {
		el.closest('.todo').children('.view').data('todo')
			.attr('editing', false)
			.attr('text', el.val())
			.save();
	},
	
	// Listen for the toggled completion of a Todo
	".todo .toggle change" : function(el, ev) {
		el.closest('.view').data('todo')
			.attr('complete', el.is(':checked'))
			.save();
	},
		
	// Handle an updated Todo
	"{Todo} updated" : function(list, ev, item){
		this.updateStats();
	},
	
	// Listen for a removed Todo
	".todo .destroy click" : function(el){;
		el.closest('.view').data('todo').destroy();
	},
	
	// Listen for removing all completed Todos
	"#clear-completed click" : function() {
		for (var i = this.todos.length - 1, todo; i > -1 && (todo = this.todos[i]); i--) {
			todo.attr('complete') && todo.destroy();
		}
	},
	
	// Handle a destroyed Todo
	"{Todo} destroyed" : function(list, ev, destroyed){
		this.updateStats();
	},
		
	// Calculate the updated statistics
	updateStats : function(created){
		var completed = 0;
		can.each(this.todos, function(i, todo) {
			completed += todo.complete ? 1 : 0;
		});
		
		// Update the stats
		this.stats
			.attr('completed', completed)
			.attr('total', this.todos.length + (created || 0))
			.attr('remaining', this.todos.length + (created || 0) - completed);
	}

})

new Todos('#todoapp');

})();