function CEnemy(iY,oBulletContainer){
    var _bUpdate = false;
    var _iStartX;
    var _iStartY;
    var _iSpeed;
    var _iRadius;
    var _iBullet;
    var _iShotOccurence;
    var _iTimeElaps;
    var _oSprite;
    var _oExplosion;
    var _oBulletContainer;
    
    
    this._init = function(iY,oBulletContainer){
        _iStartY = iY;
        _oBulletContainer = oBulletContainer;

        var oData = {   
                        images: [s_oSpriteLibrary.getSprite('enemies')], 
                        // width, height & registration point of each sprite
                        frames: {width: 100, height: 100, regX: 50, regY: 50}, 
                        animations: {  enemy_1: [0],enemy_2: [1],enemy_3: [2],enemy_4: [3]}
                    };
        
        var oObjSpriteSheet = new createjs.SpriteSheet(oData);
        _oSprite = createSprite(oObjSpriteSheet, "enemy_1",50,50,100,100); 
        _oSprite.y = _iStartY;
        _oSprite.stop();
        s_oStage.addChild(_oSprite);
		
	var oSprite = s_oSpriteLibrary.getSprite('explosion');
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: 149, height: 149, regX: 74, regY: 74}, 
                        animations: {  show: [0, 19,"hide"],hide:[20,21] }
                        
        };

        var oSpriteSheetExplosion = new createjs.SpriteSheet(oData,"hide");
        _oExplosion = createSprite(oSpriteSheetExplosion,"hide",74,74,149,149);
		
        var oParent = this;
        _oExplosion.addEventListener("animationend",oParent.onAnimationEnd);
        _oExplosion.stop();
        _oExplosion.visible = false;
        s_oStage.addChild(_oExplosion);
        
        _iRadius = 44;
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oSprite);
    };
    
    this.reset = function(){
        _bUpdate = false;
	
        playSound("explosion",1,false);
        
	_oExplosion.x = _oSprite.x;
        _oExplosion.y = _oSprite.y;
        _oExplosion.visible = true;
        _oExplosion.gotoAndPlay("show");

	_oSprite.y = _iStartY;
    };
    
    this.show = function(iX,iSpeed,iType){
	_oSprite.alpha = 1;
        _iStartX = iX;
        _oSprite.x = iX;
        _oSprite.y = _iStartY;
        _iSpeed = iSpeed;

        _oSprite.gotoAndStop("enemy_"+iType);
        
         this._assignBulletType(iType);
        
        _bUpdate = true;
    };
    
    this._assignBulletType = function(iType){
        _iShotOccurence = Math.floor(Math.random() * MAX_SHOT_OCCURENCE) +MIN_SHOT_OCCURENCE;
        _iTimeElaps = 0; 
        
        _iBullet = iType;
    };
    
    this._shot = function(){
        var oBullet;
        switch(_iBullet){
            case 1:{
                    oBullet = new CBullet1(_oBulletContainer,"bullet",false);
                    break;
            }
            case 2:{
                    oBullet = new CBullet2(_oBulletContainer,"bullet",false);
                    break;
            }
            case 3:{
                    oBullet = new CBullet3(_oBulletContainer,"bullet3",false);
                    break;
            }
            case 4:{
                    oBullet = new CBullet4(_oBulletContainer,"bullet",false);
                    break;
            }
        }

        oBullet.show(_oSprite.x,_oSprite.y + 40,_iSpeed);
        s_oGame.addEnemyBullets(oBullet);
    };
	
    this.onAnimationEnd = function(){
	_oExplosion.x = _oSprite.x;
        _oExplosion.y = _oSprite.y;
    };
    
    this.getPos = function(){
        return { x: _oSprite.x, y: _oSprite.y};
    };
    
    this.getRadius = function(){
        return _iRadius;
    };
    
    this.isMoving = function(){
        return _bUpdate;
    };
    
    this.getSprite = function(){
        return _oSprite;
    };
    
    this.update = function(){
        if(_bUpdate){
            _oSprite.y += _iSpeed;
            s_oGame.checkCollision(this);
            
            _iTimeElaps += s_iTimeElaps;
            if(_iTimeElaps > _iShotOccurence){
                _iTimeElaps = 0;
                this._shot();
            }
        }
    };
    
    this._init(iY,oBulletContainer);
}