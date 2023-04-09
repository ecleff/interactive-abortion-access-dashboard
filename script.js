var vlSpec = 

{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 500,
    "height": 300,
    "data": {
      "url": "my_file.topojson",
      "format": {
        "type": "topojson",
        "feature": "subregion"
      }
    },
    "transform": [{
      "lookup": "id",
      "from": {
        "data": {
          "url": "my_file.topojson"
        },
        "key": "id",
        "fields": ["legal_status"]
      }
    }],
    "projection": {
      "type": "albersUsa"
    },
    "mark": "geoshape",
    "encoding": {
      "color": {
        "field": "legal_status",
        "type": "nominal"
      }
    }
  }
  
// {
//     "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//     "data": {
//       "url": "my_file.topojson"
//     },
//     "transform": [
//       {
//         "lookup": "id",
//         "from": {
//           "data": {
//             "url": "/my_file.topojson",
//             "format": {
//               "type": "topojson",
//               "feature": "subregion"
//             }
//           },
//           "key": "id"
//         }
//       }
//     ],
//     "vconcat": [
//       {
//         "mark": {"type": "geoshape", "stroke": "white"},
//         "encoding": {
//           "color": {
//             "field": "legal_status",
//             "type": "nominal",
//             "scale": {"scheme": "greens"},
//             "legend": {"title": "Population"}
//           },
//           "tooltip": [
//             {"field": "region", "type": "nominal", "title": "State"},
//             {"field": "legal_status", "type": "nominal", "title": "Abortion Legal Status"}
//           ]
//         }
//       },
//       {
//         "layer": [
//           {
//             "mark": {"type": "circle", "opacity": 0.8, "color": "black", "size": {"field": "avg_distance",
//         "type": "quantitative"}},
//             "encoding": {
//               "longitude": {"field": "long", "type": "quantitative"},
//               "latitude": {"field": "lat", "type": "quantitative"}
//             }
//           }
//         ],
//         "data": {
//           "url": "/my_file.topojson"
//         }
//       }
//     ],
//     "projection": {"type": "albersUsa"}
//   }
  
  vegaEmbed("#vis", vlSpec);