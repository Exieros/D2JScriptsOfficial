/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Мгновенные пуффы к главному мипо и бросок сетки.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var interval = 0.1
var spoof = false
var uiw = Game.GetMainHUD().actuallayoutwidth
var uih = Game.GetMainHUD().actuallayoutheight

try{
	Game.Panels.EzMeepo.DeleteAsync(0)
	GameEvents.Unsubscribe( Game.Subscribes.EzMeepoonchatmsg )
}catch(e){}


function EzMeepoF(){
	if ( !EzMeepo.checked )
		return
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var meepo = Entities.GetAllEntitiesByName('npc_dota_hero_meepo')
	var mainmeepo = Players.GetLocalPlayerPortraitUnit()
	if(Entities.GetUnitName(mainmeepo)!='npc_dota_hero_meepo')
		return
	meepo.splice(meepo.indexOf(mainmeepo))
	if(Game.spoof){
		Game.Panels.EzMeepo.Children()[0].value+=1
		for(i in meepo){
			var poof = Entities.GetAbilityByName( meepo[i], 'meepo_poof' )
			var cd = Abilities.GetCooldownTimeRemaining(poof)
			if(cd!=0)
				continue
			if(!Abilities.IsInAbilityPhase(poof)){
				GameUI.SelectUnit(meepo[i],false)
				Game.CastTarget(meepo[i],poof,mainmeepo,false)
				GameUI.SelectUnit(mainmeepo,false)
			}
		}
	}else{
		Game.Panels.EzMeepo.Children()[0].value=0
		for(i in meepo){
			var poof = Entities.GetAbilityByName( meepo[i], 'meepo_poof' )
			var cd = Abilities.GetCooldownTimeRemaining(poof)
			if(cd!=0)
				continue
			if(Abilities.IsInAbilityPhase(poof)){
				GameUI.SelectUnit(meepo[i],false)
				Game.EntStop(meepo[i], false)
				GameUI.SelectUnit(mainmeepo,false)
			}
		}
	}	

}


var EzMeepoOnCheckBoxClick = function(){
	if ( !EzMeepo.checked ){
		try{
			Game.Panels.EzMeepo.DeleteAsync(0)
			GameEvents.Unsubscribe( Game.Subscribes.EzMeepoonchatmsg )
		}catch(e){}
		Game.ScriptLogMsg('Script disabled: EzMeepo', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_meepo' ){
		EzMeepo.checked = false
		Game.ScriptLogMsg('EzMeepo: Not Meepo', '#ff0000')
		return
	}

	Game.Functions.Meepo = function(){
		var meepo = Entities.GetAllEntitiesByName('npc_dota_hero_meepo')
		var CursorXYZ = Game.ScreenXYToWorld( GameUI.GetCursorPosition()[0],GameUI.GetCursorPosition()[1] )
		var mainmeepo = Players.GetLocalPlayerPortraitUnit()
		for(i in meepo){
			var earthbind = Entities.GetAbilityByName( meepo[i], 'meepo_earthbind' )
			var cd = Abilities.GetCooldownTimeRemaining(earthbind)
			if(cd!=0)
				continue
			GameUI.SelectUnit(meepo[i],false)
			Game.CastPosition(meepo[i], earthbind, CursorXYZ, false)
			GameUI.SelectUnit(mainmeepo,false)
			return
		}
	}
	GameEvents.Subscribe('game_newmap', function(){
		Game.EzMeepoCreate = false
		Game.EzMeepoCreate = false
	})
	if(!Game.EzMeepoCreate){
		Game.EzMeepoCreate = true
		Game.AddCommand("__EzMeepo_Poof", function(){if(Game.spoof){Game.spoof=false}else{Game.spoof=true}}, "", 0)
	}
	if(!Game.EzMeepoCreate2){
		Game.EzMeepoCreate2 = true
		Game.AddCommand("__EzMeepo_Earthbind", Game.Functions.Meepo, "", 0)
	}
	
	//циклически замкнутый таймер с проверкой условия с интервалом 'interval'
	function f(){ $.Schedule( interval,function(){
		if (EzMeepo.checked){
			EzMeepoF()
			f()
		}
	})}
	f()
	Game.Panels.EzMeepo = $.CreatePanel( "Panel", Game.GetMainHUD(), "EzTechiesSlider" )
	Game.Panels.EzMeepo.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel style="border-radius:5px;background-color:#000000EE;margin: -27px -54px;"><ProgressBar style="width:108px;border:1px solid black;height: 15px;background-color: #00000011;"/></Panel></root>', false, false)
	Game.Panels.EzMeepo.Children()[0].max=15
	Game.Panels.EzMeepo.Children()[0].value=0
	
	function L(){ $.Schedule( 0,function(){
		if (EzMeepo.checked){
			var mainmeepo = Players.GetLocalPlayerPortraitUnit()
			if(Entities.GetUnitName(mainmeepo)!='npc_dota_hero_meepo'){
				Game.Panels.EzMeepo.visible = false
			}else{
				Game.Panels.EzMeepo.visible = true
				var xyz = Entities.GetAbsOrigin(mainmeepo)
				var uix = Game.WorldToScreenX( xyz[0], xyz[1], xyz[2]+125 )
				var uiy = Game.WorldToScreenY( xyz[0], xyz[1], xyz[2]+125 )
				var uixp = uix/uiw*100
				var uiyp = uiy/uih*100
				Game.Panels.EzMeepo.style.position = uixp+'% '+uiyp+'% 0'
			}
		}
		L()
	})}
	L()
	
	Game.ScriptLogMsg('Script enabled: EzMeepo', '#00ff00')
}

var EzMeepo = Game.AddScript(1,"EzMeepo",EzMeepoOnCheckBoxClick)