(function(window){
	
	$(document).ready(function(){
		console.log("research - ready")
		_get('/research/data',null,createList);

	});

	
	function _get(url,params,call_back){
		$.ajax({
			url:url,
            type:'GET',
            data:params,
            success:function(response){
            	console.log(response)
                if(typeof call_back==='function')
                    call_back(response)
            }
		})
	}

	/*
	"A Consumer Focused Open Data Platform":{
		"author":["C. Millette", "P. Hosein"],
		"venue":"International Conference on Big Data and Smart City",
		"city":"Muscat",
		"country":"Oman",
		"volume":"",
		"month":"Mar",
		"year":"2016",
		"pdf":"icbdsc2016.pdf"
	},
	*/
	function createList(data){
		data = data['papers'];
		var list = $("<ul/>",{"class":"list"});
		var pdfs = {}, count = 0;
		for (var title in data){
			//save pdf for later
			pdfs["pdf"+count] = data[title]['pdf'];

			//create containers
			var li = $("<li/>",{"class":"post-preview "});
			var a = $('<div></div>', {"id":"pdf"+count});
			var a = $('<a/>',{"id":"pdf"+count});
			if(data[title]['pdf'].length > 0) {
				//onclick event

				a.click(function(event){
					var id = event.target.id;
					if(id == "")
						id = $(event.target).parent().attr('id');
					var pdf = "#";
					if( pdfs[id] != "")
						pdf = pdfs[id];
					window.location = "/pdf/"+ pdf;
				});
			} else {
				a.click(function(event) {
					event.preventDefault();
				});
				a.attr('data-toggle', 'modal');
				a.attr('data-target', '#myModal');
			}

			a.append( $("<h4/>",{"class":"post-title list-title"}).append(title) );
			a.append( $("<p/>",{"class":"post-subtitle list-description "}).append(data[title]['authors']) )
			a.append($("<p/>",{"class":"post-subtitle list-description"}).append(data[title]['location']));
			li.append(a);
			var meta = data[title]['date'];
			if(data[title]["volume"] != "")
				meta += ", vol"+data[title]["volume"];
			li.append($("<p/>",{"class":"post-meta list-date"}).append(meta));
			
			list.append(li);


			count++;
		}	

		list.appendTo('#list_cont');

		var options = {valueNames:['list-title']};
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);