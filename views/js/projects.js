(function(window){
	
	var page_data = {};

	$(document).ready(function(){
		console.log("research - ready")

		_get('/projects/data',null,createList);

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
		title{
			description:...,
			time:...
		}
	*/
	function createList(data){
		var idCount = 0;
		var list = $("<ul/>",{"class":"list"});
		for (var title in data){
			//storing it for later bb
			page_data["data"+idCount] = data[title];
			page_data["data"+idCount]['title'] = title;

			var li = $("<li/>",{"class":"post-preview knockout-around"});
			var a = $('<a/>',{"href":"/projectSingle","id":"data"+idCount});
			a.append($("<h3/>",{"class":"post-title list-title"}).append(title));
			
			//members
			var members = data[title]['members'];
			for (var i = 0; i<members.length; i++){
				a.append($('<p/>',{"class":"post-meta list-members"}).append(members[i]));
			}
			
			//adding in everything
			li.append(a);
			li.append( $("<p/>",{"class":"post-meta list-date"}).append(data[title]['time']) );
			list.append(li);
			idCount++;
		
			a.click(function(event){
				var id = event.target.id;
				if(id == "")
					id = $(event.target).parent().attr('id');
				console.log(page_data[id]);
				sessionStorage.setItem('projectSingle', JSON.stringify(page_data[id]));
			})

		}	

		list.appendTo('#list_cont');
		// console.log(page_data);
		var options = {valueNames:['list-title','list-members']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);