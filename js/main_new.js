var count_init = 0;
var count_end = 0;

function main(){
  d3.select("body").append("p").text("Hello World!");
  // parse_date();
  // add_sent();

  var width = 500;
  var height = 500;

  //Create SVG element
  var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  //Create line element inside SVG
  svg.append("line")
     .attr("x1", 100)
     .attr("x2", 500)
     .attr("y1", 50)
     .attr("y2", 50)
     .attr("stroke", "black")

  processingModal.style.display = "none"
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
  nb_threads_per_user = d3.nest()
        .key(function(d){return d.sender_name})
        .key(function(d) { return d.thread; })
        .rollup(function(leaves) { return leaves.length; })
        .entries(messages_array)

  nb_threads_per_user = nb_threads_per_user.sort(function(x, y){
         return d3.descending(x.values.length, y.values.length);
      })

  return nb_threads_per_user[0].key
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
