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
		months = ['Jan','Feb','Mar','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
		var arr = [];
		for(pub in data){
			
			var pub_mon_yr = data[pub]['date'].split(',')
			console.log(pub_mon_yr)
			var pub_mon = pub_mon_yr[0].trim()
			var pub_yr = pub_mon_yr[1].trim()
			for(var mon in months){
				if( pub_mon === months[mon]){
					pub_mon = mon;
					break;
				}
			}
			if(pub_mon.length == 1){
				pub_mon = "0"+pub_mon;
			}
			var pub_day = 'day' in data[pub]? data[pub]['day']:'00';
			pub_mon_yr = parseInt(pub_yr+pub_mon+pub_day);
			data[pub]['time'] = pub_mon_yr;
			console.log(pub_mon_yr)
			data[pub]['title'] = pub;
			arr.push(data[pub]);
		}

		arr.sort(function(a,b){
			return b['time'] - a['time'] ;
		});
		data = arr;
	
		var list = $("<ul/>",{"class":"list"});
		var pdfs = {}, count = 0;
		for (var i in data){
			//save pdf for later
			pdfs["pdf"+count] = data[i]['pdf'];

			//create containers
			var li = $("<li/>",{"class":"post-preview "});
			// var a = $('<div></div>', {"id":"pdf"+count});
			var a = $('<a/>',{"id":"pdf"+count});
			if(data[i]['pdf'].length > 0) {
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
			} else if(data[i]['link'] != undefined){
				a.attr({'href':data[i]['link']});
			}else{
				a.click(function(event) {
					event.preventDefault();
				});
				a.attr('data-toggle', 'modal');
				a.attr('data-target', '#myModal');
			}

			a.append( $("<h4/>",{"class":"post-title list-title"}).append(data[i]['title']) );
			a.append( $("<p/>",{"class":"post-subtitle list-description "}).append(data[i]['authors']) )
			a.append($("<p/>",{"class":"post-subtitle list-description"}).append(data[i]['location']));
			li.append(a);
			var meta = data[i]['date'];
			if(data[i]["volume"] != "")
				meta += ", vol"+data[i]["volume"];
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