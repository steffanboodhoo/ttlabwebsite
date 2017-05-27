/**
 * Created by inzamamrahaman on 31/08/2016.
 */
(function() {

    $(document).ready(main);

    function main() {
        var url = '/presentations/data';
        $.get(url, function(data) {
           insertPresentations(data);
        });
    }

    function insertPresentations(data) {
        var count = 0;
        var listOptions = {valueNames:['list-name']};
        var list = $('<ul></ul>', {
            "class": "list"
        });
        _.forEach(data, function(datum, key) {
            var entry = createEntry(datum, key, count);
            list.append(entry);
            count += 1;
        });

        $('#list_cont').append(list);
        var presentationList = new List('list_cont',options);

        console.log('Presentations Inserted');
    }

    function createEntry(datum, key, count) {
        var entry = $('<li></li>', {"class":"post-preview"});


        /*

            The entries for this list of presentation is are contained in JSON
            objects that are nested in a larger JSON object.

            The key used at the level of the outermost object gives the title of the presentation
            and the value is the JSON object describing the various other properties of the presentation.

            | property description | key       |
            |----------------------|-----------|
            | name of presenter    | presenter |
            | date of presentation | date      |
            | name of event        | event     |


         */

        // get the content out of the object
        var title = key;
        var presenter = datum['presenter'];
        var date = datum['date'];
        var event = datum['event'];

        // get the url to insert out of object
        var url = 'pdf' + datum['pdf'];


        // begin construction of event

        var id = 'pdf' + count;

        var linkToPDF = $('<a></a>', {
            "id": id,
            "href": url
        });

        linkToPDF.append( $("<h4/>",{"class":"post-title list-title"}).append(title) );
        linkToPDF.append( $("<p/>",{"class":"post-subtitle list-description "}).append(presenter));
        linkToPDF.append($("<p/>",{"class":"post-subtitle list-description"}).append(event));
        linkToPDF.append($("<p/>",{"class":"post-subtitle list-description"}).append(date));

        entry.append(linkToPDF);

        return entry;

    }

})();