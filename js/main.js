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

const cssOpacity = {opacity: '1', transition: 'opacity 0.2s ease, fill 0.2s ease'}
const cssFaded = {opacity: '0.1'}

$(document).ready(function(){
    qrMapInit()
})

function qrMapInit() {
    var m = document.getElementById("qrMap");

    m.addEventListener("load",function(){
        var svgDoc = m.contentDocument.documentElement;

        line = $(".jsLine",svgDoc);
        linePath = $(line).children(".lineStroke")
        station = $(".jsStn",svgDoc);
        stationCommon = $(".commonStn",svgDoc);
        stationLabel = $(".jsStnLbl",svgDoc);
        lineLabel = $(".jsLineLbl",svgDoc);
        _spacers = $("#_x5F_SPACER",svgDoc);

        $(line).css(cssOpacity)
        $(linePath).css(cssOpacity)
        $(station).css(cssOpacity)
        $(stationCommon).css(cssOpacity)
        $(stationLabel).css(cssOpacity)
        $(lineLabel).css(cssOpacity)
        $(_spacers).css(cssOpacity)

        qrMapPrep()
    },false);
}

function qrMapPrep() {
    // Mouseover
    // Lines
    linePath.mouseover(function () {
        highlight(sharedLines($(this).attr('id').replace(/Path/g, 'Line')),null)
    })
    linePath.mouseout(function () {
        highlightClear()
    })

    // Line labels
    lineLabel.mouseover(function () {
        highlight(sharedLines($(this).attr('id').replace('Label','')),null)
    })
    lineLabel.mouseout(function () {
        highlightClear()
    })

    // Stations
    station.mouseover(function () {
        s = $(this).attr('id').replace(/S-/g, '') // Handle Springfield Central station IDs
        highlight(null,s)
    })
    station.mouseout(function () {
        highlightClear()
    })

    // Station labels
    stationLabel.mouseover(function () {
        s = $(this).attr('id').replace(/Label/g, 'Stn')
        s = s.replace(/S-/g, '') // Handle Springfield Central station IDs
        highlight(null,s)

        $(this).css({fill: "#C3262F"})
    })
    stationLabel.mouseout(function () {
        highlightClear()
        $(this).css({fill: "#000000"})
    })
}

function highlight(l, s) {
    // l = line, s = station,
    if (l && !s) {
       highlightLine(l)
    } else if (s && !l) {
        var test = getLines(s)
        highlightLine(test)
    }

}

function highlightLine(l) {
    let b = ''
    let c = ''
    let d = false
    let stationList = []
    let newStations = []
    let g = ''
    let h = ''
    let j = ''
    let k = ''
    l.forEach(el => {
        a = "#" + el + ","
        b += a

        f = "#" + el + "Label,"
        c += f
        
        newStations = getStations(el)
        if (newStations) {
            newStations.forEach(el => {
                stationList.push(el)
            });
        }

        if (el == "Sunshine_CoastLine") {
            c+= "#Nambour-Caboolture_RailbusLineLabel,"
        }
    });
    b = b.slice(0, -1)
    c = c.slice(0, -1)

    stationList = Array.from(new Set(stationList))

    stationList.forEach(el => {
        g = "#" + el + "Stn,"
        h += g.replace(/ /g,'_')

        j = "#" + el + "Label,"
        k += j.replace(/ /g,'_')
    })  
    h = h.slice(0, -1)          
    k = k.slice(0, -1)          

    line.not(b).css(cssFaded)
    lineLabel.not(c).css(cssFaded)
    stationCommon.not(h).css(cssFaded)
    stationLabel.not(k).css(cssFaded)

    if (b.includes("Rosewood")) {
        $('#IpswichStnRswd',document.getElementById("qrMap").contentDocument.documentElement).css({opacity: '1'})
    } else {
        $('#IpswichStnRswd',document.getElementById("qrMap").contentDocument.documentElement).css({opacity: '0'}) 
    }

    d = spacerHandler(b)
    if (d) {
        $(_spacers).css('opacity', '0')
    }
}

function highlightClear() {
    $(line).css({opacity: '1'})
    $(station).css({opacity: '1'})
    $(stationLabel).css({opacity: '1'})
    $(lineLabel).css({opacity: '1'})
    $(_spacers).css({opacity: '1'})
}

// Check which stations a line contains
function getStations(l) {
    l = l.replace('_', ' ').replace('Line','')
    try {
        return lineData[l].stations
    } catch (error) {} 
}

// Check which lines a station is on
function getLines(s) {
    s = s.replace(/Stn/g, '')
    s = s.replace(/_/g, ' ')
    stationArray = [];
    $.each(lineData, function(i, v) {
        if(v.stations.includes(s)) {
            stationArray.push(i.replace(/ /g, '_') + "Line")
        }
    }) 
    
    getLines_LineArray = []

    $.each(stationArray, function(i, l) {
        getLines_TempLines = sharedLines(l)
        $.each(getLines_TempLines, function(i, l) {
            getLines_LineArray.push(l)
        })

    })

    stationArray = Array.from(new Set(getLines_LineArray))
    return stationArray;
}

// Handle shared line colours
function sharedLines(a) {
    switch (a) {
        case "GreenShared":
            return ["Sunshine_CoastLine", "CabooltureLine", "GreenShared", "IpswichLine", "IpRwShared", "RosewoodLine", "RailbusLine"]
            break;
    
        case "LightBlueShared":
            return ["Redcliffe_PeninsulaLine", "LightBlueShared", "Springfield_CentralLine"]
            break;

        case "DarkBlueShared":
            return ["ClevelandLine", "DarkBlueShared", "ShorncliffeLine"]
            break;
    
        case "YellowShared":
            return ["AirportLine", "YellowShared", "Gold_CoastLine"]
            break;
    
        case "RedShared":
            return ["BeenleighLine", "RedShared", "Ferny_GroveLine"]
            break;
    
        case "IpRwShared":
            return [a, "IpswichLine", "RosewoodLine", "GreenShared"]
            break;
    
        case "AirportLine":
        case "Gold_CoastLine":
            return [a, "YellowShared"]
            break;
    
        case "Sunshine_CoastLine":
            return [a, "CabooltureLine", "GreenShared", "RailbusLine"]
            break;

        case "RosewoodLine":
            return [a, "IpRwShared"]
            break;

        case "CabooltureLine":
        case "IpswichLine":
            return [a, "GreenShared", "IpRwShared"]
            break;

        case "Redcliffe_PeninsulaLine":
        case "Springfield_CentralLine":
            return [a, "LightBlueShared"]
            break;

        case "ShorncliffeLine":
        case "ClevelandLine":
            return [a, "DarkBlueShared"]
            break;

        case "BeenleighLine":
        case "Ferny_GroveLine":
            return [a, "RedShared"]
            break;

        case "RailbusLine":
            return [a, "Sunshine_CoastLine"]
            break;
    
        default:
            return [a]
            break;
    }
}

// Ipswich line spacer handler
function spacerHandler(l) {
    if (l.includes('IpswichLine') && !l.includes('Springfield_CentralLine')) {
            d = true
        } else {
           d = false
        }
    return d
}

document.getElementById('qrMap').addEventListener('load', function () {
    svgPanZoom(document.getElementById('qrMap'), {
        minZoom: 1,
        maxZoom: 7.5,
        controlIconsEnabled: true,
    });
});