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

var mouse = {
    x:0,
    y:0,
    down:false,
    init:function(){
        $("#gamecanvas").mousemove(mouse.mousemovehandler);
        $('#gamecanvas').mousedown(mouse.mousedownhandler);
        $('#gamecanvas').mouseup(mouse.mouseuphandler);
        $('#gamecanvas').mouseout(mouse.mouseuphandler);
    },
    mousemovehandler:function(ev){
        var offset = $('#gamecanvas').offset();
        mouse.x = ev.pageX - offset.left;
        mouse.y = ev.pageY - offset.top;
        if(mouse.down){
            mouse.dragging = true;
            // console.log('mouse x = '+mouse.x + ', mouse y = '+ mouse.y+' dragging = ' + mouse.dragging );
        }

    },
    mousedownhandler:function(ev){
        mouse.down = true;
        mouse.downX = mouse.x;
        mouse.downY = mouse.y;
        //on annule l'action provoqué par l'evenement par defaut
        ev.originalEvent.preventDefault();
    },
    mouseuphandler: function(ev){
        mouse.down = false ;
        mouse.dragging = false;
    }

}

var game = {
// Start initializing objects, preloading assets and display start screen
    init: function(){
// Hide all game layers and display the start screen
        levels.init();
        loader.init();
        mouse.init();
        $('.gamelayer').hide();
        $('#gamestartscreen').show();
//Get handler for game canvas and context
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
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
            console.log("wait-for-firing");
            if(mouse.dragging){
                game.panTo(mouse.x+game.offsetLeft);
            } else {
                game.panTo(game.slingshotX);
            }

        }
        if(game.mode =="load-next-hero"){
            //TODO verifier si le vilain est vivant sinon lvl success
            //verifier s'il reste des heros vivant sinon niveau perdu
            console.log("load-next-hero");
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
        //dessiner l'arriere plan en parallax scrolling
        game.context.drawImage(game.currentLevel.backgroundImage,game.offsetLeft/4,0,640,480,0,0,640,480);
        game.context.drawImage(game.currentLevel.foregroundImage,game.offsetLeft,0,640,480,0,0,640,480);
        //dessiner le lance pierre
        game.context.drawImage(game.slingshotImage,game.slingshotX-game.offsetLeft,game.slingshotY);
        game.context.drawImage(game.slingshotFrontImage,game.slingshotX-game.offsetLeft,game.slingshotY);

        if(!game.ended){
            game.animationFrame = window.requestAnimationFrame(game.animate,game.canvas);
        }
    },
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
    }

}

var levels = {
// Level data
    data:[
        { // First level
            foreground:'desert-foreground',
            background:'clouds-background',
            entities:[]
        },
        { // Second level
            foreground:'desert-foreground',
            background:'clouds-background',
            entities:[]
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

        //declare new current level
        game.currentLevel = {number: number, hero:[]};
        game.score = 0;
        $('#score').html('Score '+game.score);
        var level = levels.data[number];
        // chargement des images du level
        game.currentLevel.backgroundImage =  loader.loadImage("img/backgrounds/"+level.background+".png");
        game.currentLevel.foregroundImage =  loader.loadImage("img/backgrounds/"+level.foreground+".png");
        //fronde .. lasstack
        game.slingshotImage = loader.loadImage("img/slingshot.png");
        game.slingshotFrontImage = loader.loadImage("img/slingshot-front.png");

        //lancer le jeu quand le chargement est términé
        if(loader.loaded){
            game.start();
        }
        else{
            loader.onload = game.start;
        }

    }
}

var loader={
    loaded : true,
    loadedCount:0,
    totalCount:0,

    init:function(){
        var mp3Support,oggSupport;
        var audio = document.createElement('audio');

        if(audio.canPlayType){
            mp3Support = '' != audio.canPlayType('audio/mpeg');
            oggSupport = '' != audio.canPlayType("audio/ogg; codecs='vorbis'");
        } else {
            mp3Support = false;
            oggSupport = false;
        }

        loader.soundFileExtn = mp3Support ? '.mp3' : oggSupport ?'ogg':undefined;
    },
    loadImage:function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();

        var  image = new Image();
        image.src = url;
        console.log(image.src) ;
        image.onload=loader.itemLoaded;
        return image;
    },
    soundFileExtn:".mp3",
    loadSound:function(url){
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var audio = new Audio();
        audio.src = url + loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.itemLoaded,false);
        return audio;
    },
    itemLoaded:function(){

        loader.loadedCount++;
        console.log(loader.loadedCount);
        $('#loadingmessage').html('Loaded'+loader.loadedCount+' of '+ loader.totalCount);
        console.log('hey') ;
        if(loader.loadedCount == loader.totalCount){
            //loader has loaded completely
            loader.loaded = true;
            // cacher la barre de lancement
            $('#loadingscreen').hide('slow');
            if(loader.onload){
                loader.onload();
                loader.onload = undefined;

            }
        }
    }

}

$(window).load(function() {
    game.init();
});