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


if (Meteor.isClient) {
    Meteor.startup(function () {
        var colors = ["#1f77b4", "#aec7e8" ,"#ff7f0e","#ffbb78", "#2ca02c"," #98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94" ,"#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22"," #dbdb8d", "#17becf","#9edae5"];
        Session.set("mycolor",colors[Math.floor(Math.random()*colors.length)]);
    });

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
    };


    Template.grid.allgrids = function() {
        Frame.find().fetch().foreach(fuction(z) { Template.grid.gridMaker("sm-grid")});
    };
    

    Template.grid.style = function(id) {
        return Game.find({index:id}).fetch().length ? 'selected' : '';
    }

    Template.grid.color = function(id) {
        return Game.findOne({index:id}) ? Game.findOne({index:id}).color : 'white';
    }

    Template.grid.events({
        'click td' : function(e) {
            var it = e.currentTarget;
            console.log(it.id);
            if(Game.find({index:it.id}).fetch().length) {
                Meteor.call('remove',it.id);
            } else {
                $(it.id).css('backgroundColor', "red");
                console.log(Session.get('mycolor'));
                Game.insert({index:it.id,color:Session.get('mycolor')});
            }            
        },
        'click #clear' : function(e) {
            Meteor.call("clear");
        },
        'click #clearmemory' : function(e) {
            Meteor.call("clearmemory");
        },
        'click #save' : function(e) {
            Meteor.call("save");
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
