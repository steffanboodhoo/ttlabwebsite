(function(window){
	
	$(document).ready(function(){
		console.log("single - ready")
		var projectData = JSON.parse(sessionStorage.getItem('projectSingle'));		
		fillData(projectData);

	});

	function fillData(projectData){
		$("#title").append( projectData['title'] );
		$("#description").append( projectData['description'] );
		var members = projectData['members'];
		for( i = 0; i<members.length; i++){
			$("#meta").append( $("<p/>").append(members[i]) );
		}
		$("#meta").append( $("<p/>").append(projectData["time"]) );
	}

})(this);