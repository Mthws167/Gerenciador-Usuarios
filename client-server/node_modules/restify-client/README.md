# restify-client
NodeJS Basic Rest Client - With callbacks. You can Promisify or Synchronize

This client works using the [JSON API Specification](http://jsonapi.org/).

- Success Response: Comes in *data*
- Error Response: Comes inside *errors*

If you want to override the previous automatic configurations, you can set to false this variables:

- return_data_obj
- return_error_msg

This will cause that the response will be the entire body

# Basic Configuration

When you create the client, you can pass the following configurations:

- default_request: Default request to merge with the one sended with post, get, etc...
- host: Host to make the rest call

# Basic Usage

In the next example I am going to create a client. I send a default_request object that is going to be merge with the one sended on POST.

```javascript
var restifyClient = require('restify-client');

var client = new restifyClient({
   host: 'http://www.domain.com/',
   default_request: {
       headers: {
           "Accept": "application/json",
           'content-type': 'application/json'
       }
   }
});

//This is going to generate a GET to www.domain.com/users/1

var request = {
  path: 'users/1'
};

restifyClient.get(request, function(err, response){
    console.log(response);
});

//This is going to generate a POST to www.domain.com/search/ sending a post parameter call name

var request = {
  path: 'search',
  body: {
    name: "Ariel"
  }
};

restifyClient.post(request, function(err, response){
    console.log(response);
});
```
