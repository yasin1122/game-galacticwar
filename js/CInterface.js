function CInterface(){
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosLeft;
    var _pStartPosRight;
    var _pStartPosShoot;
    var _pStartPosScore;
    var _pStartPosLife;
    var _pStartPosFullscreen;

    var _oButExit;
    var _oButLeft;
    var _oButRight;
    var _oButShot;
    var _oScoreText;
    var _oHelpPanel;
    var _oLife;
    var _oLifeText;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        
        _pStartPosScore = {x:20,y:100};
	_oScoreText = new createjs.Text(TEXT_SCORE +": 0","30px "+FONT_GAME, "#ffffff");
        _oScoreText.x = _pStartPosScore.x;
        _oScoreText.y = _pStartPosScore.y; 
        _oScoreText.textAlign = "left";
        s_oStage.addChild(_oScoreText);
		
        
        if(s_bMobile){
            _pStartPosLeft = {x:70,y:CANVAS_HEIGHT-70};
            _oButLeft = new CGfxButton(_pStartPosLeft.x,_pStartPosLeft.y,s_oSpriteLibrary.getSprite('but_left'),true);
            _oButLeft.addEventListener(ON_MOUSE_DOWN, this._onLeftPressed, this);  
            _oButLeft.addEventListener(ON_MOUSE_UP, this._onLeftReleased, this);  

            _pStartPosRight = {x:180,y:CANVAS_HEIGHT-70};
            _oButRight = new CGfxButton(_pStartPosRight.x,_pStartPosRight.y,s_oSpriteLibrary.getSprite('but_right'),true);
            _oButRight.addEventListener(ON_MOUSE_DOWN, this._onRightPressed, this); 
            _oButRight.addEventListener(ON_MOUSE_UP, this._onRightReleased, this);

            _pStartPosShoot = {x:CANVAS_WIDTH - 130,y:CANVAS_HEIGHT-70};
            _oButShot = new CTextButton(_pStartPosShoot.x,_pStartPosShoot.y,s_oSpriteLibrary.getSprite('but_play'),
                                                                    TEXT_SHOOT,FONT_GAME,"#ffffff",34);
            _oButShot.addEventListener(ON_MOUSE_DOWN, this._onShot, this);
        
        }
        _pStartPosLife = {x:10,y:10};
        _oLife = createBitmap(s_oSpriteLibrary.getSprite('life'));
        _oLife.x = _pStartPosLife.x;
        _oLife.y = _pStartPosLife.y;
        s_oStage.addChild(_oLife);
        
        _oLifeText = new createjs.Text("x"+NUM_LIVES,"30px "+FONT_GAME, "#ffffff");
        _oLifeText.x = 74;
        _oLifeText.y = 40; 
        s_oStage.addChild(_oLifeText);

        _oHelpPanel = new CHelpPanel(0,0,s_oSpriteLibrary.getSprite('bg_help'));

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.height/2) - 10,y:(oSprite.height/2) + 10}
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);          
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x:_pStartPosExit.x - oSprite.height - 10,y:_pStartPosExit.y}
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosExit.x - oSprite.height - 10,y:_pStartPosExit.y}
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }      
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        if(s_bMobile){
            _oButLeft.setPosition(_pStartPosLeft.x + iNewX,_pStartPosLeft.y - iNewY);
            _oButRight.setPosition(_pStartPosRight.x + iNewX,_pStartPosRight.y - iNewY);
            _oButShot.setPosition(_pStartPosShoot.x - iNewX,_pStartPosShoot.y - iNewY);
        }
        _oScoreText.x = _pStartPosScore.x + s_iOffsetX;
        _oScoreText.y = _pStartPosScore.y + iNewY;
        _oLife.x = _pStartPosLife.x + iNewX;
        _oLife.y = _pStartPosLife.y + iNewY;
        
        _oLifeText.x = _oLife.x + 66;
        _oLifeText.y = _oLife.y + 32; 
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
        if(s_bMobile){
            _oButLeft.unload();
            _oButLeft = null;
            _oButRight.unload();
            _oButRight = null;
            _oButShot.unload();
            _oButShot = null;
        }
        
        
        _oHelpPanel.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        s_oInterface = null;
    };
    
    this.resetFullscreenBut = function(){
	_oButFullscreen.setActive(s_bFullscreen);
    };
    
    this.refreshScore = function(iScore){
        _oScoreText.text = TEXT_SCORE +": "+iScore;
    };
    
    this.refreshLives = function(iLives){
        _oLifeText.text = "x"+iLives;  
    };
    
    this._onLeftPressed = function(){
        s_oGame.onLeft();
    };
    
    this._onLeftReleased = function(){
        s_oGame.onKeyReleased();
    };
    
    this._onRightPressed = function(){
        s_oGame.onRight();
    };
    
    this._onRightReleased = function(){
         s_oGame.onKeyReleased();
    };
    
    this._onShot = function(){
        s_oGame.onShot();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;