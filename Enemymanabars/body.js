/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Показывает вражеские манабары.
Не отображает у иллюзий.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

try{
	for(i in Game.Panels.EnemyManaBars)
		Game.Panels.EnemyManaBars[i].DeleteAsync(0)
}catch(e){}
Game.Panels.EnemyManaBars = []
var uiw = Game.GetMainHUD().actuallayoutwidth
var uih = Game.GetMainHUD().actuallayoutheight

function EnemyManaBarsF(){
	var ids = Game.GetAllPlayerIDs()
	for(i in ids){
		var ent = Players.GetPlayerHeroEntityIndex( ids[i] )
		if(!Entities.IsEnemy(ent))
			continue
		var hboffs = Game.HBOffsets[Entities.GetUnitName(ent)]
		if(Entities.GetAllHeroEntities().indexOf(ent)==-1 || !Entities.IsAlive(ent)){
			if(Game.Panels.EnemyManaBars[i])
				Game.Panels.EnemyManaBars[i].visible = false
			continue
		}else
			if(Game.Panels.EnemyManaBars[i])
				Game.Panels.EnemyManaBars[i].visible = true
		var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
		var xyz = Entities.GetAbsOrigin(ent)
		var uix = Game.WorldToScreenX( xyz[0], xyz[1], (xyz[2]+hboffs) )
		var uiy = Game.WorldToScreenY( xyz[0], xyz[1], (xyz[2]+hboffs) )
		var uixp = uix/uiw*100
		var uiyp = uiy/uih*100
		if(Game.Panels.EnemyManaBars[i])
			Game.Panels.EnemyManaBars[i].style.position = uixp+'% '+uiyp+'% 0'
		else{
			Game.Panels.EnemyManaBars[i] = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'EzProcast1Items' )
			Game.Panels.EnemyManaBars[i].BLoadLayoutFromString( '<root><Panel style="width:104px;height:15px;margin:-47px -52px;background-color:#000000EE;border: 1px solid #000;"><Panel style="height:100%;background-color:#4444ffff;"></Panel><Label style="color:#ffffff55;font-size:11px;font-weight: bold;width:100%;text-align: left;vertical-align:center;margin: 0 10px;"/><Label style="color:#ffffff55;font-size:11px;font-weight: bold;width:100%;text-align: right;vertical-align:center;margin: 0 10px;"/></Panel></root>', false, false )
			Game.Panels.EnemyManaBars[i].style.position = uixp+'% '+uiyp+'% 0'
		}
		var Mana = Entities.GetMana( parseInt( ent ) )
		var MaxMana = Entities.GetMaxMana( parseInt( ent ) )
		var ManaPercent = Math.floor( Mana / MaxMana * 100 )
		Game.Panels.EnemyManaBars[i].Children()[0].style.width = ManaPercent+'%'
		Game.Panels.EnemyManaBars[i].Children()[1].text = ManaPercent+'%'
		Game.Panels.EnemyManaBars[i].Children()[2].text = Mana
	}
}


var EnemyManaBarsOnCheckBoxClick = function(){
	if ( !EnemyManaBars.checked ){
		try{
			for(i in Game.Panels.EnemyManaBars)
				Game.Panels.EnemyManaBars[i].DeleteAsync(0)
		}catch(e){}
		Game.Panels.EnemyManaBars = []
		Game.ScriptLogMsg('Script disabled: EnemyManaBars', '#ff0000')
		return
	}
	Game.Panels.EnemyManaBars = []
	function f(){ $.Schedule( 0,function(){
		if (EnemyManaBars.checked){
			EnemyManaBarsF()
			f()
		}
	})}
	f()
	Game.ScriptLogMsg('Script enabled: EnemyManaBars', '#00ff00')
}

//шаблонное добавление чекбокса в панель
var Temp = $.CreatePanel( "Panel", $('#scripts'), "EnemyManaBars" )
Temp.SetPanelEvent( 'onactivate', EnemyManaBarsOnCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="EnemyManaBars" text="EnemyManaBars"/></Panel></root>', false, false)  
var EnemyManaBars = $.GetContextPanel().FindChildTraverse( 'EnemyManaBars' ).Children()[0]