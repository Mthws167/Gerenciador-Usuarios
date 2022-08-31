var request = require('request'),
    _ = require('lodash');

var correctCodes = [200, 201, 202, 203, 204, 205, 206, 207, 208, 300, 301, 302, 304,
    305, 306, 307, 308],
    errorCodes = [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
    414, 415, 416, 417, 418, 422, 423, 424, 425, 426, 428, 429, 431, 449, 451, 500, 501,
    502, 503, 504, 505, 506, 507, 508, 509, 510, 511];

var restClient = function(configs){
    this.configs = _.merge({}, {
        return_data_obj: true,
        return_error_msg: true
    }, configs);
};

/**
 * Execute post requests
 * @param req
 * @returns {*}
 */
restClient.prototype.post = function(req, callback){
    req.method = 'POST';

    //Stringify the body
    req.body = JSON.stringify(req.body);

    return this.exec(req, callback);
};

/**
 * Execute put requests
 * @param req
 * @param callback
 */
restClient.prototype.put = function(req, callback){
    req.method = 'PUT';

    //Stringify the body
    req.body = JSON.stringify(req.body);

    return this.exec(req, callback);
};

/**
 * Execute patch requests
 * @param req
 * @returns {*}
 */
restClient.prototype.patch = function(req, callback){
    req.method = 'PATCH';

    //Stringify the body
    req.body = JSON.stringify(req.body);

    return this.exec(req, callback);
};

/**
 * Execute get request
 * @param req
 * @returns {*}
 */
restClient.prototype.get = function(req, callback){
    req.method = 'GET';

    return this.exec(req, callback);
};

/**
 * Execute request with the req provided
 * @param req
 * @param callback
 */
restClient.prototype.exec = function(req, callback){
    var me = this;

    req = _.merge({}, this.configs.default_request, req);

    req.uri = this.configs.host + (req.path || '');

    //Execute code depending on method
    if(req.method == 'POST'){
        request.post(req, function(err, response, body){
            me.requestCallback.call(me, err, response, body, callback);
        });
        return;
    }else if(req.method == 'PATCH'){
        request.patch(req, function(err, response, body){
            me.requestCallback.call(me, err, response, body, callback);
        });
        return;
    }else if(req.method == 'PUT'){
        request.put(req, function(err, response, body){
            me.requestCallback.call(me, err, response, body, callback);
        });
        return;
    }

    request.get(req, function(err, response, body){
        me.requestCallback.call(me, err, response, body, callback);
    });
};

restClient.prototype.requestCallback = function(err, response, body, callback){
    if(err){
        callback.apply(null, [err, null]);
        return;
    }

    if(callback !== 'undefined' && typeof callback == 'function'){
        try{
            var data = this.getResponse(response);
        }catch(error){
            callback.apply(null, [(this.configs.return_error_msg) ? error.message : JSON.parse(error.message), null]);
            return;
        }

        callback.apply(null, [null, data]);

        return;
    }
};

/**
 * Get the body inside the response
 * @param httpResponse
 * @returns {{}}
 */
restClient.prototype.getResponseBody = function(httpResponse){
    return JSON.parse(httpResponse.body);
};

/**
 * Get the data tag from the http response
 * @param httpResponse
 * @returns {*}
 */
restClient.prototype.getResponse = function(httpResponse){
    if(!httpResponse){
        throw new Error('No response');
    }

    var body = (_.isEmpty(httpResponse.body)) ? {} : this.getResponseBody(httpResponse);

    if( httpResponse.statusCode && correctCodes.indexOf(httpResponse.statusCode) != -1 ){
        if( this.configs.return_data_obj ){
            return (_.isEmpty(body.data)) ? {} : body.data;
        }else{
            return body;
        }
    }else{
        throw new Error(JSON.stringify(body));
    }
};

/**
 * Add param to body
 * @param body
 * @param paramName
 * @param param
 */
restClient.prototype.addParamToBody = function(body, paramName, param){
    if(!(param === undefined || param === null)) {
        body[paramName] = param;
    }
};

/**
 * Add value to path
 * @param path
 * @param value
 * @returns string
 */
restClient.prototype.addToPath = function(path, value){
    if(!(value === undefined || value === null)) {
        path = path + '/' + value;
    }

    return path;
};

module.exports = restClient;