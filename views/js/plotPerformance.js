(function() {

    $(document).ready(function() {
        console.log('Document ready');

        Number.prototype.setNumVals = function(num) {
            this.numVals = num;
        }

        Number.prototype.getNumVals = function() {
            return this.numVals;
        }

        Chart.types.HorizontalBar.extend({
            name: "HorizontalBarAlt",
            initialize:  function(data){
                var originalBuildScale = this.buildScale;
                var chart = this;
                chart.buildScale = function() {
                    var r = originalBuildScale.apply(this, arguments);
                    chart.scale.calculateBarHeight = function() {
                        return 50;
                    }
                    chart.scale.xScalePaddingLeft = 80;
                    chart.scale.xScalePaddingRight = 80;
                    //chart.scale.calculateBarX = function() {
                    //    console.log('Using new bar x');
                    //}
                    return r;
                }
                Chart.types.HorizontalBar.prototype.initialize .apply(this, arguments);
            }
        });

        Chart.defaults.global = {
            // Boolean - Whether to animate the chart
            animation: true,

            // Number - Number of animation steps
            animationSteps: 60,

            // String - Animation easing effect
            // Possible effects are:
            // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
            //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
            //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
            //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
            //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
            //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
            //  easeOutElastic, easeInCubic]
            animationEasing: "easeOutQuart",

            // Boolean - If we should show the scale at all
            showScale: true,

            // Boolean - If we want to override with a hard coded scale
            scaleOverride: false,

            // ** Required if scaleOverride is true **
            // Number - The number of steps in a hard coded scale
            scaleSteps: null,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            // Number - The scale starting value
            scaleStartValue: null,

            // String - Colour of the scale line
            scaleLineColor: "rgba(0,0,0,.1)",

            // Number - Pixel width of the scale line
            scaleLineWidth: 1,

            // Boolean - Whether to show labels on the scale
            scaleShowLabels: true,

            // Interpolated JS string - can access value
            scaleLabel: "<%=value%>",

            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleIntegersOnly: true,

            // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: false,

            // String - Scale label font declaration for the scale label
            scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Scale label font size in pixels
            scaleFontSize: 12,

            // String - Scale label font weight style
            scaleFontStyle: "normal",

            // String - Scale label font colour
            scaleFontColor: "#666",

            // Boolean - whether or not the chart should be responsive and resize when the browser does.
            responsive: false,

            // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio: true,

            // Boolean - Determines whether to draw tooltips on the canvas or not
            showTooltips: true,

            // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
            customTooltips: false,

            // Array - Array of string names to attach tooltip events
            tooltipEvents: ["mousemove", "touchstart", "touchmove"],

            // String - Tooltip background colour
            tooltipFillColor: "rgba(0,0,0,0.8)",

            // String - Tooltip label font declaration for the scale label
            tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Tooltip label font size in pixels
            tooltipFontSize: 14,

            // String - Tooltip font weight style
            tooltipFontStyle: "normal",

            // String - Tooltip label font colour
            tooltipFontColor: "#fff",


            // String - Tooltip title font declaration for the scale label
            tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // Number - Tooltip title font size in pixels
            tooltipTitleFontSize: 14,

            // String - Tooltip title font weight style
            tooltipTitleFontStyle: "bold",

            // String - Tooltip title font colour
            tooltipTitleFontColor: "#fff",

            // Number - pixel width of padding around tooltip text
            tooltipYPadding: 6,

            // Number - pixel width of padding around tooltip text
            tooltipXPadding: 6,

            // Number - Size of the caret on the tooltip
            tooltipCaretSize: 8,

            // Number - Pixel radius of the tooltip border
            tooltipCornerRadius: 6,

            // Number - Pixel offset from point x to tooltip edge
            tooltipXOffset: 10,

            // String - Template string for single tooltips
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> kbps/$ <% value.getNumVals.call(this) %> sample(s)",

            // String - Template string for multiple tooltips
            multiTooltipTemplate: "<%= value %>",

            scaleLineColor: 'transparent',

            scaleShowGridLines : false,



            // Function - Will fire on animation progression.
            onAnimationProgress: function(){},

            // Function - Will fire on animation completion.
            onAnimationComplete: function(){}
        };

        function average(xs) {
            var sum = xs.reduce(function(acc, a) {return acc + a;}, 0);
            var length = xs.length;
            return sum / length;
        }

        function place_message(message) {
            console.log('placing message');
            console.log($('#message'));
            var text = 'Status:'
            $('#message').text(text + ' ' + message);
        }

        function plot_data(results) {
            var data = results.data;
            var ctx = document.getElementById("myChart").getContext("2d");
            var info = [];
            var labels = [];
            var data1 = [];
            for(var prop in data) {
                if(data.hasOwnProperty(prop)) {
                    //labels.push(prop);
                    //data1.push(average(data[prop]));
                    info.push({
                        isp: prop,
                        value: average(data[prop])
                    });
                }
            }

            info = _.sortBy(info, function(obj) {
                return obj.value;
            });

            labels = _.map(info, 'isp');
            data1 = _.map(info, 'value');

            data1.forEach(function(value, index) {
                console.log('Setting length');
                value.setNumVals.call(this, data[labels[index]].length);
                console.log(value.getNumVals.call(this));
            });

            Chart.Scale.prototype.buildYLabels = function () {
                this.xLabelWidth = 0;
            };


            var fillColorMap = {
                MASSY: "rgba(113, 188, 120, 0.5)", //rgba(204, 204, 255, 0.5),
                FLOW: "rgba(151,187,205,0.5)",
                BLINK: "rgba(255, 159, 0, 0.5)",
                DIGICEL: "rgba(238, 32, 77, 0.5)",
                GREENDOT: "rgba(113, 188, 120, 0.5)"
            };

            var highlightFillcolorMap = {
                MASSY: "rgba(113, 188, 120, 0.75)", //rgba(204, 204, 255, 0.5),
                FLOW: "rgba(151,187,205,0.75)",
                BLINK: "rgba(255, 159, 0, 0.75)",
                DIGICEL: "rgba(238, 32, 77, 0.75)",
                GREENDOT: "rgba(113, 188, 120, 0.75)"
            };

            var strokeColorMap = {
                MASSY: "rgba(113, 188, 120, 0.8)", //rgba(204, 204, 255, 0.5),
                FLOW: "rgba(151,187,205,0.8)",
                BLINK: "rgba(255, 159, 0, 0.8)",
                DIGICEL: "rgba(238, 32, 77, 0.8)",
                GREENDOT: "rgba(113, 188, 120, 0.8)"
            };

            var hightlightStrokeColorMap = {
                MASSY: "rgba(113, 188, 120, 1)", //rgba(204, 204, 255, 0.5),
                FLOW: "rgba(151,187,205,1)",
                BLINK: "rgba(255, 159, 0, 1)",
                DIGICEL: "rgba(238, 32, 77, 1)",
                GREENDOT: "rgba(113, 188, 120, 1)"
            };

            var fillColor = [];
            var strokeColor = [];
            var highlightFill = [];
            var highlightStroke = [];
            for(var idx = 0; idx < info.length; idx += 1) {
                console.log(info[idx].isp);
                fillColor.push(fillColorMap[info[idx].isp]);
                strokeColor.push(strokeColorMap[info[idx].isp]);
                highlightFill.push(highlightFillcolorMap[info[idx].isp]);
                highlightStroke.push(hightlightStrokeColorMap[info[idx].isp]);
            }



            var datasets = [];
            datasets.push({
                label: "ISP Performance",
                fillColor: fillColor,
                strokeColor: strokeColor,
                highlightFill: highlightFill,
                highlightStroke: highlightStroke,
                data: data1
            });

            var data2 = {
                labels: labels,
                datasets: datasets
            };
            console.log(labels);
            console.log(data2);
            console.log("skdksdj");
            var options = {


                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero : true,

                scaleShowGridLines : false,

                //Boolean - Whether grid lines are shown across the chart
                //scaleShowGridLines : true,

                //String - Colour of the grid lines
                scaleGridLineColor : "rgba(0,0,0,.05)",

                //Number - Width of the grid lines
                scaleGridLineWidth : 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: false,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: false,

                //Boolean - If there is a stroke on each bar
                barShowStroke : true,

                //Number - Pixel width of the bar stroke
                barStrokeWidth : 2,


                //Number - Spacing between each of the X value sets
                barValueSpacing : 5,

                //Number - Spacing between data sets within X values
                barDatasetSpacing : 1,

                //String - A legend template
                legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

                // Boolean - Whether to animate the chart
                animation: true,

                // Number - Number of animation steps
                animationSteps: 60,

                showXAxisLabel:false,

                showTooltips : false,

                multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",

                onAnimationComplete: function() {
                    console.log('Animation complete');
                    var ctx = document.getElementById("myChart").getContext("2d");
                    //ctx.canvas.width = 850;
                    if (true) {
                        if (true) {
                            this.eachBars(function(bar){
                                //console.log('bar value');
                                //console.log(bar.value);
                                console.log('bar label');
                                //console.log(bar.label);
                                console.log(data);

                                var samples = "1 sample";
                                if (data[bar.label].length > 1) {
                                    samples = data[bar.label].length + " samples";
                                }


                                console.log(bar);
                                var tooltipPosition = bar.tooltipPosition();

                                var labelLen =  (Math.round(bar.value, 2) + ' kbps/$' + ' (' + samples + ')').length ;
                                var tx = bar.x / 2 + labelLen  + 10;
                                if(bar.x < 300 && true) {
                                    tx = bar.x + 60 + (labelLen / 2);
                                }

                                console.log('tx ', tx, ' of x ', bar.x);
                                new Chart.Tooltip({
                                    //x: Math.round(tooltipPosition.y),
                                    //y: Math.round(tooltipPosition.x),
                                    x: tx,
                                    y: bar.y + (bar.left / 4) + 5,
                                    xPadding: this.options.tooltipXPadding,
                                    yPadding: this.options.tooltipYPadding,
                                    fillColor: "rgba(255,255,255,0)", //fill bg the color with white
                                    textColor: "rgba(0,0,0,1)", //set text color to black
                                    fontFamily: this.options.tooltipFontFamily,
                                    fontStyle: this.options.tooltipFontStyle,
                                    fontSize: 13, //set font size
                                    caretHeight: this.options.tooltipCaretSize,
                                    cornerRadius: this.options.tooltipCornerRadius,
                                    text: Math.round(bar.value, 2) + ' kbps/$' + ' (' + samples + ')',
                                    chart: this.chart
                                }).draw();
                            });
                        }
                    }
                }

                //barValueSpacing : 2,

                //barStrokeWidth: 1


            };


            //var chart = new Chart(ctx).HorizontalBar(data, options);
            var chart = new Chart(ctx).HorizontalBarAlt(data2, options);
            console.log('Chart finished...');

            for(var idx = 0; idx < info.length; idx += 1) {
                console.log(info[idx].isp);
                chart.datasets[0].bars[idx].fillColor = fillColor[idx];
                chart.datasets[0].bars[idx]._saved.fillColor = fillColor[idx];
                chart.datasets[0].bars[idx].strokeColor = strokeColor[idx];
                chart.datasets[0].bars[idx]._saved.strokeColor = strokeColor[idx];
                chart.datasets[0].bars[idx].highlightFill = highlightFill[idx];
                chart.datasets[0].bars[idx]._saved.highlightFill = highlightFill[idx];
                chart.datasets[0].bars[idx].highlightStroke = highlightStroke[idx];
                chart.datasets[0].bars[idx]._saved.highlightStroke = highlightStroke[idx];
            }

            place_message(results.message);



        }

        function resize_canvas(data) {
            var labelCount = 0;
            for(var prop in data) {
                if(data.hasOwnProperty(prop)) {
                    labelCount += 1;
                }
            }
            var canvasElement = document.getElementById('myChart');
            console.log(canvasElement.height);
            canvasElement.height = 70 * labelCount;
        }





        $('#dashboard').hide();
        $('#singlebutton').click(function(event) {
            console.log('Clicked....');
            event.preventDefault();
            var email = $('#textinput').val();
            var url = '/isp-performance/' + email;
            $.get(url, function(results) {
                console.log('Made calls to ', url);
                console.log('For results');
                console.log(results);
                resize_canvas(results.data);
                plot_data(results);
                console.log('hiding emel');
                $('#emailform').hide();
                $('#dashboard').show();
            });

        })

    });

})();