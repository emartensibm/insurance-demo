let express = require('express');
let hbs = require('hbs');
let axios = require('axios');
let VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
let AssistantV1 = require('watson-developer-cloud/assistant/v1');
const auth = require('./auth.js');
const btoa = require("btoa");
let skipper = require("skipper");
let skipperS3 = require('skipper-s3');
let request = require('request');
let fs = require('fs');


let app = express();
app.enable('trust proxy');
app.set('view engine', "hbs");
app.use(express.static('public'));
app.use(express.json());
app.use(skipper());

//watson assistant
let assistant = new AssistantV1({
    username: auth.assistant.username,
    password: auth.assistant.password,
    url: auth.assistant.url,
    version: '2018-02-16'
});

//machine learning
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const wml_credentials = new Map();
wml_credentials.set("url", auth.wml.wml_service_credentials_url);
wml_credentials.set("username", auth.wml.wml_service_credentials_username);
wml_credentials.set("password", auth.wml.wml_service_credentials_password);

//functions
function apiGet(url, username, password, loadCallback, errorCallback){
    const oReq = new XMLHttpRequest();
    const tokenHeader = "Basic " + btoa((username + ":" + password));
    const tokenUrl = url + "/v3/identity/token";

    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("GET", tokenUrl);
    oReq.setRequestHeader("Authorization", tokenHeader);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send();
}

function apiPost(scoring_url, token, payload, loadCallback, errorCallback){
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("POST", scoring_url);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(payload);
}

//routes
app.post('/load_policy', (req, res) => {
    let userid = req.body.userid;
    console.log('loading policy from database...');
    //TODO: postgres select statement here

    res.send({
        driver: {
            driver_id: '9876554',
            first_name: 'Rachel',
            last_name: 'Brooks',
            age: 27,
            contact_number: '303-555-3333',
            email: 'rbrooks@email.com',
            commute_discount: 'Y',
            addr_number: '201',
            street_name: 'Main St',
            unit_designation: '',
            unit_number: '',
            city: 'Chicago',
            state: 'IL',
            zipcode: '60290',
            latitude: '',
            longitude: ''
        },
        policy: {
            policy_id: '123456',
            calendar_year: 1996,
            model_year: 2012,
            make: 'BMW',
            model: 'X3',
            plate: 'xxxx',
            color: 'White',
            initial_odometer: '27642',
            low_mileage_use: 'Y'
        },
        household: {
            household_id: '9876554',
            addr_number: '225',
            street_name: '7th St',
            unit_designation: '',
            unit_number: '',
            city: 'Chicago',
            state: 'IL',
            zipcode: '60610',
            latitude: '',
            longitude: ''
        }
    });
});

app.post('/claim_submit', (req, res) => {
    let claim = req.body.claim;
    console.log('Writing claim data to database:');
    console.log(JSON.stringify(claim, null, 2));
});

app.post('/send_message', (req, res) => {
    let convo = req.body.convo;
    if (!convo.workspace_id) {
        convo.workspace_id = auth.assistant.workspace;
    }
    let message_obj = {
        input: convo.input,
        context: convo.context,
        workspace_id: convo.workspace_id
    };
    assistant.message(
        message_obj,
        function(err, response) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(response);
            }
        }
    );
});

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/token', (req, res) => {
    res.render('token.hbs');
});

app.get('/map', (req, res) => {
    res.render('map.hbs');
});

app.get('/weather', (req, res) => {
    let lat = 41.8781;
    let lng = -87.6298;

    axios.get(`https://be5be436-f03c-4244-a0ad-69dacdd59117:nGeRPekaMo@twcservice.mybluemix.net:443/api/weather/v1/geocode/${lat}/${lng}/observations/timeseries.json?hours=23`).then(result => {
        let returnData = result.data.observations;
        let tempTotal = 0.0;
        let precipTotal = 0.0;
        let snowTotal = 0.0;
        let precipMeasure = 0.0;
        let city = returnData[0].obs_name;
        let icon = '';
        let phrase = '';
        returnData.forEach((data) => {
            tempTotal += data.feels_like;
            precipTotal += data.precip_hrly;
            icon = data.wx_icon;
            phrase = data.wx_phrase;
            if (data.precip_total) {
                if (data.precip_total > precipMeasure) {
                    precipMeasure = data.precipTotal;
                }
            }
            if (data.snow_hrly) {
                snowTotal += data.snow_hrly;
            }
        });
        res.send({"avg_temp": tempTotal / returnData.length, "avg_snow": snowTotal / returnData.length, "avg_precip": precipTotal / returnData.length, "precip": precipMeasure, "location": city, "icon": icon, "phrase": phrase});
    });
});

app.post('/get_weather', (req, res) => {
    let lat = req.body.lat;
    let lng = req.body.lng;

    axios.get(`https://be5be436-f03c-4244-a0ad-69dacdd59117:nGeRPekaMo@twcservice.mybluemix.net:443/api/weather/v1/geocode/${lat}/${lng}/observations/timeseries.json?hours=23`).then(result => {
        let returnData = result.data.observations;
        let tempTotal = 0.0;
        let precipTotal = 0.0;
        let snowTotal = 0.0;
        let precipMeasure = 0.0;
        let city = returnData[0].obs_name;
        let icon = '';
        let phrase = '';
        returnData.forEach((data) => {
            tempTotal += data.feels_like;
            precipTotal += data.precip_hrly;
            icon = data.wx_icon;
            phrase = data.wx_phrase;
            if (data.precip_total) {
                if (data.precip_total > precipMeasure) {
                    precipMeasure = data.precipTotal;
                }
            }
            if (data.snow_hrly) {
                snowTotal += data.snow_hrly;
            }
        });
        res.send({"avg_temp": tempTotal / returnData.length, "avg_snow": snowTotal / returnData.length, "avg_precip": precipTotal / returnData.length, "precip": precipMeasure, "location": city, "icon": icon, "phrase": phrase});
    });
});

app.post('/score', (req, res) => {
    const claim_types = [
        "Material only",
        "Injury only",
        "Material and injury"
    ];
    const incident_causes = [
        "Driver error",
        "Natural causes",
        "Other driver error",
        "Crime",
        "Other causes"
    ];
    let household_id = req.body.household_id;
    let driver_id = req.body.driver_id;
    let policy_id = req.body.policy_id;
    let claim_id = req.body.claim_id || 1234;
    let claim_type = claim_types.indexOf(req.body.claimType) + 1;
    let incident_cause = incident_causes.indexOf(req.body.incidentCause) + 1;
    let description = "";
    let status = "";
    let odometer = req.body.odometer;
    let loss_event_time = req.body.date;
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    let claim_init_time = yyyy + '-' + mm + '-' + dd;

    //TODO: figure out how to calculate days to incident (and what it means)
    let days_to_incident = 419;
    let driver_age = req.body.age;
    let police_report = req.body.policeReport;
    let total_policy_claims = 1;
    let latitude = "";
    let longitude = "";
    let claim_amount = req.body.claim_amount;

    apiGet(wml_credentials.get("url"),
        wml_credentials.get("username"),
        wml_credentials.get("password"),
        function (result) {
            let parsedGetResponse;
            try {
                parsedGetResponse = JSON.parse(this.responseText);
            } catch(ex) {
                // TODO: handle parsing exception
            }
            if (parsedGetResponse && parsedGetResponse.token) {
                const token = parsedGetResponse.token;
                const wmlToken = "Bearer " + token;

                //NOTE: manually define and pass the array(s) of values to be scored in the next line
                const payload = `{"fields": ["household_id", "driver_id", "policy_id", "claim_id", "claim_type", "incident_cause", "description", "status", "odometer", "loss_event_time", "claim_init_time", "days_to_incident", "driver_age", "police_report", "total_policy_claims", "latitude", "longitude", "claim_amount"], "values": [["${household_id}", ${driver_id}, "${policy_id}", ${claim_id}, ${claim_type}, ${incident_cause}, "${description}", "${status}", ${odometer}, "${loss_event_time}", "${claim_init_time}", ${days_to_incident}, ${driver_age}, "${police_report}", ${total_policy_claims}, "${latitude}", "${longitude}", ${claim_amount}]]}`;
                const scoring_url = "https://us-south.ml.cloud.ibm.com/v3/wml_instances/f4116377-7ff0-4717-83bf-1b4cf724fe2a/deployments/f43543f3-f712-460e-9482-51d47a513b61/online";

                apiPost(scoring_url, wmlToken, payload, function (resp) {
                    let parsedPostResponse;
                    try {
                        parsedPostResponse = JSON.parse(this.responseText);
                    } catch (ex) {

                    }
                    res.send(parsedPostResponse);
                }, function (error) {
                    console.log(error);
                });
            } else {
                console.log("Failed to retrieve Bearer token");
            }
        }, function (err) {
            console.log(err);
        });
});

app.get("/files/:filename", function (request, response) {
    let s3config = {
        "key":"qZcgx03IC6fca32yDMZM",
        "secret":"7e4DvF8sRlqTjqjxYLJHGVFSBPpIM3RbF6kfdGvV",
        "bucket":"emartens-test",
        "endpoint":"s3-api.us-geo.objectstorage.softlayer.net"
    };
    let adapter = skipperS3(s3config);
    let readStream = adapter.read(request.params.filename);
    readStream.pipe(response);
});

app.post('/watsonvr', (req, res) => {
    var visualRecognition = new VisualRecognitionV3({
        api_key: 'fb080f8e3f8f54177bfbbf7987b424f044241bd8',
        version_date: '2016-05-20'
    });

    let file = req.body.file;
    let fileStream = fs.createWriteStream(file);
    request(`${req.protocol}://${req.get('host')}/files/${file}`).pipe(fileStream).on('finish', function() {
        var params = {
            images_file: fs.createReadStream(`./${file}`),
            classifier_ids: ["DefaultCustomModel_1891295888"],
            threshold: 0.6
        };

        visualRecognition.classify(params, function(err, result) {
            if (err) {
                fs.unlink(`./${file}`, (err) => {});
                res.send(err);
            } else {
                fs.unlink(`./${file}`, (err) => {});
                let returnClass = result.images[0].classifiers[0].classes[0].class;
                let returnScore = result.images[0].classifiers[0].classes[0].score;
                result.images[0].classifiers[0].classes.forEach((result) => {
                    if (result.score > returnScore) {
                        returnScore = result.score;
                        returnClass = result.class;
                    }
                });
                res.send({class: returnClass, score: returnScore});
            }
        });
    });
});


let port = process.env.PORT || 3000;
app.listen(port, function() {
    let buff = new Buffer(auth.pb.api_key + ":" + auth.pb.secret);
    let basicToken = "Basic " + buff.toString('base64');
    console.log(`PB Hash: ${basicToken}`);
    // let config = {
    //     headers: {
    //         "Authorization":basicToken,
    //         "Access-Control-Allow-Origin": "*"
    //     }
    // };
    //
    // let data = {
    //     "grant_type": "client_credentials"
    // };
    //
    // axios.post("https://api.pitneybowes.com/oauth/token", data, config).then((res) => {
    //     console.log(JSON.stringify(res));
    // }).catch(err => console.log(err));

    console.log(`Server running on http://localhost:${port}`);
});