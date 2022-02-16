var count_init = 0;
var count_end = 0;

function main_old(){
  parse_date();
  add_sent();

  d3.select("body").append("p").text(messages_array.length);

  messages_by_send = d3.rollup(messages_array, v => v.length, d => d.sent)
  console.log(messages_by_send)

  var data = [messages_by_send.get(false), messages_by_send.get(true)];
  console.log(data)
  var width = 600,
  scaleFactor = 10,
  barHeight = 20;

  var graph = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", barHeight * data.length);

  var bar = graph.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                  return "translate(0," + i * barHeight + ")";
            });

  var scale = d3.scaleLinear()
            .domain([d3.min(data), d3.max(data)])
            .range([50, 500]);

  bar.append("rect")
  .attr("width", function(d) { return scale(d); })
  .attr("height", barHeight - 1);

  bar.append("text")
  .attr("x", function(d) { return scale(d); })
  .attr("y", barHeight / 2)
  .attr("dy", ".35em")
  .text(function(d) { return d; });
  }

function main(){
  parse_date();
  add_sent();

  d3.select("body").append("p").text(messages_array.length);

  messages_by_send = d3.rollup(messages_array, v => v.length, d => d.sent)
  console.log(messages_by_send)

  let array = Array.from(messages_by_send, ([name, value]) => ({ name, value }));

  console.log(array);

  chart = BarChart(array, {
    x: d => d.name,
    y: d => d.value,
    xDomain: d3.groupSort(array, ([d]) => -d.value, d => d.name), // sort by descending frequency
    yFormat: "n",
    yLabel: "↑ Frequency",
    width: 500,
    height: 500,
    color: "steelblue"
  })

  console.log(chart);

  // Add to DOM
  d3.select('body')
    .append(function(){return chart;});

  // //converts CSV to an array then runs the BarChart function
  // d3.csv("/alphabet.csv").then(function(alphabet) {
  //   console.log(alphabet)

  //   // chart variable returns an svg object
  //   chart = BarChart(alphabet, {
  //     x: d => d.letter,
  //     y: d => d.frequency,
  //     xDomain: d3.groupSort(alphabet, ([d]) => -d.frequency, d => d.letter), // sort by descending frequency
  //     yFormat: "%",
  //     yLabel: "↑ Frequency",
  //     width: 500,
  //     height: 500,
  //     color: "steelblue"
  //   })

  //   console.log(chart);

  //   // Add to DOM
  //   d3.select('body')
  //     .append(function(){return chart;});
  // });
}

function add_sent(){
  // Identify the username of the user, and label each messaged as sent or not.
  user_name = get_username()
  messages_array.forEach(function(d){
    d.sent = d.sender_name == user_name
  })
}

function get_username(){
  // Identify the username of the user based on the user who appears in the most threads
  nb_threads_per_user = d3.rollup(messages_array, v => v.length, d => d.sender_name)

  return d3.greatest(nb_threads_per_user, ([, count]) => count)[0]
}

{
  var parseUTCDate = d3.timeParse("%Y-%m-%d");
  var parseUTCDate2 = d3.timeParse("%W-%m-%Y");
}

function parse_date(){
  messages_array.forEach(function(d){
     date = new Date(d.timestamp * 1000);
     d.timeMinutes = getTimeMinutes(date); // Approximative (no seconds) used for the time density
     d.timeSeconds = getTimeSeconds(date); // Precise (add seconds) used for the scatterplot.
     d.date = getDate(date);
  })
};


getDate = function(date){
  string = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return parseUTCDate(string);
}

getTimeSeconds = function(date){
  var day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  day.setSeconds(date.getSeconds());
  return day;
};

getTimeMinutes = function(date){
  var day = new Date(2000, 0, 1);
  day.setHours(date.getHours());
  day.setMinutes(date.getMinutes());
  return day;
};
