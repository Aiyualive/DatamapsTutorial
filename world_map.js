var code_converter = {
    'USA': 'USA',
    'UK': 'GBR',
    'New Zealand': 'NZL',
    'Canada': 'CAN',
    'Australia': 'GAUSBR',
    'Belgium': 'BEL',
    'Japan': 'JPN',
    'Germany': 'DEU',
    'China': 'CHN',
    'France': 'FRA',
    'Mexico': 'MEX',
    'Spain': 'ESP',
    'Hong Kong': 'GBHKGR',
    'Czech Republic': 'CZE',
    'India': 'IND',
    'South Korea': 'KOR',
    'Peru': 'PER',
    'Italy': 'ITA',
    'Soviet Union': 'RUS',
    'Russia': 'RUS',
    'Aruba': 'ABW',
    'Denmark': 'DNK',
    'Libya': 'LBY',
    'Ireland': 'IRL',
    'South Africa': 'ZAF',
    'Iceland': 'ISL',
    'Switzerland': 'CHE',
    'Romania': 'ROU',
    'West Germany': 'DEU',
    'Chile': 'CHL',
    'Netherlands': 'NLD',
    'Hungary': 'HUN',
    'Panama': 'PAN',
    'Greece': 'GRC',
    'Sweden': 'SWE',
    'Norway': 'NOR',
    'Taiwan': 'TWN',
    'Cambodia': 'KHM',
    'Thailand': 'THA',
    'Slovakia': 'SVK',
    'Bulgaria': 'BGR',
    'Iran': 'IRN',
    'Poland': 'POL',
    'Georgia': 'GEO',
    'Turkey': 'TUR',
    'Nigeria': 'NGA',
    'Brazil': 'BRA',
    'Finland': 'GBR',
    'Bahamas': 'BHS',
    'Argentina': 'ARG',
    'Colombia': 'COL',
    'Israel': 'ISR',
    'Egypt': 'EGY',
    'Kyrgyzstan': 'KGZ',
    'Indonesia': 'IDN',
    'Pakistan': 'PAK',
    'Slovenia': 'SVN',
    'Afghanistan': 'AFG',
    'Dominican Republic': 'DOM',
    'Cameroon': 'CMR',
    'United Arab Emirates': 'ARE',
    'Kenya': 'KEN',
    'Philippines': 'PHL'
}

var countries =[]
var dict_counts = {}
var dataset = {}

// V3 - no then function Promises
// https://data.world/data-society/imdb-5000-movie-dataset

// Country iso 3 codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
// Format:
// { "USA": {numberOfThings: count, fillColor: #FFFFFF},
//   "CAN": {numberOfThings: count, fillColor: #FFFFFF}
// }
d3.csv("movie_data.csv", function(data){
    // Get all the country names
    for (i = 0; i < data.length; i++){
        var c = data[i].country
        if (c == "Soviet Union"){
            countries.push("Russia")
        }
        else if (c == 'West Germany'){
            countries.push("Germany");
        }
        else if (c != "" && c != "Official site" && c != "New Line" ){ // Filter out empty values
            countries.push(c);
        }
    }

    // Bincount of the countries
    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];
        dict_counts[country] = dict_counts[country] ? dict_counts[country] + 1 : 1;
    }

    // Get count for each country
    var counts = Object.keys(dict_counts).map(function(key){
        return dict_counts[key];
    });

    // Set the color scale
    var minValue = Math.min.apply(null, counts),
        maxValue = Math.max.apply(null, counts);
    var paletteScale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range(["#FFCCCB", "#8B0000"]); // Light red, dark red

    Object.keys(dict_counts).forEach(function(key) {
        //add country converter
        var country_code = code_converter[key],
            value =  dict_counts[key];
        dataset[country_code] = {
            movieCount: value,
            fillColor: paletteScale(value)
        };
    });

    // Documentation
    new Datamap({
        element: document.getElementById('container1'),
        projection: 'mercator', // Flat view

        // Non-listed countries are defaulted to this color
        fills: {
            defaultFill: '#F5F5F5' // Grey
        },
        data: dataset,
        geographyConfig: {
            borderColor: '#DEDEDE', // Default border color
            highlightBorderWidth: 3,
            // Do not change color on mouse hover
            highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
            },
            highlightBorderColor: '#B7B7B7', // Color when highligthing
            // Popup tooltip
            popupTemplate: function(geo, data) {
            // don't show tooltip if country not present in dataset
            if (!data) {
                return;
            }
            // tooltip content
            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Count: <strong>', data.movieCount, '</strong>',
                '</div>'
            ].join('');
            }
        }
    });
})

