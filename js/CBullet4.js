function CBullet4(oBulletContainer,szImage,bHero){  
    var BULLET_SPEED = 3;
    
    var _bUpdate = false;
    var _bHero;
    var _aStartPos;
    var _iCurY;
    var _iDirY;
    var _iRadius;
    var _aSprite;
    var _aBulletPos;
    var _aBulletActive;
    var _oContainer;
    
    this._init = function(oBulletContainer,szImage,bHero){
        _oContainer = oBulletContainer;
        
        _bHero = bHero;
        if(bHero){
            _iDirY = -1;
        }else{
            _iDirY = 1;
        }

        _aSprite = new Array();
        var oImage = s_oSpriteLibrary.getSprite(szImage);

        //BULLET LEFT
        var _oSprite = createBitmap(oImage);
        _oSprite.regX = oImage.width/2;
        _oSprite.regY = oImage.height/2;
        _oSprite.x = -100;
        _oSprite.y = -100;
        if(bHero === false){
            _oSprite.scaleY = -1;
            _oSprite.rotation = 45;
        }else{
            _oSprite.rotation = -45;
        }
        _oContainer.addChild(_oSprite);
        _aSprite.push(_oSprite);
        
        //BULLET RIGHT
        _oSprite = createBitmap(oImage);
        _oSprite.x = -100;
        _oSprite.y = -100;
        _oSprite.regX = oImage.width/2;
        _oSprite.regY = oImage.height/2;
        if(bHero === false){
            _oSprite.scaleY = -1;
            _oSprite.rotation = -45;
        }else{
            _oSprite.rotation = 45;
        }
        
        _oContainer.addChild(_oSprite);
        _aSprite.push(_oSprite);

        _aStartPos = new Array();
        _aBulletActive = new Array();
        for(var i=0;i<_aSprite.length;i++){
            _aStartPos.push({x:-100,y:-100});
            _aBulletActive[i] = true;
            _aSprite[i].visible = false;
        }
        
        _iRadius = Math.floor(oImage.width/2);
    };
    
    this.unload = function(){
        for(var i=0;i<_aSprite.length;i++){
            _oContainer.removeChild(_aSprite[i]);
        }
    };
    
    this.reset = function(iIndex){
        _aBulletActive[iIndex] = false;
        
        _aSprite[iIndex].x = _aStartPos[iIndex].x;
        _aSprite[iIndex].y = _aStartPos[iIndex].y;
        
        if (this._checkIfAllBulletInactive() === true){
            _bUpdate = false;
            if(_bHero === false){
                s_oGame.removeBullet(this);
            } 
        }
    };
    
    this._checkIfAllBulletInactive = function(){
        var bDisactive = true;
        for(var i=0;i<_aBulletActive.length;i++){
            if(_aBulletActive[i] === true){
                bDisactive = false;
                break;
            }
        }
        
        return bDisactive;
    };
    
    this.show = function(iX,iY,iSpeedStarship){
        playSound("bullet4",1,false);
        
        _aBulletPos = new Array();
        
        _iCurY = iY;
        for(var i=0;i<_aSprite.length;i++){
            _aSprite[i].x = iX;
            _aSprite[i].y = iY;
            var iCos = parseFloat(Math.cos(degreesToRadians( (_aSprite[i].rotation*_aSprite[i].scaleY) - 90))).toFixed(2);

            var iSin = Math.sin(degreesToRadians( (_aSprite[i].rotation*_aSprite[i].scaleY) + 90));
            _aBulletPos[i] = {x: iCos* (BULLET_SPEED+iSpeedStarship),
                              y: iSin* (BULLET_SPEED+iSpeedStarship) * _iDirY};
            
            _aSprite[i].visible = true;
        }

        _bUpdate = true;
    };
    
    this.getPos = function(){
        return _aSprite;
    };
    
    this.getSprite = function(iIndex){
        return _aSprite[iIndex];
    };
    
    this.getSprites = function(){
        return _aSprite;
    };
    
    this.isUpdating = function(){
        return _bUpdate;
    };
    
    this.getRadius = function(){
        return _iRadius;
    };
    
    this.update = function(){
        if(_bUpdate){
            for(var i=0;i<_aSprite.length;i++){
                _aSprite[i].x += _aBulletPos[i].x;
                _aSprite[i].y += _aBulletPos[i].y;
                if(_aSprite[i].x <0 || _aSprite[i].x > CANVAS_WIDTH || _aSprite[i].y <0 || _aSprite[i].y > CANVAS_HEIGHT){
                    this.reset(i);
                }
            }
        }
    };
    
    this._init(oBulletContainer,szImage,bHero);
}