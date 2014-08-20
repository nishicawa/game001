// リソース定義
var MAIN_BGM_PATH     = "http://denondo.com/mp3/ACT_filmoa.mp3";  // メインBGM
var CRASH_SE_PATH     = "http://enchantjs.com/assets/sounds/se9.wav";    // クラッシュ時SE

// おまじない
enchant();

window.onload = function () {
    // 初期化
    var core = new Core(320, 320);
    core.preload('chara1.png',CRASH_SE_PATH, MAIN_BGM_PATH);
    core.fps = 30;

    core.onload = function() {
        // スペースキーをAボタンに割り当て
        core.keybind(' '.charCodeAt(0), 'a');

        // 手抜きゲームオーバーシーン
        var gameOverScene = Scene();
        gameOverScene.backgroundColor = 'black'

        // デフォルト背景色
        core.rootScene.backgroundColor = 'SkyBlue';

        // 敵キャラの設定
        var Enemy = Class.create(Sprite,{
            initialize: function(x, y, sp) {
                Sprite.call(this, 32, 32);
                this.x = x;
                this.y = y;
                this.scaleX = -1;
                this.image = core.assets['chara1.png'];
                mx = 10+rand(20);
                my = 15+rand(10);
                this.tl.moveBy(-mx, my, 10).moveBy(-mx, my*-1, 10).loop();
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
        for (var i = 0; i< 10; i++){
            var enemy =  new Enemy(rand(320)+160, rand(320), rand(4));
        }

        // クマの設定
        var bear = new Sprite(32,32);
        bear.image = core.assets['chara1.png'];
        bear.x = 32;
        bear.y = 160;
        bear.frame = 5;
        bear.tl.moveBy(0, 360, 30, enchant.Easing.CUBIC_EASEIN);

        // クマの毎フレームの処理
        bear.on('enterframe', function(){
            // キー操作
            if (core.input.left && this.x > 0 ) this.x -=4;
            if (core.input.right && this.x < 300) this.x +=4;
            if (core.input.a){
                // ジャンプ
                bear.tl.clear();    // 割り込みさせるためにリセット
                bear.tl.moveBy(0, -50, 10, enchant.Easing.CUBIC_EASEOUT)
                       .moveBy(0, 360, 30, enchant.Easing.CUBIC_EASEIN);
            }

            // アニメ
            this.frame = this.age % 3 + 5;

            // 天井の処理上手く作れていない
            if ( this.y <= 0){
                bear.tl.moveBy(0, 500, 30, enchant.Easing.CUBIC_EASEIN);
            }

            // 落下ゲームオーバー
            if ( this.y > 320){
                core.assets[CRASH_SE_PATH].clone().play();
                core.pushScene(gameOverScene);
                core.stop();
            }
        });
        core.rootScene.addChild(bear);

        // スコア
        var label = new Label();
        label.x = 10;
        label.y = 5;
        label.color = 'white';
        label.font = '30px "Arial"';
        label.text = '0';
        label.on('enterframe', function(){
            label.text = (core.frame / core.fps).toFixed(1)*10;
        });
        core.rootScene.addChild(label);

        // BGM再生
        core.assets[MAIN_BGM_PATH].play();
        core.assets[MAIN_BGM_PATH].src.loop = true;
    }
    core.start();

}

function rand(n) {
    return Math.floor(Math.random()* (n+1));
}