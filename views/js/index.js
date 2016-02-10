(function(window){
	
	$(document).ready(function(){
		console.log("research - ready")
		_get('/recent/3',null, createRecent);
		_get('/events/data',null, createEvents);

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
			var a = $("<a/>",{"href":"/projects"});
			a.append($("<h2/>",{"class":"post-title"}).append(data[i][['name']]));
			a.append($("<p/>",{"class":"post-subtitle"}).append(data[i]['topic']));
			div.append(a);
			div.append($("<p/>",{"class":"post-meta"}).append(data[i]['members']));
			$('#recent').append(div);
		}	

		console.log('meh')
	}

	function createEvents(data){
		var list = $("<ul/>",{"class":"list"});
		for (var title in data){
			var row =$("<div/>",{"class":"row"});
			var div = $("<div/>",{"class":"post-preview col-md-8"});
			var a = $("<a/>",{"href":"#"});
			if(data[title]["pdf"])
				a = $("<a/>",{"href":"/pdf/"+data[title]["pdf"]});
			a.append($("<h2/>",{"class":"post-title "}).append(title));
			a.append($("<p/>",{"class":"post-subtitle"}).append(data[title]['description']));
			div.append(a);
			div.append($("<p/>",{"class":"post-meta list-date"}).append(data[title]['time']));
			row.append(div);

			if(data[title]['img']){
				img = window.location.href + data[title]['img'];
				var img_cont = $("<div/>",{"class":"col-md-4 box"}).css('background','url('+img+') no-repeat center') ;
				row.append(img_cont);
			}

			$('#news').append(row);

		}

		console.log('meh')
	}
})(this);