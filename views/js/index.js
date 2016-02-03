(function(window){
	
	$(document).ready(function(){
		console.log("research - ready")
		_get('/recent/3',null, createRecent);

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
	function createRecent(data){
		
		for (var i=0; i<data.length; i++){
			
			var div = $("<div/>",{"class":"post-preview"});
			var a = $("<a/>",{"href":"/publications"});
			a.append($("<h2/>",{"class":"post-title"}).append(data[i][['name']]));
			a.append($("<h3/>",{"class":"post-subtitle"}).append(data[i]['type']));
			div.append(a);
			div.append($("<p/>",{"class":"post-meta"}).append(data[i]['time']));
			$('#recent').append(div);
		}	

		

		console.log('meh')
	}
})(this);