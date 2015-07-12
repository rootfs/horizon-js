var VolumeSnapshot = Backbone.Model.extend({
    
    _action:function(method, options) {
        var model = this;
        if (options == null) options = {};
        options.success = function(resp) {
            model.trigger('sync', model, resp, options);
            if (options.callback!=undefined) {
                options.callback(resp);
            }
        }
        var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
        return xhr;
    },
    
    sync: function(method, model, options) {
    	console.log("method "+method);
        switch(method) {
            case "create": 
            console.log('Creating volume snapshot');
            	JSTACK.Cinder.createsnapshot(model.get("volume_id"), model.get("name"), model.get("description"), options.success);
                break;
            case "delete":
                JSTACK.Cinder.deletesnapshot(model.get("id"), options.success);
                break;
            case "update":
                break;
            case "read":
                JSTACK.Cinder.getsnapshot(model.get("id"), options.success);
                break;
        }
    },
    
    parse: function(resp) {
        if (resp.snapshot != undefined) {
            return resp.snapshot;
        } else {
            return resp;
        }
    }
});


var VolumeSnapshots = Backbone.Collection.extend({
    
    model: VolumeSnapshot,
    
    sync: function(method, model, options) {
        switch(method) {
            case "read":
                JSTACK.Cinder.getsnapshotlist(true, options.success);
                break;
        }
    },
    
    parse: function(resp) {
        return resp.snapshots;
    }
    
});