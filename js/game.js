var game = {
// Start initializing objects, preloading assets and display start screen
    init: function(){
// Hide all game layers and display the start screen
        levels.init();
        loader.init();
       loader.loadImage('img/icons/level.png');
        $('.gamelayer').hide();
        $('#gamestartscreen').show();
//Get handler for game canvas and context
        game.canvas = $('#gamecanvas')[0];
        game.context = game.canvas.getContext('2d');
    } ,
    showLevelScreen:function(){
        $('.gamelayer').hide();
        $('#levelselectscreen').show(600);
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