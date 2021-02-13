import {select, csv} from './d3.min'

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

csv('data.csv').then(data => {
    data.forEach(d => {
        d.population = +d.population*1000;
    });
    console.log(data);
})