require({
	packages: [{
    	name: "can/dojo",
    	location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs",
    	main: "can.dojo-edge"
	}]
})
require(['can/dojo', "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/NodeList-manipulate", "dijit/CalendarLite", "dijit/place", "dijit/focus", "dojo/date",  "dojo/domReady!"], function(can, dom, domConstruct, domAttr){
// Basic Todo entry model
// { text: 'todo', complete: false }
can.Model('Todo', {
	
	// Implement local storage handling
	localStore: function(cb){
		var name = 'todos-canjs-dojo',
			data = dojo.fromJson( window.localStorage[name] || (window.localStorage[name] = '[]') ),
			res = cb.call(this, data);
		if(res !== false){
			can.each(data, function(i, todo) {
				delete todo.editing;
			});
			window.localStorage[name] = dojo.toJson(data);
		}
	},
	
	findAll: function(params, success){
		var def = new dojo.Deferred();
		this.localStore(function(todos){
			var instances = [],
				self = this;
			can.each(todos, function(i, todo) {
				instances.push(new self(todo));
			});
			def.resolve({data: instances});
		})
		return def;
	},
	
	destroy: function(id, success){
		var def = new dojo.Deferred();
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					todos.splice(i, 1);
					break;
				}
			}
			def.resolve({});
		});
		return def
	},
	
	create: function(attrs, success){
		var def = new dojo.Deferred();
		this.localStore(function(todos){
			attrs.id = attrs.id || parseInt(100000 *Math.random());
			todos.push(attrs);
		});
		def.resolve({id : attrs.id});
		return def
	},
	
	update: function(id, attrs, success){
		var def = new dojo.Deferred();
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					var todo = todos[i];
					break;
				}
			}
			can.extend(todo, attrs);
		});
		def.resolve({});
		return def
	}
	
},{});

// List for Todos
can.Model.List('Todo.List',{
	// Utility methods go here
});

can.Control('Todos',{

	// Initialize the Todos list
	init : function(){
		// Initialize statistics
		this['{todos} change']();
	
		// Render the Todos
		this.element.append(can.view('views/todo', {
			stats: this.stats,
			todos: this.options.todos
		}));
		
		// Clear the new todo field
		//TODO: this doesn't focus the text box
		dijit.focus(dojo.byId('#new-todo'));
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
		this.options.todos.push(item);
	},
	
	// Listen for editing a Todo
	'.todo dblclick' : function(el) {
		can.data(el, 'todo').attr('editing', true).save(function(){
			dijit.focus(el.children('.edit'));
		});
	},

	// Listen for an edited Todo
	'.todo .edit keyup' : function(el, ev){
		if(ev.keyCode == 13){
			this['.todo .edit focusout'].apply(this, arguments);
		}
	},

	'.todo .edit focusout' : function(el, ev) {
		can.data(el.closest('.todo'), 'todo')
			.attr({
				editing: false,
				text: el.val()
			}).save();
	},

	// Listen for the toggled completion of a Todo
	'.todo .toggle change' : function(el, ev) {
		can.data(el.closest('.todo'), 'todo')
			.attr('complete', el.attr('checked')[0])
			.save();
	},

	// Listen for a removed Todo
	'.todo .destroy click' : function(el){
		can.data(el.closest('.todo'), 'todo').destroy();
	},

	// Listen for toggle all completed Todos
	'#toggle-all change' : function(el, ev) {
		var toggle = !!this.stats.attr('remaining');
		can.each(this.options.todos, function(i, todo) {
			todo.attr('complete', toggle).save();
		});
		el.attr('checked', toggle);
		dojo.query('#todo-list .todo .toggle').attr('checked', toggle);
	},
	
	// Listen for removing all completed Todos
	'#clear-completed click' : function() {
		for (var i = this.options.todos.length - 1, todo; i > -1 && (todo = this.options.todos[i]); i--) {
			todo.attr('complete') && todo.destroy();
		}
	},

	// Update statistics on change in the Todo list
	'{todos} change' : function(){
		var completed = 0,
			length = this.options.todos.length;

		can.each(this.options.todos, function(i, todo) {
			completed += todo.complete ? 1 : 0;
		});
		
		// Update the stats
		this.stats = this.stats || new can.Observe();
		this.stats.attr({
			completed: completed,
			total: length,
			remaining: length - completed,
			allComplete: length === completed
		});
		
		if(dojo.query('#toggle-all')) dojo.query('#toggle-all').attr('checked', length === completed);
	}

})

// Initialize the app
Todo.findAll({}, function(todos) {
	new Todos('#todoapp', {
		todos: todos
	});
});

});