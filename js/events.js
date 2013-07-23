/*
 * Code that renders the events page.
 * Opted for a client-side solution. Renders data pulled from /events.json
 * Enjoooy~
 */
(function() {
	
	var months = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];

	function pad(s, n) {
		s = s.toString();
		while ( s.length < n )
			s = '0' + s;
		return s;
	}

	function formatDateRange(from, to) {
		var s = "";
		if ( from.getFullYear() == to.getFullYear() ) {
			if ( from.getMonth() == to.getMonth() ) {
				if ( from.getDate() == to.getDate() ) {
					s = months[from.getMonth()] + 
						" " + (from.getDate() + 1) +
						", " + from.getFullYear();
				} else {
					s = months[from.getMonth()] + 
						" " + (from.getDate() + 1) +
						"-" + (to.getDate() + 1) +
						", " + from.getFullYear();
				}
			} else {
				s = months[from.getMonth()] + 
					" " + (from.getDate() + 1) +
					"-" + months[to.getMonth()] + 
					" " + (to.getDate() + 1) +
					", " + from.getFullYear();
			}
		} else {
			s = months[from.getMonth()] + 
				" " + (from.getDate() + 1) +
				", " + from.getFullYear() +
				"-" + months[to.getMonth()] + 
				" " + (to.getDate() + 1) +
				", " + to.getFullYear()
		}

		s += ", " +
			pad(from.getHours(), 2) + ":" + pad(from.getMinutes(), 2) +
			" to " +
			pad(to.getHours(), 2) + ":" + pad(to.getMinutes(), 2);
		return s;
	}

	$.getJSON('events.json').done(function(data) {
		var event_list = $('#event_list');

		var now = new Date();
		//first, convert the date fields
		for (var i = data.length - 1; i >= 0; i--) {
			var d = data[i];
			d.date_end = new Date(d.date_end+"+08:00");
			if ( d.date_end < now ) {
				data.splice(i, 1);
				continue;
			}
			d.date_start = new Date(d.date_start+"+08:00");
		};

		//then sort
		data.sort(function(a, b) {
			return a.date_start.getTime() - b.date_start.getTime();
		});

		for ( var i = 0; i < data.length; ++i ) {
			var d = data[i];
			var item = $('<li>');

			item.append(
				$('<img>').attr('src', d.logo),
				$('<h3>').text(d.title),
				$('<h4>').text(formatDateRange(d.date_start, d.date_end)),
				$('<h4>').text(d.location),
				$('<p>').text(d.about)
			);

			event_list.append(item);
		}
	});
})();