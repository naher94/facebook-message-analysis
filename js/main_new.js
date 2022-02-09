var count_init = 0;
var count_end = 0;

function main(){
  parse_date();
  add_sent();

  d3.select("body").append("p").text(messages_array.length);

  messages_by_send = d3.rollup(messages_array, v => v.length, d => d.sent)
  console.log(messages_by_send)

  var data = [messages_by_send.get(false)/100000, messages_by_send.get(true)/100000];
  console.log(data)
  var width = 200,
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

  bar.append("rect")
  .attr("width", function(d) {
            return d * scaleFactor;
  })
  .attr("height", barHeight - 1);

  bar.append("text")
  .attr("x", function(d) { return (d*scaleFactor); })
  .attr("y", barHeight / 2)
  .attr("dy", ".35em")
  .text(function(d) { return d; });
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
