/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-arrow-callback */
const express = require('express');
require('dotenv').config('../');
const request = require('request');
const rp = require('request-promise');

const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const { promisify } = require('util');

const mysql = require('./util/mysql_con.js');
const utility = require('./util/util.js');

const { db } = mysql;
const dbquery = promisify(db.query).bind(db);

main();
async function main() {
  // const randomArr = [];
  // for (let i = 0; i < 100; i++) {
  //   randomArr[i] = formatDate(randomDate());
  // }

  // randomArr.sort();

  let getSeason('2017-07-01');
  // console.log(randomArr);
}

function getSeason(date) {
  const now_date = new Date(date);
  const season = Math.ceil((now_date.getMonth() + 1) / 3);
  let post;
  if ((season - 2) < 1) {
    post = `${now_date.getFullYear() - 1}Q${season - 2 + 4}`;
  } else {
    post = `${now_date.getFullYear()}Q${season - 2}`;
  }
  return post;
}

//per table
const weekArr = [], epsArr = [], perArr = [], price_perArr = [],
fourXArr = [], eightXArr = [], twelveXArr = [],sixteenXArr = [],
twentyXArr = [], twentyfourXArr = [];

const per_table = document.querySelector('.per_table');
per_table.style.display = '';
let clone3 = document.querySelector('.per_table thead').cloneNode(true);
if (per_table.childElementCount !== 0) {
per_table.innerHTML = ''; // delete old data
}
let per_tbody;
document.querySelector('#per h2').innerHTML = '本益比河流圖';
for (let i = 0; i < per.length; i++) {
if (i == 0) {
  per_table.appendChild(clone3);
  per_tbody = document.createElement('tbody');
  per_table.appendChild(per_tbody);
}
if (i % 18 == 0 && i > 0) {
  clone3 = document.querySelector('.per_table thead').cloneNode(true);
  per_table.appendChild(clone3);
  per_tbody = document.createElement('tbody');
  per_table.appendChild(per_tbody);
}

const row = document.createElement('tr');
row.setAttribute('class', `row${i}`);

const week = document.createElement('td');
week.innerHTML = per[i].week;
weekArr[i] = week.innerHTML;
weekArr[i] = weekArr[i].slice(0,2) + '/' + weekArr[i].slice(2);
const price = document.createElement('td');
price.innerHTML = per[i].price;
price_perArr[i] = parseFloat(price.innerHTML);
const diff = document.createElement('td');
diff.innerHTML = per[i].diff;
change_color(diff);
const diff_percent = document.createElement('td');
diff_percent.innerHTML = per[i].diff_percent.replace('%', '');
change_color(diff_percent);
const eps = document.createElement('td');
eps.innerHTML = per[i].eps;
epsArr[i] = parseFloat(per[i].eps);
const per_value = document.createElement('td');
per_value.innerHTML = per[i].per;
perArr[i] = parseFloat(per[i].per);
const fourX = document.createElement('td');
fourX.innerHTML = (per[i].eps * 4).toFixed(2)*100/100;
fourXArr[i] = parseFloat(fourX.innerHTML);
const eightX = document.createElement('td');
eightX.innerHTML = (per[i].eps * 8).toFixed(2)*100/100;
eightXArr[i] = parseFloat(eightX.innerHTML);
const twelveX = document.createElement('td');
twelveX.innerHTML = (per[i].eps * 12).toFixed(2)*100/100;
twelveXArr[i] = parseFloat(twelveX.innerHTML);
const sixteenX = document.createElement('td');
sixteenX.innerHTML = (per[i].eps * 16).toFixed(2)*100/100;
sixteenXArr[i] = parseFloat(sixteenX.innerHTML);
const twentyX = document.createElement('td');
twentyX.innerHTML = (per[i].eps * 20).toFixed(2)*100/100;
twentyXArr[i] = parseFloat(twentyX.innerHTML);
const twentyfourX = document.createElement('td');
twentyfourX.innerHTML = (per[i].eps * 24).toFixed(2)*100/100;
twentyfourX[i] = parseFloat(twentyfourX.innerHTML);

row.append(week, price, diff, diff_percent, eps, per_value,
 fourX, eightX, twelveX, sixteenX, twentyX, twentyfourX);
per_tbody.appendChild(row);
}
async function plot_revenue(monArr, priceArr, revenueArr, revenueYearDiffArr) {
  Highcharts.chart('container', {
    chart: {
      borderColor: 'black',
      borderWidth: 2,
      type: 'line',
      zoomType: 'xy',
    },
    title: {
      text: '月營收 和 股價',
      style: {
        fontWeight: 'bold',
      },
    },
    // subtitle: {
    //   text: 'Source: WorldClimate.com'
    // },
    xAxis: [{
      categories: monArr,
      crosshair: true,
      reversed: true,
      title: {
        text: '年/月',
      },
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        format: '{value} 元',
        style: {
          color: Highcharts.getOptions().colors[1],
        },
      },
      title: {
        text: '股價',
        style: {
          color: Highcharts.getOptions().colors[1],
        },
      },
    }, { // Secondary yAxis
      title: {
        text: '營收 ',
        style: {
          color: Highcharts.getOptions().colors[0],
        },
      },
      labels: {
        format: '{value} 億',
        style: {
          color: Highcharts.getOptions().colors[0],
        },
      },
      opposite: true,
    }],
    tooltip: {
      shared: true,
    },
    legend: {
      align: 'left',
      x:80,
      verticalAlign: 'top',
      borderWidth: 0
    },
  
    series: [{
      name: '月營收',
      type: 'column',
      yAxis: 1,
      data: revenueArr,
      tooltip: {
        valueSuffix: ' 億',
      },

    }, {
      name: '股價',
      type: 'spline',
      data: priceArr,
      tooltip: {
        valueSuffix: '元',
      },
    }],
  });
