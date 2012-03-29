steal('test.js').then(function() {
	
	helpers.selectDay = function(diff) {
		var today = new Date();
		S('#calendar .yui3-calendar-day:not(.yui3-calendar-column-hidden)').then(function(el) {
			for (var i = 0; i < el.length; i++) {
				if (el[i].innerHTML == today.getDate()) {
					S(el[i+diff]).click();
					break;
				}
			}
		});
	};
	
	test('Manage due date', function() {
		var today = new Date();
		helpers.add(1, 'new todo');
		
		// Set due date to today
		S('#todo-list .todo:nth-child(1) .due-date').click();
		S('#calendar').visible('calendar is shown');
		helpers.selectDay(0);
		S('#todo-list .todo:nth-child(1) .date').text('Today', 'due date is today');
		
		// Set due date to yesterday
		S('#todo-list .todo:nth-child(1) .due-date').click();
		helpers.selectDay(-1);
		S('#todo-list .todo:nth-child(1) .date').text('Yesterday', 'due date is yesterday');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', true, 'due date is late');
		
		// Set due date to tomorrow
		S('#todo-list .todo:nth-child(1) .due-date').click();
		helpers.selectDay(1);
		S('#todo-list .todo:nth-child(1) .date').text('Tomorrow', 'due date is tomorrow');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', false, 'due date is on time');
		
		// Set due date to the future
		S('#todo-list .todo:nth-child(1) .due-date').click();
		helpers.selectDay(2);
		today.setDate(today.getDate()+2);
		S('#todo-list .todo:nth-child(1) .date').text((today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear(), 'due date is in the future');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', false, 'future due date is on time');
		
		// Set due date to the past
		S('#todo-list .todo:nth-child(1) .due-date').click();
		helpers.selectDay(-2);
		today.setDate(today.getDate()-4);
		S('#todo-list .todo:nth-child(1) .date').text((today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear(), 'due date is in the past');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', true, 'past due date is late');
		
		// Clear due date
		S('#todo-list .todo:nth-child(1) .clear-date').click();
		S('#todo-list .todo:nth-child(1) .date').text('', 'due date is cleared');
	});
	
});