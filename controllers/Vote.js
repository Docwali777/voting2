const express = require('express');
const voteData = require('../models/votingdata')

const vote = {}

vote.index = (req, res) => {
  voteData.find({}, (err, options) => {
    if (err) {
      console.log(err);
    } else {

      console.log(options);
      res.render('votes/index', {options})
    }
  })
}

vote.new = (req, res) => {
  res.render('votes/new')
}

//submit data to create the graph with d3
vote.dataById = (req, res) => {
  voteData.findById(req.params.id, (err, options)=>{
    if(err){'cant post form'}


    options.options.data.sort()
    let {data} = options.options
for(let i = 0; i < data.length; i++){
if(data[i][0] === req.body.label){
data[i].push(req.body.label)
}

}
data.sort()
console.log('DATA',data);
    options.save()
        res.redirect(`/votes/${req.params.id}`)
  })


}

vote.deleteById = (req, res) => {
  voteData.findByIdAndRemove(req.params.id, (err, options) => {
    if (err) {
      console.log('error deleting ITEM');
    } else {
      console.log('item deleteById')
      res.redirect('/votes')
    }
  })
}

vote.editById = (req, res) => {
  voteData.findById(req.params.id, (err, options) => {
    if (err) {
      console.log('error editing post by id: ', err);
    } else {
      //ON=nyl add noew item if it is a new Item
      let {data, select} = options.options

      if (select.indexOf(req.body.select) < 0) {
        select.push(req.body.select)
         data.push([req.body.select])
 } else {
   console.log('present');
   for(let i = 0; i < data.length; i++){
   if(data[i][0] === req.body.select){
   data[i].push(req.body.select)
 }
 }
   }

data.sort()



console.log('EDIT', data);

      options.save((err, vote) => {
        if (err) {
          console.log('note added');
        } else {
          res.redirect(`/votes/${req.params.id}`)
        }
      })
    }
  })

}

vote.postvote = (req, res) => {
  console.log('new', req.body);
  voteData.create({
    options: {
      title: req.body.title,
      created: new Date(),
      select: []
    }
  }, (err, options) => {
    if (err)
      console.log('options not created');
    else {
      options.save()

      res.redirect(`/votes/${options._id}`)
    }
  })
}

vote.show = (req, res) => {

  voteData.findById(req.params.id, (err, options) => {
    if (err) {
      console.log('err find id');
    }
    else {

      let {data, select} = options.options

      data.sort()
//sort data tp match the title with the values for d3 chart
      select.sort((a, b)=>{
        return a[0] > b[0]
      })

let allData = []
for(let i = 0; i < data.length; i++){
  allData.push({title: select[i], data: data[i].length})
}

console.log('DATA ',data);
console.log('SELECT ', select);
// console.log('All Data ', (allData))

      let datum =  data.map(d=>{
        return d.length
      })
let points = datum;
points = JSON.stringify(points)

let all = allData.map(d=>{
  return d
})
all= JSON.stringify(all)

let title = select.sort()
title= JSON.stringify(title)

let selected = JSON.stringify(select)


      res.render('votes/show', {
        options,
      svg: `<script>
let joinedData = ${all}
// console.log('JOINED D3', joinedData)
let titles = ${title}
console.log(titles)

        var margin = {
    top: 90,
    bottom: 100,
    left: 70,
    right: 100
  },
  w = 1200 - margin.left - margin.right,
  h = 500 - margin.top - margin.bottom;


let dataPoints = [${datum}]
let selectData = ${selected}


let svg = d3.select('#chart').append('svg').attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var maxYValue = d3.max(dataPoints, function(d) {
     return d
   })

   var yScale = d3.scaleLinear()
       .domain([0, maxYValue])
       .range([h, 0])

       var y = d3.scaleLinear()
          .range([h, 0]);

          var xAxis = d3.scaleLinear()
              .domain(titles.length)
              .range([0, w])

            var x = d3.scaleBand()
                  .range([0, w])
                  .padding(0.5);

           x.domain(joinedData.map(function(d) { return d.title; }));
            y.domain([0, d3.max(joinedData, function(d) { return d.data; })]);


       var xScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, w])



          var color = d3.scaleOrdinal(d3.schemeCategory10);

          var tip = d3.tip().attr('class', 'd3-tip').html((d, i)=> {
              return '<h4>' + d.title +'<br>'+ 'Votes: '+ d.data  + '</h4>';
            });

            let rect = svg.selectAll('rect').data(joinedData).enter().append('rect')


    rect.call(tip)
    .attr('class', 'bar')
    .attr('x', (d, i)=>{return x(d.title) + margin.left  })
    .attr('y', (d, i)=>{return y(d.data)})
    .attr('width', x.bandwidth())
    .attr('height', (d, i)=>{return h - y(d.data)})
    .attr('fill', (d, i)=>{return color(i)})
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
      .append('g')
      .attr('class', 'xText')
      .attr("transform", "rotate(-65)");




    svg.append("g").call(d3.axisLeft(yScale).ticks(10))
    .attr("transform", "translate(" + 0 + margin.left + ")" )

     svg.append("g")
      .attr("transform", "translate("+ margin.left +"," + h + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr('class', 'xText')
           .style('fill', 'black')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")




    </script>`
    })
    }
  })
}
vote.byuser = (req, res) => {
  res.send('by user')
}

module.exports = vote
