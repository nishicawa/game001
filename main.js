var MAIN_BGM_PATH     = "http://enchantjs.com/assets/sounds/bgm01.wav";  // メインBGM
var CRASH_SE_PATH     = "http://enchantjs.com/assets/sounds/se9.wav";    // クラッシュ時SE
enchant();
window.onload = function () {

    var core = new Core(320, 320);
    core.preload('chara1.png',CRASH_SE_PATH, MAIN_BGM_PATH);
    core.fps = 30;
    core.onload = function() {
        var Enemy = Class.create(Sprite,{
            initialize: function(x, y, sp) {
                Sprite.call(this, 32, 32);
                this.x = x;
                this.y = y;
                this.sp = sp;
                this.image = core.assets['chara1.png'];
                this.tl.moveBy(30, 10, 10).moveBy(-30, 10, 10).moveBy(30, 10, 10).moveBy(-15, 10, 10).moveBy(0, 100, 10).loop();
                this.on('enterframe', function(){
                    this.frame = this.age % 3;
                    if( this.within(bear,20)) {
                        core.assets[CRASH_SE_PATH].clone().play();
                        core.pushScene(gameOverScene);
                        core.stop();
                    }
                    if ( this.x < 0){
                        this.x = 320;
                    }
                });
                core.rootScene.addChild(this);
            }
        })
        var enemys = [];
        for (var i = 0; i< 30; i++){
            var enemy =  new Enemy(rand(320), rand(320), rand(4));
        }

        var bear = new Sprite(32,32);
        bear.image = core.assets['chara1.png'];
        bear.x = 0;
        bear.y = 160;
        bear.frame = 5;

        bear.on('enterframe', function(){
            if (core.input.left) this.x -=4;
            if (core.input.right) this.x +=4;
            if (core.input.up) this.y -=4;
            if (core.input.down) this.y +=4;
            // this.x += 8;
            this.frame = this.age % 3 + 5;

            // if ( this.x > 320){
            //     this.x = 0;
            //     this.scaleX = 1.0;
            //     this.scaleY = 1.0;

            // }
            // this.rotate(36);
            // this.scale(1.05,1.05);
        });

        bear.on('touchstart', function(){
            core.rootScene.removeChild(this);
        });

        core.rootScene.on('touchstart', function(e){
            bear.x = e.x;
            bear.y = e.y;
        });

        var gameOverScene = Scene();
        gameOverScene.backgroundColor = 'black'

        var label = new Label();
        label.x = 290;
        label.y = 5;
        label.color = 'red';
        label.font = '14px "Arial"';
        label.text = '0';
        label.on('enterframe', function(){
            label.text = (core.frame / core.fps).toFixed(2);
        });

        core.rootScene.addChild(label);
        core.rootScene.addChild(bear);
        core.assets[MAIN_BGM_PATH].play();

    }
    core.start();

}

function rand(n) {
    return Math.floor(Math.random()* (n+1));
}