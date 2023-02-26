function CScrollingBg(oSprite){
    var _iLastObjIndex;
    var _aTiles;
    var _oSpriteTile;
    
    this._init = function(oSprite){
        _oSpriteTile = oSprite;
        
        _aTiles = new Array();
        var iYPos = -oSprite.height;

        while( iYPos < CANVAS_HEIGHT){
            var oTile = createBitmap(oSprite);
            oTile.y=iYPos;

            iYPos += oSprite.height;
            
            _aTiles.push(oTile);
            s_oStage.addChild(oTile);
        }
        _iLastObjIndex = 0;
    };
    
    this.update = function(iSpeed){      
         for(var i=0;i<_aTiles.length;i++){
             
            if(_aTiles[i].y > CANVAS_HEIGHT){
                _aTiles[i].y = _aTiles[_iLastObjIndex].y - (_oSpriteTile.height);
                _iLastObjIndex = i;
            }
            _aTiles[i].y +=  iSpeed;
        }
    };
    
    this._init(oSprite);
}