(function(window){
	
	var page_data = {};

	$(document).ready(function(){
		main()
		//console.log("research - ready")
        //
		//_get('/projects/data',null,createList);

	});


	function main() {
		var url = '/projects/data';
		$.get(url, processProjects);
	}

	function processProjects(data) {
		var list = $('<ul></ul>', {"class": "list"});
		_.forEach(data, function(values, key) {
			var element = assembleElement(key, values);
			list.append(element);
		});

		list.appendTo('#list_cont');
		var options = {valueNames:['list-title','post-subtitle','post-meta']};
		var researchList = new List('list_cont',options);
	}

	function assembleElement(key, values) {
		var liContainer = $('<li></li>', {
			"class": "post-preview"
		});

		var title = key;
		var abstract = 'Abstract: ' + values['abstract'];
		var members = 'Members: '+  values['members'];

		console.log(title);
		console.log(abstract);
		console.log(members);

		var titleElement = $('<h3></h3>', {"class":"post-title list-title"});
		var abstractElement = $('<p style="font-style: italic"></p>', {"class":"post-subtitle "});
		var membersElement = $('<p></p>', {"class":"post-subtitle "});

		titleElement.append(title);
		abstractElement.append(abstract);
		membersElement.append(members);

		liContainer.append(titleElement);
		liContainer.append(membersElement);
		liContainer.append(abstractElement);

		return liContainer;
	}
	
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
			a.append($('<p/>',{"class":"post-subtitle "}).append(data[title]['topic']));
			//adding in everything
			li.append(a);

			//members
			var members = data[title]['members'];
			li.append( $("<p/>",{"class":"post-meta "}).append(data[title]['members']) );
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
		var options = {valueNames:['list-title','post-subtitle','post-meta']}
		var researchList = new List('list_cont',options);

		console.log('meh')
	}
})(this);