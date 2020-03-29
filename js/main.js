  google.charts.load('current', {
    'packages': [
      'line', 'table', 'bar',
      'corechart'
    ]
  });
  google.charts.setOnLoadCallback(drawLineChart);
  google.charts.setOnLoadCallback(drawChartTrigle);
  google.charts.setOnLoadCallback(drawChartTrigle2);
  google.charts.setOnLoadCallback(drawTable);
  google.charts.setOnLoadCallback(drawTableA);

  async function drawTableA() {
    const rawData = await getData();
    console.log('drawTableA', rawData)
    console.log('drawTableA', rawData.rows.map((d, index) => {
      const diffcheck = () => {
        const nextIndex = index + 1;
        const nextData = rawData.rows[nextIndex] ? rawData.rows[nextIndex] : { 1: 0 }
        return d[1] - nextData[1]
      }
      return [
        ...d,
        diffcheck(),
      ]
    }))

    var data = new google.visualization.DataTable();
    data.addColumn('date', rawData.cols[0]);
    data.addColumn('number', rawData.cols[1]);
    data.addColumn('number', rawData.cols[2]);
    data.addColumn('number', rawData.cols[3]);
    data.addColumn('number', rawData.cols[4]);
    data.addRows(rawData.rows);

    // var table = new google.visualization.Table(document.getElementById('table_div_a'));

    // table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
  }

  async function drawChartTrigle2() {
    const rawData = await getDataTrigle();
    var data = google.visualization.arrayToDataTable([
      [
        rawData.cols[0],
        rawData.cols[1],
      ],
      ...rawData.rows.map(d => [ d[0], d[1] ]),
    ]);

    var options = {
      chart: {
        title: 'พบผู้เฝ้าระวัง (คน/วัน)',
        // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      series: {
        0: { title: 'เฝ้าระวัง' },
      },
      legend: { position: 'bottom' },
    };

    // var chart = new google.charts.Bar(document.getElementById('columnchart_material2'));
    // chart.draw(data, google.charts.Bar.convertOptions(options));
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_material2"));
    chart.draw(data, {
      title: 'พบผู้เฝ้าระวัง (คน/วัน)',
      series: {
        0: { title: 'เฝ้าระวัง' },
      },
      legend: { position: 'top' },
      explorer: {
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomOut: 1,
      },
      chartArea: {
        width: '80%', height: '60%'
      },
      vAxis: {
        viewWindow: { min: 0 },
      },
    })
  }

  async function drawChartTrigle() {
    const rawData = await getDataTrigle();
    var data = google.visualization.arrayToDataTable([
      [
        rawData.cols[0],
        rawData.cols[2],
        rawData.cols[3],
        rawData.cols[4],
      ],
      ...rawData.rows.map(d => [ d[0], d[2], d[3], d[4] ]),
    ]);

    var options = {
      chart: {
        title: 'การเปลี่ยนแปลง (คน/วัน)',
        // subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      series: {
        0: { title: 'ยืนยัน', color: '#dc3545', },
        1: { title: 'รักษาหาย', color: '#3cb44b' },
        2: { title: 'เสียชีวิต', color: '#6c757d' },
      },
      isStacked: true,
    };

    // var chart = new google.charts.Bar(document.getElementById('columnchart_material'));
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_material"));
    chart.draw(data, {
      title: 'การเปลี่ยนแปลง (คน/วัน)',
      // isStacked: true,
      legend: { position: 'top' },
      explorer: {
        axis: 'horizontal',
        keepInBounds: true,
        // actions: ['dragToZoom', 'rightClickToReset']
        // maxZoomIn: 8.0,
        maxZoomOut: 1,
      },
      series: {
        0: { title: 'ยืนยัน', color: '#dc3545', },
        1: { title: 'รักษาหาย', color: '#3cb44b' },
        2: { title: 'เสียชีวิต', color: '#6c757d' },
      },
      chartArea: {
        width: '80%', height: '60%'
      },
      vAxis: {
        viewWindow: { min: 0 },
      },
    });
    // chart.draw(data, google.charts.Bar.convertOptions(options));
  };

  async function drawTable() {
    const rawData = await getData();
    var data = new google.visualization.DataTable();

    const nextData = () => {
      const data = rawData.rows;
      const reData = (d, index) => {
        const nextIndex = index + 1;
        const nextD = data[nextIndex] ? data[nextIndex] : [ 0, 0, 0, 0 ];
        const diffcheck = () => d[1] - nextD[1] ;
        const diffConfirmed = () => d[2] - nextD[2] ;
        const diffRecovered = () => d[3] - nextD[3] ;
        return [
          d[0],
          d[1],
          diffcheck(),
          d[2],
          diffConfirmed(),
          d[3],
          diffRecovered(),
          d[4],
          // d[2]/d[1] * 100,
          // d[3]/d[2] * 100,
          // d[4]/d[2] * 100,
        ];
      };
      return data.map(reData)
    };

    data.addColumn('date', rawData.cols[0]);
    data.addColumn('number', rawData.cols[1]);
    data.addColumn('number', 'diff - check');
    data.addColumn('number', rawData.cols[2]);
    data.addColumn('number', 'diff - Confirmed');
    data.addColumn('number', rawData.cols[3]);
    data.addColumn('number', 'diff - Recovered');
    data.addColumn('number', rawData.cols[4]);
    // data.addColumn('number', 'confirmed/check');
    // data.addColumn('number', 'recovered/confirmed');
    // data.addColumn('number', 'deaths/confirmed');
    data.addRows(nextData());

    var table = new google.visualization.Table(document.getElementById('table_div'));

    const color = {
      GREEN: '#28a745',
      RED: '#bd2130',
      YELLOW: '#d39e00',
    }

    var formatterCheck = new google.visualization.ColorFormat();
    // formatterCheck.addRange(1, Infinity, 'white', color.RED);
    formatterCheck.addRange(1, Infinity, color.RED, null);
    // formatterCheck.addRange(-99, 1, 'white', color.GREEN);
    formatterCheck.addRange(-99, 1, color.GREEN, null);
    formatterCheck.format(data, 2); // Apply formatter to second column

    var formatterRecovered = new google.visualization.ColorFormat();
    formatterRecovered.addRange(1, Infinity,  color.GREEN, null);
    formatterRecovered.addRange(-99, 1, color.YELLOW,  null);
    formatterRecovered.format(data, 6); // Apply formatter to second column

    var formatterConfirmed = new google.visualization.ColorFormat();
    formatterConfirmed.addRange(-99, 1, color.GREEN, null);
    formatterConfirmed.addRange(1, Infinity, color.RED, null);
    formatterConfirmed.format(data, 4); // Apply formatter to second column

    table.draw(data, { 
      allowHtml: true,
      showRowNumber: true,
      width: '100%',
      height: '100%'
    });
  }

  async function drawLineChart() {
    const rawData = await getData();
    var data = google.visualization.arrayToDataTable([
        [
          rawData.cols[0],
          rawData.cols[2],
          rawData.cols[3],
          rawData.cols[4],
        ],
        ...rawData.rows.map(a => [
          a[0],
          a[2],
          a[3],
          a[4],
        ]),
    ]);

    var options = {
      chart: {
        title: 'ยอดสะสม (คน)',
        // subtitle: 'in millions of dollars (USD)'
      },
      series: {
        0: { title: 'ยืนยัน', color: '#dc3545', },
        1: { title: 'รักษาหาย', color: '#3cb44b' },
        2: { title: 'เสียชีวิต', color: '#6c757d' },
      },
      legend: { position: 'bottom' },
      hAxis: {
        title: 'ช่วงเวลา'
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    // var chart = new google.charts.Line(document.getElementById('curve_chart'));
    chart.draw(data, {
      title: 'ยอดสะสม (คน)',
      curveType: 'function',
      legend: { position: 'top' },
      // width: 900,
      chartArea: {
        width: '80%', height: '60%'
      },
      explorer: {
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomOut: 1,
      },
      series: {
        0: { title: 'ยืนยัน', color: '#dc3545', },
        1: { title: 'รักษาหาย', color: '#3cb44b' },
        2: { title: 'เสียชีวิต', color: '#6c757d' },
      },
      vAxis: {
        viewWindow: { min: 0 },
      },
      hAxis: {
        title: 'ช่วงเวลา',
      },
    });

    // chart.draw(data, google.charts.Line.convertOptions(options));
  }