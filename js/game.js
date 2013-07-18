var timeStep = 1/60;
var velocityIterations = 8;
var positionIterations = 3;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] ||
                window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var game = {
// Start initializing objects, preloading assets and display start screen
    init: function(){
// Hide all game layers and display the start screen
        levels.init();
        loader.init();

        $('.gamelayer').hide();
        $('#gamestartscreen').show();
//Get handler for game canvas and context
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
        mouse.init();
    } ,
    showLevelScreen:function(){
        $('.gamelayer').hide();
        $('#levelselectscreen').show(600);
    },
    mode:"intro",
    //coordonnée xy du lance pierre
    slingshotX : 140,
    slingshotY : 280,
    start :function(){
        $('.gamelayer').hide();
        //afficher le jeu et le score
        $('#gamecanvas').show();
        $('#scorescreen').show();
        game.mode = "intro";
        game.offsetLeft=0;
        game.ended = false;
        game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);


    },
    handlePanning:function(){

        if(game.mode=="intro") {
            if(game.panTo(700)){

                game.mode = "load-next-hero";
            }
        }
        if(game.mode=="wait-for-firing"){
            //    console.log("wait-for-firing");
            if(mouse.dragging){
                game.panTo(mouse.x+game.offsetLeft);
            } else {
                game.panTo(game.slingshotX);
            }

        }
        if(game.mode =="load-next-hero"){
            //TODO verifier si le vilain est vivant sinon lvl success
            //verifier s'il reste des heros vivant sinon niveau perdu
            // console.log("load-next-hero");
            game.mode="wait-for-firing";
        }
        if(game.mode=="firing"){
            game.panTo(game.slingshotX);
        }
        if(game.mode == "fired"){
            //TODO:
            // suivre le hero
        }
    },
    animate:function() {
        //animer l'arriere plan

        game.handlePanning();
        //animer les personnages
        var currentTime = new Date().getTime();
        var timeStep;
        if(game.lastUpdatedTime){
            timeStep = (currentTime- game.lastUpdatedTime) /1000;
            box2d.step(timeStep);
        }
        game.lastUpdatedTime =currentTime;

        //dessiner l'arriere plan en parallax scrolling
        game.context.drawImage(game.currentLevel.backgroundImage,game.offsetLeft/4,0,640,480,0,0,640,480);
        game.context.drawImage(game.currentLevel.foregroundImage,game.offsetLeft,0,640,480,0,0,640,480);
        //dessiner le lance pierre
        game.context.drawImage(game.slingshotImage,game.slingshotX-game.offsetLeft,game.slingshotY);
        game.context.drawImage(game.slingshotFrontImage,game.slingshotX-game.offsetLeft,game.slingshotY);
        // Draw all the bodies
        game.drawAllBodies();
        if(!game.ended){
            game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
        }

    },
    drawAllBodies:function(){

        box2d.world.DrawDebugData();
        //intérer sur les corp et les dessiner
        for(var body = box2d.world.GetBodyList();body; body = body.GetNext()){
            var entity = body.GetUserData();
            if(entity){
                entities.draw(entity,body.GetPosition(),body.GetAngle());
            }
        }


    } ,
    maxSpeed:3,
    //min and max offset
    minOffset:0,
    maxOffset:300,
    offsetLeft:0,
    score:0,
    panTo:function(newCenter){

        if(Math.abs(newCenter-game.offsetLeft-game.canvas.width/4)>0 &&
            game.offsetLeft <= game.maxOffset &&
            game.offsetLeft >= game.minOffset){
            var deltaX = Math.round((newCenter-game.offsetLeft-game.canvas.width/4)/2);
            if (deltaX && Math.abs(deltaX) > game.maxSpeed){
                deltaX = game.maxSpeed*Math.abs(deltaX)/(deltaX);
            }
            game.offsetLeft += deltaX;
        } else {


            return true;
        }
        if (game.offsetLeft < game.minOffset){
            game.offsetLeft = game.minOffset;


            return true;
        } else if (game.offsetLeft > game.maxOffset){
            game.offsetLeft = game.maxOffset;


            return true;
        }

        return false;
    },
    countHeroesAndVillains: function(){
        game.heroes = [];
        game.villains = [];
        for(var body = box2d.world.GetBodyList();body ; body = body.GetNext()){
            var entity = body.GetUserData();
            if(entity){
                if(entity.type == "hero"){
                    game.heroes.push(body);
                } else if (entity.type == "villain") {
                    game.villains.push(body);
                }
            }
        }
    },
    handlePanning:function(){

        if(game.mode =="intro"){
            if(game.panTo(700)){
                game.mode = "load-next-hero";
            }
        }
        console.log(game.mode) ;
        if(game.mode =='wait-for-firing'){
            if(mouse.dragging){
                if(game.mouseOnCurrentHero()){
                    game.mode = "firing";
                } else {
                    game.panTo(mouse.x + game.offsetLeft);
                }
            } else {
                game.panTo(game.slingshotX);
            }

            game.panTo(game.slingshotX);
        }
        if(game.mode == 'firing'){
           if(mouse.down){
               game.panTo(game.slingshotX);
               game.currentHero.SetPosition({x:(mouse.x+game.offsetLeft)/box2d.scale,y:(mouse.y/box2d.scale)});
           }  else {
               game.mode = "fired";
               var impulseScaleFactor = 0.75 ;
               var impulse = new b2Vec2((game.slingshotX+35-mouse.x-game.offsetLeft)*impulseScaleFactor,
                   (game.slingshotY+25-mouse.y)*impulseScaleFactor);
               game.currentHero.ApplyImpulse(impulse,game.currentHero.GetWorldCenter());
           }

        }
        if(game.mode =='fired'){
            //TODO:
            //Suivre le hero
            var HeroX = game.currentHero.GetPosition().x*box2d.scale;
            game.panTo(HeroX);
            //
            if(!game.currentHero.IsAwake()|| HeroX <0 || HeroX> game.currentLevel.width){
               box2d.world.DestroyBody(game.currentHero);
               game.currentHero = undefined;
                game.mode = "load-next-hero";
            }

        }
        if(game.mode =='load-next-hero'){
            game.countHeroesAndVillains();
            //verifier si il reste des villains vivant sinon le joueur gagne le stage
            if(game.villains.length == 0){
                game.mode = "level-success";
                return;
            }
            //si plus de heros echec de la partie
            if(game.heroes.length ==0){
                game.mode = "level-failure";
                return;
            }
            //charger le hero suivant et passer le jeu en mode wait-for-firing
            if(!game.currentHero){
                game.currentHero = game.heroes[game.heroes.length-1];
                game.currentHero.SetPosition({x:180/box2d.scale,y:200/box2d.scale});
                game.currentHero.SetLinearVelocity({x:0,y:0});
                game.currentHero.SetAngularVelocity(0);
                game.currentHero.SetAwake(true);
            }  else {
                game.panTo(game.slingshotX);
                if(!game.currentHero.IsAwake()){
                    game.mode = "wait-for-firing";
                }
            }

        }

    },
    mouseOnCurrentHero: function(){
        if(!game.currentHero){
            return false;
        }
        var position = game.currentHero.GetPosition();
        var distanceSquared = Math.pow(position.x*box2d.scale - mouse.x-game.offsetLeft,2) +
            Math.pow(position.y*box2d.scale-mouse.y,2);
        var radiusSquared = Math.pow(game.currentHero.GetUserData().radius,2);
        return (distanceSquared<= radiusSquared);
    }

}

$(window).load(function() {
    game.init();
});