var svg = d3.select("svg");
var path = d3.geoPath();

var selectedCategory = 'birds';

var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

var width = Math.max( body.scrollWidth, body.offsetWidth,
                      html.clientWidth, html.scrollWidth, html.offsetWidth );

var transforms = ["transform",
                  "msTransform",
                  "webkitTransform",
                  "mozTransform",
                  "oTransform"];

var transformProperty = getSupportedPropertyName(transforms);

function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var stateAnimals; // a global
d3.json("https://fleemaja.github.io/data/stateAnimals.json", function(error, json) {
  if (error) return console.warn(error);
  stateAnimals = json;
  visualizeIt();
});

function visualizeIt() {
  d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
    if (error) throw error;

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function(d) {
          var animals = stateAnimals[STATES[d.id]][selectedCategory];
          return (animals.length > 0 ? "states" : "states noAnimalStates");
        })
        .on("mouseover", function(d) {
          var animals = stateAnimals[STATES[d.id]][selectedCategory];
          if (animals.length > 0) {
            var plural = animals.length > 1;
            var category = formatCategory(selectedCategory, plural);
            var htmlStr = `<p class="info-header">State ${category} of ${STATES[d.id]}</p>`;
            div.transition()
              .duration(200)
              .style("opacity", .9);
            if (animals.length < 4) {
              animals.forEach(function(animal) {
                var name = animal['commonName'];
                var img = animal['imgURL'];
                htmlStr += `<p>${name}</p><img src='${img}' alt='${name}' />`;
              })
            } else {
              htmlStr += '<table>';
              var index = 0;
              animals.forEach(function(animal) {
                if (index % 2 == 0) {
                  htmlStr += '<tr>';
                }
                var name = animal['commonName'];
                var img = animal['imgURL'];
                htmlStr += `<td valign="top"><p>${name}</p><img src='${img}' alt='${name}' /></td>`;
                if (index % 2 == 1) {
                  htmlStr += '</tr>';
                }
                index += 1;
              })
              htmlStr += '</table>';
            }
            div.html(htmlStr)
              .style("left", function() {
                if (d3.event.pageX < width/2) {
                  return d3.event.pageX + "px"
                }
              })
              .style("right", function() {
                if (d3.event.pageX > width/2) {
                  return (width - d3.event.pageX) + "px"
                }
              })
              .style("top", function() {
                if (selectedCategory === 'mammals' && (STATES[d.id] === 'Texas')) {
                  return (d3.event.pageY - 400) + "px";
                } else if (selectedCategory === 'mammals' && (STATES[d.id] === 'South Carolina' || STATES[d.id] === 'Alaska')) {
                  return (d3.event.pageY - 300) + "px";
                } else {
                  return (d3.event.pageY - (300 * (d3.event.pageY/height))) + "px";
                }
              })
          } else {
            div.transition()
              .duration(200)
              .style("opacity", .9);
            div.html(`<p>${STATES[d.id]}</p><p>No State ${formatCategory(selectedCategory, false)}</p>`)
              .style("left", function() {
                if (d3.event.pageX < width/2) {
                  return d3.event.pageX + "px"
                }
              })
              .style("right", function() {
                if (d3.event.pageX > width/2) {
                  return (width - d3.event.pageX) + "px"
                }
              })
              .style("top", (d3.event.pageY - 28) + "px");
          }
        })
        .on("mouseout", function(d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });

    svg.append("path")
        .attr("class", "state-borders")
        .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

    svg.append("text")
        .attr("x", 726)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "#777")
        .text("U.S. State Animals");

    svg.append("text")
        .attr("class", "instructions")
        .attr("x", 726)
        .attr("y", 70)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#222")
        .text("Hover over a state to view its state " + formatCategory(selectedCategory, false));
  });
}

function switchCategory() {
  svg.selectAll(".states")
  .attr("class", function(d) {
    var animals = stateAnimals[STATES[d.id]][selectedCategory];
    return (animals.length > 0 ? "states" : "states noAnimalStates");
  })

  svg.select('.instructions')
  .text("Hover over a state to view its state " + formatCategory(selectedCategory, false));
}

function formatCategory(string, plural) {
    var capitalized = string.charAt(0).toUpperCase() + string.slice(1);
    return plural || string === 'fish' ? capitalized : capitalized.slice(0, -1);
}

// follow along nav highlight
const triggers = document.querySelectorAll('.category');
const highlight = document.createElement('span');

highlight.classList.add('highlight');
document.body.appendChild(highlight);

function highlightLink(link) {
  selectedCategory = link.id;
  switchCategory();
  const linkCoords = link.getBoundingClientRect();
  const coords = {
    width: linkCoords.width,
    height: linkCoords.height,
    top: linkCoords.top + window.scrollY,
    left: linkCoords.left + window.scrollX
  };
  highlight.style.width = `${coords.width}px`;
  highlight.style.height = `${coords.height}px`;
  highlight.style[transformProperty] = `translate(${coords.left}px, ${coords.top}px)`;
}

function selectCategory(e) {
  e.preventDefault();
  highlightLink(this);
}

[].forEach.call(triggers, (a) => a.addEventListener('click', selectCategory));
window.addEventListener("resize", function() {
  var selectedLink = document.querySelector(`#${selectedCategory}`);
  highlightLink(selectedLink);

  height = Math.max( body.scrollHeight, body.offsetHeight,
                         html.clientHeight, html.scrollHeight, html.offsetHeight );

  width = html.clientWidth;
});

// default = highlight birds
const birds = document.querySelector('#birds');
highlightLink(birds);

// topojson ids to State Names (Key-Value Map)
var STATES = {
  '01': 'Alabama',
  '02': 'Alaska',
  '04': 'Arizona',
  '05': 'Arkansas',
  '06': 'California',
  '08': 'Colorado',
  '09': 'Connecticut',
  '10': 'Delaware',
  '11': 'District of Columbia',
  '12': 'Florida',
  '13': 'Georgia',
  '15': 'Hawaii',
  '16': 'Idaho',
  '17': 'Illinois',
  '18': 'Indiana',
  '19': 'Iowa',
  '20': 'Kansas',
  '21': 'Kentucky',
  '22': 'Louisiana',
  '23': 'Maine',
  '24': 'Maryland',
  '25': 'Massachusetts',
  '26': 'Michigan',
  '27': 'Minnesota',
  '28': 'Mississippi',
  '29': 'Missouri',
  '30': 'Montana',
  '31': 'Nebraska',
  '32': 'Nevada',
  '33': 'New Hampshire',
  '34': 'New Jersey',
  '35': 'New Mexico',
  '36': 'New York',
  '37': 'North Carolina',
  '38': 'North Dakota',
  '39': 'Ohio',
  '40': 'Oklahoma',
  '41': 'Oregon',
  '42': 'Pennsylvania',
  '44': 'Rhode Island',
  '45': 'South Carolina',
  '46': 'South Dakota',
  '47': 'Tennessee',
  '48': 'Texas',
  '49': 'Utah',
  '50': 'Vermont',
  '51': 'Virginia',
  '53': 'Washington',
  '54': 'West Virginia',
  '55': 'Wisconsin',
  '56': 'Wyoming'
};
