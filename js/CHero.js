function CHero(iX,iY,oSprite){
    var _bHurting;
    var _bLeft = false;
    var _bRight = false;
    var _iStartingX;
    var _iStartingY;
    var _iHalfWidth;
    var _iHalfHeight;
    var _iXMove;
    var _iCurAlpha;
    var _iNumHurt;
    var _iAccelleration;
    var _oSprite;
    var _oExplosion;
    
    this._init = function(iX,iY,oSprite){
       _iStartingX = iX;
       _iStartingY = iY;
       _iXMove = 0;
       _iAccelleration = 0;
       _iCurAlpha = 1;
       _iNumHurt = 0;
       _bHurting = false;
       
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: 65, height: 100, regX: 32, regY: 50}, 
                        animations: {  idle: [0],move_right:[1,5,"idle_right"],idle_right:[5],back_right:[6,10,"idle"],
                                            move_left:[11,15,"idle_left"],idle_left:[15],back_left:[16,20,"idle"]}
                   };
        
        var oObjSpriteSheet = new createjs.SpriteSheet(oData);
        _oSprite = createSprite(oObjSpriteSheet, "idle",32,50,65,100);
        _oSprite.x = iX;
        _oSprite.y = iY;
        _oSprite.stop();
        s_oStage.addChild(_oSprite);
       
       _iHalfWidth = 65/2;
       _iHalfHeight = 50;
       
        var oSpriteExplosion = s_oSpriteLibrary.getSprite('explosion_hero');
        var oData = {   // image to use
                        images: [oSpriteExplosion], 
                        // width, height & registration point of each sprite
                        frames: {width: 200, height: 200, regX: 100, regY: 100}, 
                        animations: {  show: [0, 19,"hide"],hide:[20,21] }
                        
        };

        var oSpriteSheetExplosion = new createjs.SpriteSheet(oData,"hide");
        _oExplosion = createSprite(oSpriteSheetExplosion,"hide",100,100,200,200);
		
        var oParent = this;
        _oExplosion.addEventListener("animationend",oParent.onAnimationEnd);
        _oExplosion.stop();
        _oExplosion.visible = false;
        s_oStage.addChild(_oExplosion);
    };
	
    this.unload = function(){
        createjs.Tween.removeTweens(_oSprite);
        _oExplosion.removeEventListener("animationend",this.onAnimationEnd);
    };
    
    this.moveLeft = function(){
        _oSprite.gotoAndPlay("move_left");
        _bLeft = true;
    };

    this.moveRight = function(){
        _oSprite.gotoAndPlay("move_right");
        _bRight = true;
    };
    
    this.onAnimationEnd = function(){
	_oExplosion.stop();
        s_oGame.gameOver();
    };
    
    this.stop = function(){
        if(_bLeft){
            _oSprite.gotoAndPlay("back_left");
        }else{
            _oSprite.gotoAndPlay("back_right");
        }
        
        _bLeft = false;
        _bRight = false;
    };
    
    this.hurt = function(){
        
        if(_iCurAlpha === 1){
            _iCurAlpha = 0;
        }else{
            _iCurAlpha = 1;
        }
        
        _iNumHurt++;
        if(_iNumHurt<6){
            _bHurting = true;
            var oParent = this;
            createjs.Tween.get(_oSprite).to({alpha:_iCurAlpha }, 150,createjs.Ease.cubicOut).call(function(){oParent.hurt()});    
        }else{
            _bHurting = false;
            _iNumHurt = 0;
            _iCurAlpha = 1;
            createjs.Tween.get(_oSprite).to({alpha:_iCurAlpha }, 150,createjs.Ease.cubicOut);
        }
    };
    
    this.gameOver = function(){
        _oSprite.visible = false;
        
        _oExplosion.x = _oSprite.x;
        _oExplosion.y = _oSprite.y;
        _oExplosion.visible = true;
        _oExplosion.gotoAndPlay("show");
        
        playSound("final_explosion",1,false);
    };
    
    this.getPos = function(){
        return { x: _oSprite.x, y: _oSprite.y};
    };
    
    this.getHeadY = function(){
        return _oSprite.y - _iHalfHeight;
    };
    
    this.getRadius = function(){
        return _iHalfWidth;
    };
    
    this.isHurting = function(){
        return _bHurting;
    };
    
    this.getBulletStartPoint = function(){
        return {x:_oSprite.x,y:this.getHeadY()};
    };
    
    this.getSprite = function(){
        return _oSprite;
    };

    this.update = function(){
        

        if(_bLeft){
            _iXMove -= HERO_ACCELLERATION;
        }
        if(_bRight){
            _iXMove += HERO_ACCELLERATION;
        }

        _oSprite.x += _iXMove;

        _iXMove *= HERO_FRICTION;
        if (_iXMove > MAX_HERO_SPEED) {
                _iXMove = MAX_HERO_SPEED;
        }
        
        if (_iXMove < -MAX_HERO_SPEED) {
                _iXMove = -MAX_HERO_SPEED;
        }

        if ( Math.abs(_iXMove) < 0.1 ) {
                _iXMove = 0;
        }
		
		if( ((_oSprite.x + _iHalfWidth + _iXMove) > CANVAS_WIDTH)){  
            _oSprite.x = CANVAS_WIDTH - _iHalfWidth - _iXMove;
        }
        
        if((_oSprite.x - _iHalfWidth + _iXMove)<0) {
            _oSprite.x = _iHalfWidth - _iXMove;
        }
    };
    
    this._init(iX,iY,oSprite);
}