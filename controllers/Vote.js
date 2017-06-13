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
      let datum =  data.map(d=>{
        return d.length
      })

      res.render('votes/show', {
        options,
      svg: `<script>


        var margin = {
    top: 90,
    bottom: 100,
    left: 70,
    right: 100
  },
  w = 600 - margin.top - margin.bottom,
  h = 500 - margin.left - margin.right;
let dataPoints = [${datum}]
let selectData = ['${select}'][0].split(',')

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

       var xScale = d3.scaleLinear()
  .domain([0, [${datum}].length])
  .range([0, w])

  var xAxis = d3.scaleLinear()
      .domain(dataPoints)
      .range([0, w])

    var x = d3.scaleBand()
          .range([0, w])
          .padding(0.1);

          var color = d3.scaleOrdinal(d3.schemeCategory10);

          var tip = d3.tip().attr('class', 'd3-tip').html((d, i)=> {
              return d;
            });

let rect = svg.selectAll('rect').data([${datum}]).enter().append('rect')


    rect.attr('x', (d, i)=>{return xScale(i) + margin.left})
    .attr('y', (d, i)=>{return yScale(d)})
    .attr('width', w/ [${datum}].length - 10 ) //w/ [${datum}].length - 10
    .attr('height', (d, i)=>{return h - yScale(d)})
    .attr('fill', (d, i)=>{return color(i)})



var text  =  svg.selectAll("text")
       .data(selectData)
       .enter()
       .append("text")


       text.call(tip)
         .attr("x", function(d, i) {return i })
        .attr("y", function(d) {return h - 50})
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .html(d=>'<p> d </p>')
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)



    svg.append("g").call(d3.axisLeft(yScale).ticks(10))
    .attr("transform", "translate(" + margin.left + ")" )

    svg.append("g").call(d3.axisBottom(xAxis).ticks(0))
        .attr("transform", "translate(" + margin.left + "," + h + ")")
    </script>`
    })
    }
  })
}
vote.byuser = (req, res) => {
  res.send('by user')
}

module.exports = vote
