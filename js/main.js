var patronageGraph = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "title": { text: "TravelTrain Patronage", fontSize: 26, titleFont: "Montserrat" },
    "description": "Quarterly TravelTrain patronage.",
    "width": "container",
    "height": "container",
    "data": { "url": "js/qrttp.json" },
    "layer": [
        {
            "mark": {
                "type": "line",
                "point": {
                    "filled": false,
                    "fill": "white"
                },
                "interpolate": "natural"
            },
            "encoding": {
                "x": { "field": "Date", "type": "temporal", axis: { tickCount: 10, titleFontSize: 20, labelFontSize: 15 } },
                "y": { "field": "Patrons", "type": "quantitative", axis: { titleFontSize: 20, labelFontSize: 15 } },
                "color": { "value": "#C3262F" },
                "tooltip": [
                    { "title": "Patrons", "field": "Patrons", "type": "quantitative" }
                ]
            }
        }, {
            "transform": [
                {
                    "regression": "Date",
                    "on": "Patrons"
                }
            ],
            "mark": {
                "type": "line",
                "strokeDash": [10, 6],
                "interpolate": "natural",
                "opacity": 0.5
            },
            "encoding": {
                "x": { "field": "Date", "type": "temporal", axis: { tickCount: 10, titleFontSize: 20, labelFontSize: 15 } },
                "y": { "field": "Patrons", "type": "quantitative", axis: { titleFontSize: 20, labelFontSize: 15 } },
                "color": { "value": "#505050" }
            }
        }]
}
vegaEmbed('#patronageGraph', patronageGraph);