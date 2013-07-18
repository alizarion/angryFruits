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