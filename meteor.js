Game = new Meteor.Collection('game');
Game.allow({
    insert: function (userId, z) {
        return true;
    },
    remove: function (userId, z) {
	return true;
    },
    update: function (userId, z) {
	return true;
    }
});
Frame = new Meteor.Collection('frame');
Frame.allow({
    insert: function (userId, z) {
        return true;
    },
    remove: function (userId, z) {
	return true;
    },
    update: function (userId, z) {
	return true;
    }
});
Frame2 = new Meteor.Collection('frame2');
Frame2.allow({
    insert: function (userId, z) {
        return true;
    },
    remove: function (userId, z) {
	return true;
    },
    update: function (userId, z) {
	return true;
    }
});


if (Meteor.isClient) {
    Meteor.startup(function () {
        var colors = ["#1f77b4", "#aec7e8" ,"#ff7f0e","#ffbb78", "#2ca02c"," #98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94" ,"#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22"," #dbdb8d", "#17becf","#9edae5"];
        Session.set("mycolor",colors[Math.floor(Math.random()*colors.length)]);
        Meteor.call('clearframe2');
        Session.set('showallgrid',false);
    });

    Template.grid.showall = function() {
        return Session.get('showallgrid');
    }

    Template.grid.gridMaker = function (a,b,classname) {
        var grid = "<table class='"+classname+"'>";
        for (var i = 0; i< a; i++) {
            grid += "<tr>";
            for (var j=0; j<b; j++)
            {
                var id = i+"-"+j;
                grid += "<td id='"+id+"' class='"+Template.grid.style(id)+"' style='background-color:"+Template.grid.color(id)+"'></td>"
            }
            grid += "</tr>";
        }
        return grid += "</table>";
    }

    Template.grid.gridMaker2 = function (a,b,classname) {
        var grid = "<table class='"+classname+"'>";
        for (var i = 0; i< a; i++) {
            grid += "<tr>";
            for (var j=0; j<b; j++)
            {
                var id = i+"-"+j;
                grid += "<td id='"+id+"' class='"+Template.grid.style(id)+"' style='background-color:"+Template.grid.color2(id)+"'></td>"
            }
            grid += "</tr>";
        }
        return grid += "</table>";
    }


    Template.grid.allgrids = function() {
        str = "";
        Frame.find({},{$sort:{time:-1}}).fetch().forEach(function(z) { str += z.index; });
        return str;
    };
    

    Template.grid.style = function(id) {
        return Game.find({index:id}).fetch().length ? 'selected' : '';
    }

    Template.grid.color = function(id) {
        return Game.findOne({index:id}) ? Game.findOne({index:id}).color : 'white';
    }
    Template.grid.color2 = function(id) {
        return (f = Frame2.findOne({index:id},{sort:{time:-1}})) ? f.color : 'white';
    }

    var handle = null;
    Template.grid.events({
        'click .grid td' : function(e) {
            var it = e.currentTarget;
            var time = new Date().getTime();
            if(Game.find({index:it.id}).fetch().length) {
                Meteor.call('remove',it.id);
                Frame.insert({index:it.id,color:'#fff',time:time});
            } else {
                Game.insert({index:it.id,color:Session.get('mycolor'),time:time});
                Frame.insert({index:it.id,color:Session.get('mycolor'),time:time});
            }            
        },
        'click #clear' : function(e) {
            Meteor.call("clear");
        },
        'click #clearmemory' : function(e) {
            Meteor.call("clearframe2");
        },
        'click #save' : function(e) {
            Meteor.call("save");
        },
        'click #stop' : function(e) {
            Session.set('showallgrid',false);
        },
        'click #play' : function(e) {
            Session.set('showallgrid',true);
            Meteor.call("clearframe2");
            if (handle) {
                console.log(handle);
                Meteor.clearInterval(handle);
            }
            var frames = Frame.find({},{$sort:{time:-1}}).fetch()
            var i = 0;
            handle = Meteor.setInterval(
                function(){             
                    if(i == frames.length) {
                        Meteor.call("clearframe2");
                        i = 0; 
                    }                  
                    
                    console.log(frames[i].index+" "+i+" "+frames.length);
                    Frame2.insert(frames[i]);
                    i++;
                }
                , 100);
            
        }

    });
    
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
   
    Meteor.methods({
        'clear' : function() {
            Game.remove({});
        },
        'clearframe2' : function() {
            Frame2.remove({});
        },
        'remove' : function(id) {
            Game.remove({index:id});
        
        },
        'save' : function() {
            Frame.insert(Game.find({}).fetch());            
        },
        'clearmemory' : function() {
            Frame.remove({});            
        }
    });
}
