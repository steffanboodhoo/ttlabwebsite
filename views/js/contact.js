(function(document){

	$(document).ready(function(){
		console.log('im ready');
		init();		
	});

	function init(){
		
		$('#btn_send').unbind();
		$("#request_form").submit(function(e) {
		    e.preventDefault();
		    console.log('submittin');
		});
		$('#btn_send').click(function(){
			grabData();
		})
		
	}
	function grabData(){
		var sendObj = {};
		sendObj['name'] = $("input#req_name").val();
        sendObj['email'] = $("input#req_email").val();
        sendObj['phone'] = $("input#req_phone").val();
        sendObj['type'] = $("input#req_type").val();
        sendObj['desc'] = $("textarea#req_desc").val();			
		
		if( sendObj['name']!="" && sendObj['email']!="" && sendObj['phone']!="" && sendObj['type']!="" && sendObj['desc']!="" ){
			console.log(sendObj);
			_post('/request',sendObj,null);
		}
	
	}

	function displayMessage(success){
		console.log("grabbing");
		if(success){
			$('#success').html("<div class='alert alert-success'>");
            $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append("</button>");
            $('#success > .alert-success').append("<strong>Your message has been sent. </strong>");
            $('#success > .alert-success').append('</div>');
             // $('#contactForm').trigger("reset");
			// displayMessage(true);
		}else{
			$('#success').html("<div class='alert alert-danger'>");
			$('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'").append("</button>");
            $('#success > .alert-danger').append("<strong>Sorry buddy, it seems that my mail server is not responding. Please try again later!");
            $('#success > .alert-danger').append('</div>');
		}
	}

	function _post(url,params,call_back){
		$.ajax({
			url:url,
            type:'POST',
            data:params,
            success:function(response){
            	console.log(response)
                if(typeof call_back==='function')
                    call_back(response)
            }
		})
	}
	
	
})(this);