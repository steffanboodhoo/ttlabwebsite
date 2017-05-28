(function(window){

	$(document).ready(function(){
		console.log("ready");
		_get("/clients/data", null, createList);
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

	function createList(items){
		console.log(items);
		var list = $("<ul>");
		for( i in items ){
			// console.log(items[i]);
			var item = createItem(items[i]);
			var list_item = $("<li/>",{class:"shadow-border"}).append(item);
			list.append(list_item);
		}
		$("#list_client").append(list);

	}

	function createItem(data){
		var item = $("<div/>",{class:"row"});

		var left = $("<div/>",{class:"col-md-8"});
		var img = window.location.href.replace(window.location.pathname,"") + "/" + data["image"];
		left.append( $("<img/>",{"src":img, "class":"logo img-contain"}));


		var right = $("<div/>",{class:"col-md-4"}).append( $("<h3/>").append(data["client"]) );
		right.append( $("<blockquote/>").append(data["meta"]) )

		item.append(left); item.append(right);
		return item;
	}

})(this);