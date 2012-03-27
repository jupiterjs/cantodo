(function() {

can.Control('Todos',{

	// Initialize the Todos list
	init : function(){
		var self = this;
		
		// Setup statistics.
		this.stats = new can.Observe();
	
		// Clear the new Todo entry
		$('#new-todo').val('').focus();
	
		// Render the Todos
		Todo.findAll({}, function(todos) {
			self.todos = todos.sort();
			self.updateStats();
			$('#todoapp').append(can.view('../common/views/main', { stats: self.stats }));
			$('#todoapp').append(can.view('../common/views/stats', { stats: self.stats }));
			$('#todo-list').append(can.view('../common/views/todos', { todos: self.todos }));
		});
	},
		
	// Listen for when a new Todo has been entered
	'#new-todo keyup' : function(el, ev){
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
	'{Todo} created' : function(list, ev, item){
		this.todos.push(item);
		this.updateStats();
	},
	
	// Listen for editing a Todo
	'.todo dblclick' : function(el) {
		var view = el.children('.view');
		view.data('todo').attr('editing', true).save(function() {
			el.children('.edit').focus();
		});
	},
	
	// Listen for an edited Todo
	'.todo .edit keyup' : function(el, ev){
		if(ev.keyCode == 13){
			this['.todo .edit blur'].apply(this, arguments);
		}
	},
	'.todo .edit blur' : function(el, ev) {
		el.closest('.todo').children('.view').data('todo')
			.attr('editing', false)
			.attr('text', el.val())
			.save();
	},
	
	// Listen for the toggled completion of a Todo
	'.todo .toggle change' : function(el, ev) {
		el.closest('.view').data('todo')
			.attr('complete', el.is(':checked'))
			.save();
	},
		
	// Handle an updated Todo
	'{Todo} updated' : function(list, ev, item){
		this.updateStats();
	},
	
	// Listen for a removed Todo
	'.todo .destroy click' : function(el){;
		el.closest('.view').data('todo').destroy();
	},
	
	// Listen for toggle all completed Todos
	'#toggle-all change' : function(el, ev) {
		var toggle = !!this.stats.attr('remaining');
		can.each(this.todos, function(i, todo) {
			todo.attr('complete', toggle).save();
		});
		el.prop('checked', toggle);
		$('#todo-list .todo .toggle').prop('checked', toggle);
	},
	
	// Listen for removing all completed Todos
	'#clear-completed click' : function() {
		for (var i = this.todos.length - 1, todo; i > -1 && (todo = this.todos[i]); i--) {
			todo.attr('complete') && todo.destroy();
		}
	},
	
	// Handle a destroyed Todo
	'{Todo} destroyed' : function(list, ev, destroyed){
		this.updateStats();
	},
		
	// Calculate the updated statistics
	updateStats : function(){
		var completed = 0;
		can.each(this.todos, function(i, todo) {
			completed += todo.complete ? 1 : 0;
		});
		
		// Update the stats
		this.stats
			.attr('completed', completed)
			.attr('total', this.todos.length)
			.attr('remaining', this.todos.length - completed)
			.attr('allComplete', this.todos.length === completed && completed > 0);
	}

})

new Todos('#todoapp');

})();