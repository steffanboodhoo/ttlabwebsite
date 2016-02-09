(function(window){
	
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
		var list = $("<ul/>",{"class":"list"});
		for (var title in data){
			var li = $("<li/>",{"class":"post-preview knockout-around"});
			var a = $('<a/>',{"href":"#"})
			a.append($("<h3/>",{"class":"post-title list-title"}).append(title));
			// a.append($("<p/>",{"class":"post-subtitle list-description"}).append(data[title]['description']));

			var members = data[title]['members'];
			for (var i = 0; i<members.length; i++){
				a.append($('<p/>',{"class":"post-meta list-members"}).append(members[i]));
			}
			li.append(a);
			li.append( $("<p/>",{"class":"post-meta list-date"}).append(data[title]['time']) );
			list.append(li);
		}	

		list.appendTo('#list_cont');

		var options = {valueNames:['list-title','list-members']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);