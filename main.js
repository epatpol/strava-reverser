var fs = require('fs'),
    xml2js = require('xml2js'),
    XMLWriter = require('xml-writer');

var builder = new xml2js.Builder();

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/test.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        newArray = [];
        const startTimeSeconds = 60638; // Just before I paused like an idiot
        var counter = 1;
        oldArray = result.test.trkpt.reverse();
        xw = new XMLWriter(' ');


        oldArray.forEach((trkpt, index) => {
            if ((index + 1) % 5 === 0) // Compensate for the faster speeds, you don't want two values with the same time, because I was faster, I can delete one point every 5
                return true;

            newTime = secondsToTimeString(startTimeSeconds + counter * 1); // 1 second approximately to finish exactly just before I unpaused
            trkpt.time[0] = trkpt.time[0].replace(/\d{2}\:\d{2}\:\d{2}/, newTime);
            counter++;
            newArray.push(trkpt);
        })

        result.test.trkpt = newArray;
        // var xml = builder.buildObject(result.test.trkpt);
        xw.startDocument('1.0', 'UTF-8');
        xw.startElement('indent1');
        xw.startElement('indent2');
        xw.startElement('indent3');

        result.test.trkpt.forEach(trkpt => {
            xw.startElement('trkpt');
            xw.writeAttribute('lat', trkpt.$.lat)
            xw.writeAttribute('lon', trkpt.$.lon)
            xw.startElement('ele');
            xw.text(trkpt.ele[0]);
            xw.endElement();
            xw.startElement('time');
            xw.text(trkpt.time[0]);
            xw.endElement();
            xw.endElement();
        });
        xw.endDocument();

        // console.log(xw.toString());

        fs.writeFileSync(__dirname + '/new.xml', xw.toString());
        console.log('Done');

    });
});

function secondsToTimeString(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds - (hours * 3600))/60);
    const seconds = ('0' + (timeInSeconds - (hours * 3600) - (minutes*60))).slice(-2);


    return hours + ':' + minutes + ':' + seconds;
}