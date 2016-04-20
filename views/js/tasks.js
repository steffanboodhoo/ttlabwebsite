(function(window){
	
	var page_data = {};

	$(document).ready(function(){
		// console.log("tasks - ready m8")
		_get('/tasks/data',null,createList);
		console.log("tasks - ready m8")
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

	function createList(data){
		var idCount = 0;
		var list = $("<ul/>",{"class":"list"});
		console.log('data');
		for (var name in data){
			//storing it for later bb
			page_data["data"+idCount] = data[name];
			page_data["data"+idCount]['name'] = name;

			var li = $("<li/>",{"class":"post-preview "});
			var a = $('<a/>',{"role":"button", "data-toggle":"collapse", "href":"#collapse"+idCount, "aria-expanded":"false", "aria-controls":"#collapse"+idCount, "id":"data"+idCount});

			a.append($("<h3/>",{"class":"post-title list-title"}).append(name));	
			var row = $('<div/>',{"class":"row"});	
			var d1 = $('<div/>',{"class":"col-lg-3"}).append($('<p/>',{"class":"post-subtitle "}).append(" <span class='bold'> Difficulty </span> : "+data[name]['skill']));
			var d2 = $('<div/>',{"class":"col-lg-3"}).append($('<p/>',{"class":"post-subtitle "}).append("<span class='bold'> Status </span> : "+data[name]['status']));
			var d3 = $('<div/>',{"class":"col-lg-3"}).append($('<p/>',{"class":"post-subtitle "}).append("<span class='bold'> Duration </span> : "+data[name]['duration']));
			row.append(d1);row.append(d2);row.append(d3);
			a.append(row);
			li.append(a);
			var collapsable = $('<div/>',{"class":"collapase collapse", "aria-expanded":"false", "id":"collapse"+idCount});
			collapsable.append($('<div/>',{"class":"well"}).append(data[name]['description']));
			li.append(collapsable); 
			//li.append();
			li.append( $("<p/>",{"class":"post-meta "}).append('posted '+data[name]['posted']) );
			//a.append($('<p/>',{"class":"post-subtitle "}).append(data[title]['topic']));
			//adding in everything
			

			//task-name
			//task-skill-level
			//task-date-posted
			//task-
			//members
			
			/*
			var members = data[title]['members'];
			
			*/
			
			list.append(li);
			idCount++;
		
			/*a.click(function(event){
				var id = event.target.id;
				if(id == "")
					id = $(event.target).parent().attr('id');
				console.log(page_data[id]);
				sessionStorage.setItem('projectSingle', JSON.stringify(page_data[id]));
			})*/

		}	

		list.appendTo('#list_cont');
		// console.log(page_data);
		var options = {valueNames:['list-title','post-subtitle','post-meta']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);