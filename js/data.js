function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                if (headers[j] == 'date') {
                    tarr.push(new Date (data[j]));
                } else {
                    tarr.push(Number(data[j]));
                }
            }
            lines.push(tarr);
        }
    }
    // alert(lines);
    return {
        cols: headers,
        rows: lines
    };
}

async function getData() {
    return await fetch('data.csv').then(res => res.text()).then(data => processData(data))
}

async function getDataTrigle() {
    return await getData().then(data => {
        const { rows, cols } = data;
        const redata = (item, index) => {
            const nextItem = rows[index + 1]
            if (typeof nextItem === "undefined") {
                return [
                    item[0],
                    0,
                    0,
                    0,
                    0,
                ];
            }
            return [
                item[0],
                item[1] - nextItem[1],
                item[2] - nextItem[2],
                item[3] - nextItem[3],
                item[4] - nextItem[4],
            ];
        };
        const nextData = rows.map(redata).filter(a => a != null);
        // console.log(nextData);
        return {
            cols: cols,
            rows: nextData
        }
    });
}


// async function getDataTrigle() {
//     return await fetch('data.csv').then(res => res.text()).then(data => processData(data))
// }
