(function () {
    var CanvasJS = window.CanvasJS || CanvasJS ? window.CanvasJS : null;
    if (CanvasJS) {
        CanvasJS.Chart.prototype.exportAsCSV = function (fileName) {
            CanvasJSDataAsCSV(this, fileName);
        }
    }

    function CanvasJSDataAsCSV(chart, fileName) {
        if (chart.exportEnabled) {
            var exportCSV = document.createElement('div');
            var text = document.createTextNode("Save as CSV");            
            exportCSV.setAttribute("style", "padding: 12px 8px; background-color: " + chart.toolbar.backgroundColor + "; color: " + chart.toolbar.fontColor);
            exportCSV.appendChild(text);
            exportCSV.addEventListener("mouseover", function () {
                exportCSV.setAttribute("style", "padding: 12px 8px; background-color: " + chart.toolbar.backgroundColorOnHover + "; color: " + chart.toolbar.fontColorOnHover);
            });
            exportCSV.addEventListener("mouseout", function () {
                exportCSV.setAttribute("style", "padding: 12px 8px; background-color: " + chart.toolbar.backgroundColor + "; color: " + chart.toolbar.fontColor);
            });
            exportCSV.addEventListener("click", function () {
                parseCSV({
                    filename: (fileName || "chart-data") + ".csv",
                    chart: chart
                })
            });

            chart._toolBar.lastChild.appendChild(exportCSV);
        } else {
            var base64Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEgSURBVEhL3dM/SgNBFMfxBS8gWkYb0dJSyBGCwdIzRPAKgrZKINdIkVJB0qqteIdYCYoHEPX74P1gMszuzG5SiD/4wM6/99jJpvq3GeIVPwUu0ToLpIrVad1EB3Pp3KRLA1PcRAdyCYtLURNtziUsHMqmeGOUxnNtPs2cZNp+mk2S0eIteu7O5y5wgFN8Yw8vePZnnZVktLiDJzxi1+cOfe4GHxhhgjHOoLOSTLgYbjZz7OPaxzOc4Nif4/3JaNHe4MHpDc7xiW284R1b2IS9ka61MWpg925NrPi9z9mfx65pgC+fO0Lfn21/Nqt8RUo8XordZ9cmSjyuTfHGKH+nQe6qptiA5QqpPcbWkin5PXJNaot3Tdhk7cUVKxwUr6pfwprgQh4A9MYAAAAASUVORK5CYII=";
            var exportButton = document.createElement('button');

            exportButton.style.cssText = "position:relative;display: inline-block;padding: 0px 4px;height: 27px;cursor: pointer;text-align: center;text-decoration: none;background-color:" + chart.toolbar.backgroundColor + ";border: 1px solid " + chart.toolbar.borderColor + ";left:" + (chart.container.clientWidth - (chart.options.zoomEnabled ? 115 : 60)) + "px; top: 1px";

            var img = document.createElement("IMG");
            img.setAttribute("src", base64Img);
            exportButton.appendChild(img);
            exportButton.addEventListener("mouseover", function () {
                this.style.cssText = this.style.cssText + "background-color: " + chart.toolbar.backgroundColorOnHover;
            });
            exportButton.addEventListener("mouseout", function () {
                this.style.cssText = this.style.cssText + "background-color: " + chart.toolbar.backgroundColor;
            });
            exportButton.addEventListener("click", function () {
                parseCSV({
                    filename: (fileName || "chart-data") + ".csv",
                    chart: chart
                })
            });

            chart.container.appendChild(exportButton);
        }
    }

    function convertChartDataToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';
        keys = Object.keys(data[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;
                result += (!(typeof item[key] === 'undefined' || item[key] === null) ? item[key] : "");
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    function parseCSV(args) {
        var csv = "";
        for (var i = 0; i < args.chart.options.data.length; i++) {
            csv += convertChartDataToCSV({
                data: args.chart.options.data[i].dataPoints
            });
        }
        if (csv == null) return;
        var filename = args.filename || 'chart-data.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        downloadFile(csv, filename);
    }

    function downloadFile(extData, filename) {
        var data = encodeURI(extData);
        var link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        document.body.appendChild(link); // Required for FF
        link.click();
        document.body.removeChild(link);
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = CanvasJSDataAsCSV;
    }
    else {
        if (typeof define === 'function' && define.amd) {
            define([], function () {
                return CanvasJSDataAsCSV;
            });
        }
        else {
            window.CanvasJSDataAsCSV = CanvasJSDataAsCSV;
        }
    }
})();
