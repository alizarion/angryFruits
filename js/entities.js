var entities = {
    definitions : {
        "glass":{
            fullHealth:100,
            density:2.4,
            friction : 0.4,
            restitution :  0.15
        },
        "wood":{
            fullHealth:500,
            density: 0.7,
            friction : 0.4,
            restitution :  0.4
        },
        "dirt":{
            density:3.0,
            friction : 0.4,
            restitution :  0.15
        },
        "burger":{
            shape: "circle",
            fullHealth:40,
            radius :25,
            density:1,
            friction :0.5,
            restitution :0.4
        },
        "sodacan":{
            shape:"rectangle",
            fullHealth:80,
            width :40,
            height:60,
            density:1,
            friction :0.5,
            restitution :0.7
        },
        "fries":{
            shape:"rectangle",
            fullHealth:50,
            width :40,
            height:50,
            density:1,
            friction : 0.5,
            restitution :  0.6
        },
        "apple":{
            shape:"circle",
            radius : 25,
            density:1.5,
            friction : 0.5,
            restitution :  0.4
        },
        "orange":{
            shape:"circle",
            radius : 25,
            density:1.5,
            friction : 0.5,
            restitution :  0.4
        },
        "strawberry":{
            shape:"circle",
            radius:15,
            density:2.0,
            friction:0.5,
            restitution:0.4
        }

    },
    create : function(entity){
        var definition = entities.definitions[entity.name];
        if(!definition){
            // console.log('entitée ',entity.name,' non reconnu');
            return;
        }
        switch (entity.type){
            case "block": // simple block
                entity.health = definition.fullHealth;
                entity.fullHealth = definition.fullHealth;
                entity.shape = "rectangle";
                entity.sprite = loader.loadImage('img/entities/'+entity.name+".png");
                box2d.createRectangle(entity,definition);
                //   console.log('creation d une entité de type :  ', entity.type);
                break;
            case "ground" : // simple rectangle
                //pas besoin de vie ces blocks sont indestructible
                entity.shape = "rectangle";
                box2d.createRectangle(entity,definition);
                //  console.log('creation d une entité de type :  ', entity.type);

                break;
            case "hero" : // simple cercle
                //pas besoin de vie ils sont pour l'instant indestructible
                entity.shape = "circle"
                entity.radius = definition.radius;
                entity.sprite = loader.loadImage('img/entities/'+entity.name+".png");
                box2d.createCircle(entity,definition);
                //   console.log('creation d une entité de type :  ', entity.type);
                break;
            case "villain" : //peut etre cercle ou rectangle
                entity.health = definition.fullHealth;
                entity.fullHealth = definition.fullHealth;
                entity.shape = definition.shape;
                entity.sprite = loader.loadImage('img/entities/'+entity.name+".png");
                if(definition.shape == 'circle'){
                    entity.radius = definition.radius;
                    box2d.createCircle(entity,definition);
                } else {
                    entity.width = definition.width;
                    entity.height = definition.height;
                    box2d.createRectangle(entity,definition);
                }
                //   console.log('creation d une entité de type :  ', entity.type);
                break;
            default :
                // console.log("type inféfinie pour ", entity.type);
                break;
        }
    },
    //dessiner dans le canvas game les entité en fonction de leurs position et angle
    draw: function(entity,position,angle){
        game.context.translate(position.x*box2d.scale-game.offsetLeft,position.y*box2d.scale);
        game.context.rotate(angle);
        switch (entity.type){
            case "block":
                game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,
                    -entity.width/2-1,-entity.height/2-1,entity.width+2,entity.height+2);
                break;
            case "villain":
                if (entity.shape=="circle"){
                    game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,
                        -entity.radius-1,-entity.radius-1,entity.radius*2+2,entity.radius*2+2);
                } else if (entity.shape=="rectangle"){
                    game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,
                        -entity.width/2-1,-entity.height/2-1,entity.width+2,entity.height+2);
                }
                break;
            case "hero":
                if (entity.shape=="circle"){
                    game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,
                        -entity.radius-1,-entity.radius-1,entity.radius*2+2,entity.radius*2+2);
                } else if (entity.shape=="rectangle"){
                    game.context.drawImage(entity.sprite,0,0,entity.sprite.width,entity.sprite.height,
                        -entity.width/2-1,-entity.height/2-1,entity.width+2,entity.height+2);
                }
                break;
            case "ground":
// do nothing... We will draw objects like the ground & slingshot separately
                break;
        }
        game.context.rotate(-angle);
        game.context.translate(-position.x*box2d.scale+game.offsetLeft,-position.y*box2d.scale);

    }
}