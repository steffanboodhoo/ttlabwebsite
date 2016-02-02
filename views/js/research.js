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
		title{
			description:...,
			time:...
		}
	*/
	function createList(data){
		var list = $("<ul/>",{"class":"list"});
		for (var title in data){
			var li = $("<li/>",{"class":"post-preview knockout-around"});
			li.append($("<h3/>",{"class":"post-title list-title"}).append(title));
			li.append($("<p/>",{"class":"post-subtitle list-description"}).append(data[title]['description']));
			li.append($("<p/>",{"class":"post-meta list-date"}).append(data[title]['time']));
			list.append(li);
		}	

		list.appendTo('#list_cont');

		var options = {valueNames:['list-title']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);