var express = require('express');

var routes = function(DataStore){
    var datastoreRouter = express.Router();

    datastoreRouter.route('/')
        .post(function(req, res){
            var datastore = new DataStore(req.body);
            datastore.save(function(err){
                if(err){
                    res.status(500).send(err.message);
                }
                else{
                    res.status(201).send(datastore);
                }
            });
        })
        .get(function(req, res){
            var query = {}

            DataStore.find(query, function(err, datastores){
                if(err)
                    res.status(500).send(err)
                else
	                var returnDataStores = [];
                    datastores.forEach(function(element, index, array){
                        var newDataStore = element.toJSON();
                        newDataStore.links = {};
                        newDataStore.links.self = 'http://' + req.headers.host + '/api/datastore/' + newDataStore._id
                        returnDataStores.push(newDataStore);
                    });
                    res.json(returnDataStores);
            });
        });
    datastoreRouter.use('/increment/:datastoreName', function(req, res, next){
        DataStore.find({"name": req.params.datastoreName}, function(err, datastore){
            if(err){
                res.status(500).send(err)
            }
            else if(datastore){
                req.datastore = datastore;
                next();
            }
            else {
                res.status(404).send('No datastore found');
            }

        });
    });
    datastoreRouter.route('/increment/:datastoreName')
        .post(function(req, res){
            DataStore.findOneAndUpdate(
               { "name": req.params.datastoreName },
               { "$inc": req.body },
               { "new": true }, function(err,doc) {
                if(err)
                    res.status(500).send(err)
                else
                    res.json(doc);
        });
    });
    datastoreRouter.use('/:datastoreId', function(req, res, next){
        DataStore.findById(req.params.datastoreId, function(err, datastore){
            if(err){
                res.status(500).send(err)
            }
            else if(datastore){
                req.datastore = datastore;
                next();
            }
            else {
                res.status(404).send('No datastore found');
            }

        });
    });
    datastoreRouter.route('/:datastoreId')
        .get(function(req, res){
            var returnDataStore = req.datastore.toJSON();
            res.json(returnDataStore);
        })
        .put(function(req, res){
            req.datastore.name = req.body.name;
            req.datastore.value = req.body.value;
            req.datastore.save(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.json(req.datastore);
                }
            });
        })
        .delete(function(req, res){
            req.datastore.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    res.status(204).send('Removed');
                }
            });    
        });

    return datastoreRouter; 
};

module.exports = routes;
