(function() {

can.Model('Todo', {
	localStore: function(cb){
		var name = 'cantodo-jquery',
			data = $.parseJSON( window.localStorage[name] || (window.localStorage[name] = "{}") ),
			res = cb.call(this, data);
		if(res !== false){
			window.localStorage[name] = JSON.stringify(data);
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

can.Model.List('Todo.List',{
	
	sort: function() {
		return [].sort.call(this, function(a,b) {
			return (a.text > b.text && 1) || (a.text < b.text && -1) || 0;
		});
	}
	
});

can.Control('Todos',{

	init : function(){
		var self = this;
		this.calendar = this.options.calendar;
	
		// empties the create input element
		$("#new-todo").val('').focus();
	
		// fills this list of items (creates add events on the list)
		Todo.findAll({}, function(todos) {
			self.todos = todos.sort();
			$('#todo-list').append(can.view('views/todos', { todos: todos }));
		});
	},
		
	// listens for key events and creates a new todo
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
		
	"{Todo} created" : function(list, ev, item){
		$('#todo-list').append(can.view('views/todo', { todo: item }))
		 	
		this.updateStats();
	},
		
	"{Todo} destroyed" : function(list, ev, destroyed){
		this.updateStats();
	},
				
	"#clear-completed click" : function() {
		can.each(this.todos, function(i, todo) {
			if (todo.complete) {
				todo.destroy();
			}
		});
	},
		
	".todo .destroy click" : function(el){;
		el.closest('.view').data('todo').destroy();
	},
		
	".todo .toggle change" : function(el, ev) {
		var todo = el.closest('.view').data('todo');
		todo.attr('complete', el.is(':checked')).save();
	},
		
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
	// when an item is updated
	"{Todo} updated" : function(list, ev, item){
		this.updateStats();
	},
		
	// a helper that updates the stats
	updateStats : function(){
		// var list = this.options.list,
		// 	completed = list.completed().length;
		// $("#todo-stats").html("statsEJS",{
		// 	completed : completed,
		// 	total : list.length,
		// 	remaining : list.length - completed
		// })
	}

})

new Todos('#todoapp');

})();