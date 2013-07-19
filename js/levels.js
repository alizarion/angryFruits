var levels = {
// Level data
    data:[
        { // First level
            foreground:'desert-foreground',
            background:'clouds-background',
            entities:[{type:"ground", name:"dirt", x:500,y:440,width:1000,height:20,isStatic:true},
                {type:"ground", name:"wood", x:180,y:390,width:40,height:80,isStatic:true},
                {type:"block", name:"wood", x:520,y:375,angle:90,width:100,height:25},
                {type:"block", name:"glass", x:520,y:275,angle:90,width:100,height:25},
                {type:"villain", name:"burger",x:520,y:200,calories:590},
                {type:"block", name:"wood", x:620,y:375,angle:90,width:100,height:25},
                {type:"block", name:"glass", x:620,y:275,angle:90,width:100,height:25},
                {type:"villain", name:"fries", x:620,y:200,calories:420},
                {type:"hero", name:"orange",x:90,y:400},
                {type:"hero", name:"apple",x:150,y:400}]

        },
        { // Second level
            foreground:'desert-foreground',
            background:'clouds-background',
            entities:[{type:"ground", name:"dirt", x:500,y:440,width:1000,height:20,isStatic:true},
                {type:"ground", name:"wood", x:180,y:390,width:40,height:80,isStatic:true},
                {type:"block", name:"wood", x:520,y:375,angle:90,width:100,height:25},
                {type:"block", name:"glass", x:520,y:275,angle:90,width:100,height:25},
                {type:"villain", name:"burger",x:520,y:150,calories:590},
                {type:"block", name:"wood", x:620,y:375,angle:90,width:100,height:25},
                {type:"block", name:"glass", x:620,y:275,angle:90,width:100,height:25},
                {type:"villain", name:"fries", x:620,y:150,calories:420},
                {type:"hero", name:"orange",x:90,y:400},
                {type:"hero", name:"apple",x:150,y:400}]
        }
    ],
// Initialize level selection screen
    init:function(){
        var html = "";
        for (var i = 0; i < levels.data.length; i++) {
            var level = levels.data[i];
            html += ' <input type="button" value="'+(i + 1)+'">';
        };
        $('#levelselectscreen').html(html);
// Set the button click event handlers to load level
        $('#levelselectscreen input').click(function(){
            levels.load(this.value-1);
            $('#levelselectscreen').hide();
        });
    },
// Load all data and images for a specific level
    load:function(number){
        box2d.init();
        console.log('level ' ,number);
        //declare new current level
        game.currentLevel = {number: number, hero:[]};
        game.score = 0;
        $('#score').html('Score : '+game.score);
        var level = levels.data[number];
        // chargement des images du level
        game.currentLevel.backgroundImage =  loader.loadImage("img/backgrounds/"+level.background+".png");
        game.currentLevel.foregroundImage =  loader.loadImage("img/backgrounds/"+level.foreground+".png");
        //fronde .. lasstack
        game.slingshotImage = loader.loadImage("img/slingshot.png");
        game.slingshotFrontImage = loader.loadImage("img/slingshot-front.png");
        //charger les entitées du niveau
        for (var i = level.entities.length-1; i >= 0; i--){
            var entity = level.entities[i];
            entities.create(entity);
        };


        //lancer le jeu quand le chargement est términé
        if(loader.loaded){
            game.start();
        }
        else{
            loader.onload = game.start;
        }

    }
}