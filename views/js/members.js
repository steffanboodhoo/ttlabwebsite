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
			var li = $("<li/>",{"class":"post-preview"});
			var main_row = $("<div/>",{"class":"row"})

			var left = $("<div/>",{"class":"col-md-4"}), right = $("<div/>",{"class":"col-md-8"})
			var right_sub_left = $("<div/>",{"class":"col-md-6 mid"})
			var right_sub_right = $("<div/>",{"class":"col-md-6 mid"})
			
			//LEFT
			var img = window.location.href.replace(window.location.pathname,"") + "/default-profile.png";
			// img = "http://localhost:3000/default-profile.png";
			if(data[name]['img'])
				img = window.location.href.replace(window.location.pathname,"") + "/" + data[name]['img'];
			left.append( $("<div/>",{"class":"circular"}).css('background','url('+img+') ') )
			
			//RIGHT
			//right_sub_left
			var links = data[name]['links'];
			right_sub_left.append($("<h4/>",{"class":"list-name"}).append(name));
			right_sub_left.append($("<p/>",{"class":"list-title"}).append(data[name]['title']));
			for( var l=0; l<links.length; l++){
				right_sub_left.append($("<a/>",{"class":"list-link links"}).append(links[l]));
				right_sub_left.append($("<br/>"))
			}
			//right_sub_left
			var education = data[name]['education'];
			for(var edu=0; edu<education.length; edu++)
				right_sub_right.append($("<p/>",{"class":"education list-edu"}).append(education[edu]));

			right.append( $("<div/>",{"class":"row"}).append(right_sub_left).append(right_sub_right) )
			right.append( $("<div/>",{"class":"row"}).append( $("<blockquote/>",{"class":"post-subtitle"}).append(data[name]['about']) ) )
			
			main_row.append(left).append(right);
			li.append( $("<hr>") )
			li.append(main_row)
			list.append(li);
		}	
		list.appendTo('#list_cont');

		var options = {valueNames:['list-name']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);