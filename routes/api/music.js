const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Compositions = mongoose.model('Compositions');
const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const request = require('request');

router.post('/create', auth.required, (req, res, next) => {
    const authToken = 'dropbox token';
    const dropbox = dropboxV2Api.authenticate({
        token: authToken
    });

    console.log(JSON.stringify(req.fields));

    var fileMeta = req.files['file-input'];
    const name = req.fields['compositionName'];
    const { payload: { id } } = req;
   // const { body: { compos } } = req;

    if(!name) {
        return res.status(422).json({
            errors: {
                compositionName: 'is required',
            },
        });
    }

    const finalCompos = new Compositions();
    const filePath = "/" + uuidv4() + ".mp3";

    const dropboxUploadStream = dropbox({
        resource: 'files/upload',
        parameters: {
            path: filePath
        }
    }, (err, result, response) => {
        if (err) { return console.log('sessionFinish error: ', err) }
        console.log('sessionFinish result:', response);

        finalCompos.setUserId(id);
        finalCompos.setCompositionName(name);

        setPublicLink(filePath, authToken, finalCompos);
    });

    fs.createReadStream(fileMeta.path).pipe(dropboxUploadStream);

    res.sendStatus(200)
});

router.get('/:skip', auth.optional, (req, res, next) => {
    var skip = parseInt(req.params.skip, 10);
    Compositions.find()
    var q = Compositions.find({}).skip(skip).limit(4);
    q.exec(function(err, result) {
        if(err != null) res.sendStatus(400);
        res.json(result);
    });

});

function setPublicLink(path, token, finalCompos) {
    var reqBodyJson = {
        path: path,
        settings: {
            requested_visibility: "public",
            audience: "public",
            access: "viewer"
        }
    };

    request({
        url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
        headers: {
            'content-type' : 'application/json',
            'authorization' : "Bearer "+token
        },
        method: 'POST',
        body: JSON.stringify(reqBodyJson)
    }, (error, response, body) => {
        var resp = JSON.parse(body);
        let url = resp.url;

        url.substring(0, str.length - 4)
        url += "raw=1";

        finalCompos.setUrl(url);
        finalCompos.save();
    });
}

module.exports = router;