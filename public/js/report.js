/* eslint-disable camelcase */
const playDate = localStorage.getItem('playDate');
const playStock = JSON.parse(localStorage.getItem('playStock'));

main();
async function main() {
  if (playDate && playStock) {
    const nowDate = document.querySelector('#nowDate');
    nowDate.innerHTML = `<h3>Your start date is: ${playDate}</h3>`;
    const stockUl = document.querySelector('.stockUl');
    for (let i = 0; i < playStock.length; i++) {
      const stock_li = document.createElement('li');
      const stock_a = document.createElement('a');
      // stock_a.setAttribute('href', '');
      stock_a.setAttribute('onclick',
        `get_report(${playStock[i].id},  '${playStock[i].stock}')`);
      stock_a.innerHTML = `${playStock[i].id} 
       ${playStock[i].stock}`;
      stock_li.appendChild(stock_a);
      stockUl.appendChild(stock_li);
    }
  }
}

async function get_report(id, stock) {
  const stock_select = document.querySelector('#stock_select');
  stock_select.innerHTML = `<h3>${id} ${stock}</h3>`;

  //get data from sql
  const revenue = await fetch(`api/1.0/stock/revenue?stock=${id}&date=${playDate}`, {
    method: 'GET',
  }).then((res) => res.json());
  const per = await fetch(`api/1.0/stock/per?stock=${id}&date=${playDate}`, {
    method: 'GET',
  }).then((res) => res.json());
  // console.log(per);

  // revenue table
  const revenue_table = document.querySelector('.revenue_table');
  revenue_table.style.display = '';
  const clone = document.querySelector('.revenue_table thead').cloneNode(true);
  if (revenue_table.childElementCount !== 0) {
    revenue_table.innerHTML = ''; // delete old data
  }
  let revenue_tbody;
  for (let i = 0; i < revenue.length; i++) {
    if (i == 0) {
      revenue_table.appendChild(clone);
      revenue_tbody = document.createElement('tbody');
      revenue_table.appendChild(revenue_tbody);
    }
    if (i % 18 == 0 && i > 0) {
      const clone2 = document.querySelector('.revenue_table thead').cloneNode(true);
      revenue_table.appendChild(clone2);
      revenue_tbody = document.createElement('tbody');
      revenue_table.appendChild(revenue_tbody);
    }

    const row = document.createElement('tr');
    row.setAttribute('class', `row${i}`);

    const month = document.createElement('td');
    month.innerHTML = revenue[i].month;

    const price = document.createElement('td');
    price.innerHTML = revenue[i].price;

    const high = document.createElement('td');
    high.innerHTML = revenue[i].high;
    const low = document.createElement('td');
    low.innerHTML = revenue[i].low;
    const diff = document.createElement('td');
    diff.innerHTML = revenue[i].diff;
    change_color(diff);
    const diff_percent = document.createElement('td');
    diff_percent.innerHTML = revenue[i].diff_percent;
    change_color(diff_percent);
    const revenue_mon = document.createElement('td');
    revenue_mon.innerHTML = revenue[i].revenue;

    const revenue_mondiff = document.createElement('td');
    revenue_mondiff.innerHTML = revenue[i].revenue_mondiff;
    change_color(revenue_mondiff);
    const revenue_yeardiff = document.createElement('td');
    revenue_yeardiff.innerHTML = revenue[i].revenue_yeardiff;
    change_color(revenue_yeardiff);
    const accumulative = document.createElement('td');
    accumulative.innerHTML = revenue[i].accumulative;
    const accumulative_diff = document.createElement('td');
    accumulative_diff.innerHTML = revenue[i].accumulative_diff;
    change_color(accumulative_diff);
    row.append(month, price, high, low, diff, diff_percent, revenue_mon,
      revenue_mondiff, revenue_yeardiff, accumulative, accumulative_diff);
    revenue_tbody.appendChild(row);
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

  // plot revenue
  const monArr = [];
  const priceArr = [];
  const revenueArr = [];
  const revenueYearDiffArr = [];
  for (let i = 0; i < revenue.length; i++) {
    priceArr[i] = parseFloat(revenue[i].price);
    monArr[i] = revenue[i].month;
    revenueArr[i] = parseFloat(revenue[i].revenue);
    revenueYearDiffArr[i] = parseFloat(revenue[i].revenue_yeardiff);
  }
  plot_revenue(monArr, priceArr, revenueArr, revenueYearDiffArr);

  //plot per
  plot_per(weekArr, price_perArr, epsArr, perArr, fourXArr, eightXArr, twelveXArr, 
    sixteenXArr, twentyXArr, twentyfourXArr);
}


// plot per
async function plot_per(weekArr, price_perArr, epsArr, perArr, 
  fourXArr, eightXArr, twelveXArr, sixteenXArr, twentyXArr, twentyfourXArr) {
  let colors = Highcharts.getOptions().colors;
  
  // per stream chart
  Highcharts.chart('container3', {
    chart: {
      borderColor: 'black',
      borderWidth: 2,
      type: 'line',
      zoomType: 'xy',
    },
    title: {
      text: '本益比河流圖',
      style: {
        fontWeight: 'bold',
      },
    },
    // subtitle: {
    //   text: 'Source: WorldClimate.com'
    // },
    xAxis: [{
      categories: weekArr,
      crosshair: true,
      reversed: true,
      title: {
        text: '年/週',
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
      name: '股價',
      data: price_perArr,
      color: colors[1],
    }, {
      name: '4倍',
      // type: 'spline',
      data: fourXArr,
      dashStyle: 'ShortDot',
      color: colors[0],
    }, {
      name: '8倍',
      // type: 'spline',
      data: eightXArr,
      dashStyle: 'ShortDot',
      color: colors[2],
    }, {
      name: '12倍',
      data: twelveXArr,
      dashStyle: 'ShortDot',
      color: colors[3],
    }, {
      name: '16倍',
      data: sixteenXArr,
      dashStyle: 'ShortDot',
      color: colors[4],
    }, {
      name: '20倍',
      data: twentyXArr,
      dashStyle: 'ShortDot',
      color: colors[5],
    }, {
      name: '24倍',
      data: twentyfourXArr,
      dashStyle: 'ShortDot',
      color: colors[6],
    },
  ],
  });
}

// datepicker
$(() => {
  $('#from').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    minDate: '2011-01-01',
    maxDate: playDate,
  });
  $('#to').datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    minDate: '2011-01-01',
    maxDate: playDate,
  });
});

function change_color(td) {
  if (td.innerHTML > 0) {
    td.style = 'color: red';
  } else if (td.innerHTML < 0) {
    td.style = 'color: green';
  } else {
    td.style = 'color: black';
  }
}


function getDate(date) {
  const fullDate = new Date(date);
  const yy = fullDate.getFullYear();
  const mm = fullDate.getMonth() + 1 <= 9 ? `0${fullDate.getMonth() + 1}` : fullDate.getMonth() + 1;
  const dd = fullDate.getDate() < 10 ? (`0${fullDate.getDate()}`) : fullDate.getDate();
  const today = `${yy}-${mm}-${dd}`;
  return today;
}


// plot revenue
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

  // revenueYearDiffArr
  Highcharts.chart('container2', {
    chart: {
      borderColor: 'black',
      borderWidth: 2,
      type: 'line',
      zoomType: 'xy',
    },
    title: {
      text: '月營收年增率 和 股價',
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
        text: '年增率 ',
        style: {
          color: Highcharts.getOptions().colors[0],
        },
      },
      labels: {
        format: '{value} %',
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
      name: '月營收年增率',
      type: 'column',
      yAxis: 1,
      data: revenueYearDiffArr,
      tooltip: {
        valueSuffix: ' %',
      },

    }, {
      name: '股價',
      type: 'spline',
      data: priceArr,
      tooltip: {
        valueSuffix: ' 元',
      },
    }],
  });
}

function sign() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'profile.html';
  } else {
    window.location.href = 'sign.html';
  }
}