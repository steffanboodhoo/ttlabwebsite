/**
 * Created by inzamamrahaman on 10/01/2017.
 */
(function(window){

    $(document).ready(main);

    function main() {
        var patentDataURI = '/research/data';
        $.get(patentDataURI, createListing)
    }

    function createListDescription(content) {
        var temp = $('<p></p>', {"class":"post-subtitle list-description"});
        temp.append(content);
        return temp;
    }

    function createListing(data) {
        var patents = data['patents'];
        var list = $('<ul></ul>', {"class": "list"});
        _.forEach(patents, function(patentData, patent) {
            console.log(patent);
            console.log(patentData);
            var authors = patentData['authors'];
            var registration = patentData['registration'];
            var location = patentData['country'];
            var date = patentData['date'];

            var patentUnit = $('<li></li>', {"class": "post-preview"});
            var patentContent = $('<a></a>');
            if(patentData['pdf']) {
                patentContent.click(function(event) {
                    window.location = '/pdf/' + patentData['pdf'];
                });
            } else {
                patentContent.click(function(event) {
                    event.preventDefault();
                });
            }
            patentContent.append( $("<h4/>",{"class":"post-title list-title"}).append(patent) );
            patentContent.append(createListDescription(authors));
            patentContent.append(createListDescription(location));
            patentContent.append(createListDescription(registration));
            patentUnit.append(patentContent);
            patentUnit.append($("<p></p>",{"class":"post-meta list-date"}).append(date));


            list.append(patentUnit);

        });

        $('#list_cont').append(list);
        var patentListingOptions = {valueNames:['list-title']};
        var patentListing = new List('list_cont',patentListingOptions);
    }

})(this);