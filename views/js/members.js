(function(window){
	
	$(document).ready(function(){

		_get('/members/data',null,createList);

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
		"Steffan Boodhoo":{
		"title":"Researcher",
		"about":" I have yet to find my specific area of interest, until then perseverence",
		"education":["Bsc University Of The West Indies 2015"],
		"links":["boodhoo100@gmail.com"]
	},
	*/
	function createList(data){
		var list = $("<ul/>",{"class":"list"});
		for (var name in data){
			var li = $("<li/>");
			var left = $("<div/>",{"class":"col-md-6"})// Left column of item
			var right = $("<div/>",{"class":"col-md-6"})// right column of item
			
			//LEFT
			var links = data[name]['links'];
			left.append($("<h4/>",{"class":"list-name"}).append(name));
			left.append($("<p/>",{"class":"list-title"}).append(data[name]['title']));
			for( var l=0; l<links.length; l++)
				left.append($("<a/>",{"class":"list-link"}).append(links[l]));
			
			//RIGHT
			var education = data[name]['education'];
			for(var edu=0; edu<education.length; edu++)
				right.append($("<p/>",{"class":"list-edu"}).append(education[edu]));

			li.append( $("<div/>",{"class":"row"}).append(left).append(right) )
			li.append( $("<p/>",{"class":"list-about"}).append(data[name]['about']) );
			list.append(li);
		}	
		list.appendTo('#list_cont');

		var options = {valueNames:['list-name']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);