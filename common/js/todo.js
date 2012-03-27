(function() {

can.Model('Todo', {
	localStore: function(cb){
		var name = 'cantodo',
			data = JSON.parse( window.localStorage[name] || (window.localStorage[name] = '{}') ),
			res = cb.call(this, data);
		if(res !== false){
			for (var id in data) {
				delete data[id].editing;
			}
			window.localStorage[name] = JSON.stringify(data);
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

can.Model.List('Todo.List',{
	
	sort: function() {
		return [].sort.call(this, function(a,b) {
			return (a.text > b.text && 1) || (a.text < b.text && -1) || 0;
		});
	}
	
});

})();