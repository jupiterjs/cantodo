(function() {

YUI().use('calendar', 'json', 'node', function(Y) {
  Y.one('body').addClass('yui3-skin-sam');

	can.Model('Todo', {
		localStore: function(cb){
			var name = 'todo-canjs-yui',
				data = Y.JSON.parse( window.localStorage[name] || (window.localStorage[name] = "{}") ),
				res = cb.call(this, data);
			if(res !== false){
				console.log(Y.JSON.stringify(data));
				window.localStorage[name] = Y.JSON.stringify(data);
			}
		},
		findAll: function(params, success){
			var def = new can.Deferred();
			this.localStore(function(todos){
				var instances = [];
				for(var id in todos){
					instances.push( new this( todos[id]) )
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
	
	/**
	 * Helper methods on collections of todos.  But lists can also use their model's 
	 * methods.  Ex:
	 * 
	 *   var todos = [new Todo({id: 5}) , new Todo({id: 6})],
	 *       list = new Todo.List(todos);
	 *       
	 *   list.destroyAll() -> calls Todo.destroyAll with [5,6].
	 */
	can.Model.List('Todo.List',{
	});
	
	/**
	 * A Todos widget created like
	 * 
	 *    $("#todos").todos({ list: new Todo.List() });
	 *    
	 * It listens on changes to the list and items in the list with the following actions:
	 * 
	 *   - "{list} add"    - todos being added to the list
	 *   - "{list} remove" - todos being removed from the list
	 *   - "{list} update" - todos being updated in the list
	 *   
	 */
	can.Control('Todos',{
	
		// sets up the widget
		init : function(){
			var self = this;
			this.calendar = this.options.calendar;
		
			// empties the create input element
			Y.one("#new-todo").set("value","").focus();
		
			// fills this list of items (creates add events on the list)
			Todo.findAll({}, function(todos) {
				self.todos = todos;
				can.$('#todo-list').append(can.view('views/todos', { todos: todos }));
			});
		},
			
		// listens for key events and creates a new todo
		"#new-todo keyup" : function(el, ev){
			if(ev.keyCode == 13){
				var todo = new Todo({
					text : el.get('value'),
					complete : false
				}).save(function() {
					el.set('value','');
				});
			}
		},
			
		// Creating a todo --------------
		// When a todo is created, add it to this list
		"{Todo} created" : function(list, ev, item){
			console.log('created');
			Y.one('#todo-list').append(can.view('views/todo', { todo: item }))
			 	
			// calls a helper to update the stats info
			this.updateStats();
		},
			
		"{Todo} destroyed" : function(list, ev, destroyed){		
			console.log('destroyed');
			var index = this.todos.indexOf(destroyed);
			// console.log(Y.one("#todo-list li:nth-child("+(index+1)+")").getDOMNode().innerHTML);
			return;
			Y.one("#todo-list li:nth-child("+(index+1)+")").remove()
			 	
			// calls a helper to update the stats info
			this.updateStats();
		},
					
		// Destroying a todo --------------
		// the clear button is clicked
		"#clear-completed click" : function(){
			console.log('clear-completed');
			can.each(this.todos, function(i, todo) {
				if (todo.complete) {
					todo.destroy();
				}
			});
		},
			
		// When a todo's destroy button is clicked.
		".todo .destroy click" : function(el){
			// console.log(can.data(can.$(el.ancestor('.todo')), 'todo'));
			// var todo = can.data(can.$(el.ancestor('.todo')), 'todo').destroy();
			el.ancestor('.todo').destroy();
		},
			
			
		// // Updating a todo --------------
		// 	
		// // when the checkbox changes, update the model
		// ".todo [name=complete] change" : function(el, ev) {
		// 	var todo = can.data(el.ancestor('.todo'), 'todo').update({
		// 		complete : el.is(':checked')
		// 	});
		// },
		// 	
		// // switch to edit mode
		// ".todo dblclick" : function(el){
		// 	var input = can.$("<input name='text' class='text'/>").set('value', el.getData('todo').text)
		// 	el.setContent(input);
		// 	input.focus();
		// },
		// 	
		// // update the todo's text on blur
		// ".todo [name=text] focusout" : function(el, ev){
		// 
		// 	var todo = el.ancestor('.todo').getData('todo').update({
		// 		text : el.get('value')
		// 	});
		// },
		// 	
		// // when an item is updated
		// "{Todo} updated" : function(list, ev, item){
		// 	item.elements().setContent(can.view('views/todo', { todo: item }));
		// 	this.updateStats();
		// 	//update completed
		// },
			
		// a helper that updates the stats
		updateStats : function(){
			// var list = this.options.list,
			// 	completed = list.completed().length;
			// $("#todo-stats").html("statsEJS",{
			// 	completed : completed,
			// 	total : list.length,
			// 	remaining : list.length - completed
			// })
		},
		
		"{calendar} selectionChange": function(calendar, date){
			console.log('selectionChange', arguments);
			// var target = calendar.updateTarget,
			// 	newDate = date !== null ? new Date(date) : null;
			// 
			// if(target instanceof Todo) {
			// 	var list = target.done ? this.done : this.todos
			// 		index = list.indexOf(target);
			// 
			// 	target.attr('whenRaw', newDate)
			// 		.attr('when', Todo.formatDate(newDate))
			// 		.attr('late', Todo.isLate(newDate))
			// 		.save();
			// 	list[index] = target;
			// } else {
			// 	target.val(Todo.formatDate(newDate))
			// 	can.data(target, 'date', newDate)
			// }
		}
	})
	
  var calendar = new Y.Calendar({
    contentBox: "#calendar",
    height:'200px',
    width:'200px',
    showPrevMonth: true,
    showNextMonth: true,
    date: new Date() }).render();
	// 
	// calendar.on('selectionChange', function() {
	// 	console.warn(arguments);
	// });

	// new Todos(Y.one("#todoapp"), {
	// 	calendar: calendar
	// });
	new Todos(Y.one('#todoapp'), {
		calendar: calendar
	});
	
});

})();