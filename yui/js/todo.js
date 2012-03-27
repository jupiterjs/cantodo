(function() {

YUI().use('calendar', 'json', 'node', function(Y) {

// Basic Todo entry model
// { text: 'todo', complete: false }
can.Model('Todo', {
	
	// Implement local storage handling
	localStore: function(cb){
		var name = 'todos-canjs-yui',
			data = Y.JSON.parse( window.localStorage[name] || (window.localStorage[name] = '{}') ),
			res = cb.call(this, data);
		if(res !== false){
			for (var id in data) {
				delete data[id].editing;
			}
			window.localStorage[name] = Y.JSON.stringify(data);
		}
	},
	
	findAll: function(params, success){
		var def = new can.Deferred();
		this.localStore(function(todos){
			var instances = [];
			for(var id in todos){
				instances.push( new this(todos[id]) )
			}
			def.resolve({data: instances});
		})
		return def;
	},
	
	destroy: function(id, success){
		var def = new can.Deferred();
		this.localStore(function(todos){
			delete todos[id];
			def.resolve({});
		});
		return def
	},
	
	create: function(attrs, success){
		var def = new can.Deferred();
		this.localStore(function(todos){
			attrs.id = attrs.id || parseInt(100000 *Math.random());
			todos[attrs.id] = attrs;
		});
		def.resolve({id : attrs.id});
		return def
	},
	
	update: function(id, attrs, success){
		var def = new can.Deferred();
		this.localStore(function(todos){
			var todo = todos[id];
			can.extend(todo, attrs);
		});
		def.resolve({});
		return def
	}
	
},{});

// List container for Todos, adds utility methods
can.Model.List('Todo.List',{
	
	// Sorts by text content
	sort: function() {
		return [].sort.call(this, function(a,b) {
			return (a.text > b.text && 1) || (a.text < b.text && -1) || 0;
		});
	}
	
});

can.Control('Todos',{

	// Initialize the Todos list
	init : function(){
		var self = this;
		
		// Setup statistics.
		this.stats = new can.Observe();
	
		// Clear the new Todo entry
		Y.one('#new-todo').set('value','').focus();
	
		// Render the Todos
		Todo.findAll({}, function(todos) {
			self.todos = todos.sort();
			self.updateStats();
			Y.one('#todoapp').append(can.view('views/todo', {
				stats: self.stats,
				todos: self.todos
			}));
		});
	},
		
	// Listen for when a new Todo has been entered
	'#new-todo keyup' : function(el, ev){
		if(ev.keyCode == 13){
			var todo = new Todo({
				text : el.get('value'),
				complete : false
			}).save(function() {
				el.set('value','');
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
		el.all('.view').getData('todo').attr('editing', true).save(function() {
			el.all('.edit').focus();
		});
	},
	
	// Listen for an edited Todo
	'.todo .edit keyup' : function(el, ev){
		if(ev.keyCode == 13){
			this['.todo .edit blur'].apply(this, arguments);
		}
	},
	'.todo .edit blur' : function(el, ev) {
		el.ancestor('.todo').all('.view').getData('todo')
			.attr({
				editing: false,
				text: el.get('value')
			}).save();
	},
	
	// Listen for the toggled completion of a Todo
	'.todo .toggle change' : function(el, ev) {
		el.ancestor('.view').getData('todo')
			.attr('complete', el.get('checked'))
			.save();
	},
		
	// Handle an updated Todo
	'{Todo} updated' : function(list, ev, item){
		this.updateStats();
	},
	
	// Listen for a removed Todo
	'.todo .destroy click' : function(el){;
		el.ancestor('.view').getData('todo').destroy();
	},
	
	// Listen for toggle all completed Todos
	'#toggle-all change' : function(el, ev) {
		var toggle = !!this.stats.attr('remaining');
		can.each(this.todos, function(i, todo) {
			todo.attr('complete', toggle).save();
		});
		el.set('checked', toggle);
		Y.all('#todo-list .todo .toggle').set('checked', toggle);
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
		this.stats.attr({
			completed: completed,
			total: this.todos.length,
			remaining: this.todos.length - completed,
			allComplete: this.todos.length === completed
		});
	}

})

new Todos('#todoapp');

});

})();