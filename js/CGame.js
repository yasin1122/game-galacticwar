function CGame(oData){
    var _bStartGame = false;
    var _bKeyDown = false;
    var _iScore;
    var _iTimeElaps;
    var _iCurFallObjIndex;
    var _iCurBulletIndex;
    var _iFallingSpeed;
    var _iLives;
    var _iBulletsToRemove = -1;
    var _aLineObjectFall;
    var _aEnemies;
    var _aBulletsPlayer;
    var _aBulletsEnemy = new Array();
    var _oParallax1;
    var _oParallax2;
    var _oHero;
    var _oHurt;
    var _oBulletContainer;
    
    var _oInterface;
    var _oEndPanel = null;
    
    this._init = function(){
        _iScore = 0;
        
        _oParallax1 = new CScrollingMultipleBg([s_oSpriteLibrary.getSprite('parallax_1_1'),
                                                s_oSpriteLibrary.getSprite('parallax_1_2'),
                                                s_oSpriteLibrary.getSprite('parallax_1_3')]);
        _oParallax2 = new CScrollingBg(s_oSpriteLibrary.getSprite('parallax_2'));
        
        var oSprite = s_oSpriteLibrary.getSprite('hero');
        _oHero = new CHero(HERO_START_X,CANVAS_HEIGHT - 200 ,oSprite);

        //CREATE OBJECT FALL COLUMNS
        _aLineObjectFall = new Array();
        var iX = EDGEBOARD_X + 50;
        do{
            _aLineObjectFall.push(iX);
            iX += 100;         
        }while(iX < (CANVAS_WIDTH-50-EDGEBOARD_X));
        
        _iLives = NUM_LIVES;
        
        _oBulletContainer = new createjs.Container();
        s_oStage.addChild(_oBulletContainer);
        
        this._initFallingObj();
        this._initBullets();
        
        _oHurt = new createjs.Shape();
        _oHurt.graphics.beginFill("red").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHurt.alpha = 0.1;
        _oHurt.visible =  false;
        
        s_oStage.addChild(_oHurt);
        
        _oInterface = new CInterface();
        
        if(s_bMobile === false){
            document.onkeydown   = onKeyDown; 
            document.onkeyup   = onKeyUp; 
        }
    };
    
    this.unload = function(){
        _bStartGame = false;
        
        s_oStage.removeAllChildren();
        _oHero.unload();
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }

        for(var i=0;i<_aEnemies.length;i++){
            _aEnemies[i].unload();
        }
        
        for(var j=0;j<_aBulletsPlayer.length;j++){
            _aBulletsPlayer[j].unload();
        }
        
        for(var k=0;k<_aBulletsEnemy.length;k++){
            _aBulletsEnemy[k].unload();
        }
    };
    
    function onKeyUp(evt) { 
        if(_bStartGame === false){
            return;
        }
        
        _bKeyDown = false;
        
        //SPACEBAR
        if(evt.keyCode === 32){
            s_oGame.onShot();
        }else{
            _oHero.stop();
        }
        
    }
	
    function onKeyDown(evt) { 
        if ( _bStartGame === false || _bKeyDown){
            evt.preventDefault();
            return false;
        }
        
        if(!evt){ 
            evt = window.event; 
        }  

        switch(evt.keyCode) {  
           // left  
           case 37: {
                   _bKeyDown = true;
                   s_oGame.onLeft();
                   break; 
               }
                              
           // right  
           case 39: {
                   _bKeyDown = true;
                   s_oGame.onRight();
                   break; 
               }
        }  
        
        evt.preventDefault();
        return false;
    }
    
    this._initFallingObj = function(){
        _iCurFallObjIndex = 0;
        _iFallingSpeed = SPEED_FALLING_OBJ;
        
        _aEnemies = new Array();
        for(var i=0;i<10;i++){
            _aEnemies[i] = new CEnemy(START_Y_FALLING_OBJ,_oBulletContainer);
        }
    };
    
    this._initBullets = function(){
        _iCurBulletIndex = 0;
        _aBulletsPlayer = new Array();
        
        for(var i=0;i<50;i++){
            _aBulletsPlayer[i] = new CBullet1(_oBulletContainer,"bullet2",true);
        }
    };
    
    this._showNextObj = function(){
        var iRandX = Math.floor(Math.random() * _aLineObjectFall.length);
        var iRandType = Math.floor(Math.random() * NUM_FALLING_OBJ) +1;
        
        _aEnemies[_iCurFallObjIndex].show(_aLineObjectFall[iRandX],_iFallingSpeed,iRandType);

        if(_iCurFallObjIndex ===  (_aEnemies.length-1) ){
            _iCurFallObjIndex = 0;
            if(_iFallingSpeed <= MAX_SPEED_FALLING_OBJ){
                _iFallingSpeed += 1;

                if(_iFallingSpeed<6){
                    TIME_OCCURENCE_FALLING_OBJ = 2000;
                }else if(_iFallingSpeed<7){
                    TIME_OCCURENCE_FALLING_OBJ = 1700;
                }else if(_iFallingSpeed<10){
                    TIME_OCCURENCE_FALLING_OBJ = 1500;
                }else if(_iFallingSpeed<15){
                    TIME_OCCURENCE_FALLING_OBJ = 1000;
                }else{
                    TIME_OCCURENCE_FALLING_OBJ = 700;
                }
            }
        }else{
            _iCurFallObjIndex++;
        }

    };
    
    this.addEnemyBullets = function(oBullet){
        _aBulletsEnemy.push(oBullet);
    };
    
    this.removeBullet = function(oBullet){
        for(var i=0;i<_aBulletsEnemy.length;i++){
            if(_aBulletsEnemy[i] === oBullet){
                _iBulletsToRemove = i;
            }
        }
    };
    
    this._lostLife = function(){
        _oHurt.visible = true;
        var oParent = this;
        
        createjs.Tween.get(_oHurt).to({alpha:0.6 }, 400).call(function() {oParent._resetHurt();});
        
        _oHero.hurt();
        _iLives--;
        _oInterface.refreshLives(_iLives);
        if(_iLives === 0){
            _bStartGame = false;
            _oHero.gameOver();
        }
    };

    this.gameOver = function(){  
        $(s_oMain).trigger("end_level",1);
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore);
    };
    
    this.checkCollision = function(oFallObj){
        //CHECK COLLISION BETWEEN HERO AND ENEMIES
        if (_oHero.isHurting() === false &&  checkRectCollision(oFallObj.getSprite(),_oHero.getSprite())) {
            oFallObj.reset();
            this._lostLife();
        }
    };
    
    this._checkBulletPlayerCollision = function(oBullet){
        if(oBullet.isUpdating() === false){
            return;
        }
        
        var aBulletPos  = oBullet.getPos();
        
        for(var k=0;k<aBulletPos.length;k++){
            var vBulletPos = aBulletPos[k];
            //CHECK COLLISSION AMONG PLAYER BULLETS AND ENEMIES
            for(var i=0;i<_aEnemies.length;i++){
                if(_aEnemies[i].isMoving()){
                    var vObstaclePos    = _aEnemies[i].getPos();
                    var fObstacleRadius = _aEnemies[i].getRadius();

                    var fDistance =  Math.sqrt( ( (vObstaclePos.x - vBulletPos.x)*(vObstaclePos.x - vBulletPos.x) ) + 
                                        ( (vObstaclePos.y - vBulletPos.y)*(vObstaclePos.y - vBulletPos.y) ) );

                    if (fDistance < fObstacleRadius ){
                        _aEnemies[i].reset();
                        oBullet.reset(k);
                        _iScore += SCORE_HIT;
                        _oInterface.refreshScore(_iScore);
                        break;
                    }
                }
            }
            
            //CHECK COLLISSION AMONG PLAYER BULLETS AND ENEMY BULLETS
            for(var j=0;j<_aBulletsEnemy.length;j++){
                var aBulletEnemyPos  = _aBulletsEnemy[j].getPos();
                
                for(var t=0;t<aBulletEnemyPos.length;t++){
                    var vBulletEnemyPos = aBulletEnemyPos[t];
                    var fBulletPlayerRadius = _oHero.getRadius();

                    var fDistance =  Math.sqrt( ( (vBulletPos.x - vBulletEnemyPos.x)*(vBulletPos.x - vBulletEnemyPos.x) ) + 
                                        ( (vBulletPos.y - vBulletEnemyPos.y)*(vBulletPos.y - vBulletEnemyPos.y) ) );

                    if (fDistance < fBulletPlayerRadius ){
                        _aBulletsEnemy[j].reset(t);
                        oBullet.reset(k);
                        break;
                    }
                }
            }
            
        }
        
        
    };
    
    this.checkBulletEnemyCollision = function(oBullet){
        var aBulletPos  = oBullet.getPos();
        //CHECK COLLISSION AMONG ENEMY BULLETS AND PLAYER
         for(var k=0;k<aBulletPos.length;k++){
            var vBulletPos = aBulletPos[k];
            
            var vHeroPos    = _oHero.getPos();
            var fHeroRadius = _oHero.getRadius();

            var fDistance =  Math.sqrt( ( (vHeroPos.x - vBulletPos.x)*(vHeroPos.x - vBulletPos.x) ) + 
                                ( (vHeroPos.y - vBulletPos.y)*(vHeroPos.y - vBulletPos.y) ) );

            if (fDistance < fHeroRadius ){
                this._lostLife();
                oBullet.reset(k);
                break;
            }

         }
    };
    
    this._resetHurt = function(){
        _oHurt.visible = false;
        _oHurt.alpha = 0.5;
    };
    
    this.onLeft = function(){
        _oHero.moveLeft();
    };

    this.onRight = function(){
        _oHero.moveRight();
    };
    
    this.onShot = function(){
        var pStartPoint = _oHero.getBulletStartPoint();
        _aBulletsPlayer[_iCurBulletIndex].show(pStartPoint.x,pStartPoint.y,8);

        if(_iCurBulletIndex ===  (_aBulletsPlayer.length-1) ){
            _iCurBulletIndex = 0;
        }else{
            _iCurBulletIndex++;
        }
    };
    
    this.onKeyReleased = function(){
        _oHero.stop();
    };

    this.onExit = function(){
        this.unload();
        
        $(s_oMain).trigger("share_event",_iScore);
        $(s_oMain).trigger("end_session");
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function(){
        _oInterface.onExitFromHelp();
        
        _iTimeElaps = TIME_OCCURENCE_FALLING_OBJ;
        _bStartGame = true;
        
        $(s_oMain).trigger("start_level",1);
    };
    
    this._updateParallaxes = function(){
        _oParallax1.update(PARALLAX1_SPEED);
        _oParallax2.update(PARALLAX2_SPEED);
    };
    
    this.update = function(){
        if(_bStartGame){   
            _iTimeElaps +=s_iTimeElaps;
            if(_iTimeElaps > TIME_OCCURENCE_FALLING_OBJ){
                _iTimeElaps = 0;
                this._showNextObj();
            }
            
            _oHero.update();
            for(var i=0;i<_aEnemies.length;i++){
                _aEnemies[i].update();
            }  
            
            for(var j=0;j<_aBulletsPlayer.length;j++){
                _aBulletsPlayer[j].update();
                this._checkBulletPlayerCollision(_aBulletsPlayer[j]);
            }
            
            for(var k=0;k<_aBulletsEnemy.length;k++){
                _aBulletsEnemy[k].update();
                this.checkBulletEnemyCollision(_aBulletsEnemy[k]);
            }
            
            if(_iBulletsToRemove !== -1){
                _aBulletsEnemy[_iBulletsToRemove].unload();
                _aBulletsEnemy.splice(_iBulletsToRemove,1);
                _iBulletsToRemove = -1;
            }
            
            this._updateParallaxes();
        }
    };

    s_oGame=this;
    
    HERO_ACCELLERATION = oData.hero_accelleration;
    HERO_FRICTION = oData.hero_friction;      
    MAX_HERO_SPEED = oData.max_hero_speed;
    TIME_OCCURENCE_FALLING_OBJ = oData.time_occurence_falling_obj;
    SPEED_FALLING_OBJ = oData.speed_enemy;
    MAX_SPEED_FALLING_OBJ = oData.max_speed_enemy;
    NUM_LIVES = oData.num_lives;
    SPEED_PLAYER_BULLET = oData.speed_player_bullet;
    SCORE_HIT = oData.score_hit;
    MIN_SHOT_OCCURENCE = oData.min_shot_occurence;
    MAX_SHOT_OCCURENCE = oData.max_shot_occurence;
    
    this._init();
}

var s_oGame;