function CScrollingMultipleBg(aSprites){
    var _iLastObjIndex;
    var _aMovingTiles;
    var _aSpriteTile;
    var _iHeight;
    
    this._init = function(aSprites){
        _aSpriteTile = new Array();

        _aMovingTiles = new Array();
        var iYPos = -aSprites[0].height;
        _iHeight = aSprites[0].height;

        var iCont = 0;
        while( iYPos < CANVAS_HEIGHT*2){
            var oTile = createBitmap(aSprites[iCont]);
            oTile.y=iYPos;

            iYPos += _iHeight;
            
            _aMovingTiles.push(oTile);
            s_oStage.addChild(oTile);
            iCont++;
        }
        
        
        _iLastObjIndex = 0;
    };
    
    this.update = function(iSpeed){      
         for(var i=0;i<_aMovingTiles.length;i++){
             
            if(_aMovingTiles[i].y > CANVAS_HEIGHT){
                _aMovingTiles[i].y = _aMovingTiles[_iLastObjIndex].y - _iHeight;
                _iLastObjIndex = i;
            }
            _aMovingTiles[i].y +=  iSpeed;
            
            if(_aMovingTiles[i].y > -_iHeight &&  _aMovingTiles[i].y<CANVAS_HEIGHT){
                _aMovingTiles[i].visible = true;
            }else{
                _aMovingTiles[i].visible = false;
            }
        }
    };
    
    this._init(aSprites);
}