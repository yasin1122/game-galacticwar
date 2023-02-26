function CHelpPanel(iXPos,iYPos,oSprite){
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;
    var _oHelpBg;
    var _oGroup;

    this._init = function(iXPos,iYPos,oSprite){
        _oHelpBg = createBitmap(oSprite); 
        
        var szHelp1 = TEXT_HELP1;
        var szHelp2 = TEXT_HELP2;
        if(s_bMobile){
            szHelp1 = TEXT_HELP1_MOBILE;
            szHelp2 = TEXT_HELP2_MOBILE;
        }

        _oText1Back = new createjs.Text(szHelp1,"24px "+FONT_GAME, "#000000");
        _oText1Back.textAlign = "center";
        _oText1Back.lineWidth = 300;
        _oText1Back.x = CANVAS_WIDTH/2 + 152;
        _oText1Back.y = 422;
	
	_oText1 = new createjs.Text(szHelp1,"24px "+FONT_GAME, "#ffffff");
        _oText1.textAlign = "center";
        _oText1.lineWidth = 300;
        _oText1.x = CANVAS_WIDTH/2 + 150;
        _oText1.y = 420;

        _oText2Back = new createjs.Text(szHelp2,"24px "+FONT_GAME, "#000000");
        _oText2Back.textAlign = "center";
        _oText2Back.lineWidth = 300;
        _oText2Back.x = CANVAS_WIDTH/2 + 152;
        _oText2Back.y = 732;
		
	_oText2 = new createjs.Text(szHelp2,"24px "+FONT_GAME, "#ffffff");
        _oText2.textAlign = "center";
        _oText2.lineWidth = 300;
        _oText2.x = CANVAS_WIDTH/2 + 150;
        _oText2.y = 730;

        _oGroup = new createjs.Container();
        _oGroup.x = iXPos;
        _oGroup.y = iYPos;
        _oGroup.addChild(_oHelpBg,_oText1Back,_oText1,_oText2Back,_oText2);
        s_oStage.addChild(_oGroup);

        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        this.unload();
        s_oGame._onExitHelp();
    };

    this._init(iXPos,iYPos,oSprite);

}