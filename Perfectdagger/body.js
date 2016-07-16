/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
При использовании блинка, блинкуется на
максимальное расстояние (1200) без штрафа за
превышение дальности (1/5)
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var BlinkMaxRangeOnCheckBoxClick = function(){
	if ( PerfectDagger.checked ){
		GameUI.SetMouseCallback( function(eventName,arg){
		var ab = Abilities.GetLocalPlayerActiveAbility()
		var abn = Abilities.GetAbilityName(ab)
		if ( GameUI.GetClickBehaviors()!==3 || abn!="item_blink" )
			return false
		if ( eventName == "pressed" )
		{
			if (arg === 0)
			{
				var myent = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
				var xyz = Entities.GetAbsOrigin(myent)
				var xyz2 = GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition())
				var vec = [xyz2[0]-xyz[0], xyz2[1]-xyz[1], xyz2[2]-xyz[2]]
				var range = Math.sqrt(Math.pow(vec[0],2)+Math.pow(vec[1],2)+Math.pow(vec[2],2))
				if(range<=1200)
					return false
				var evec = [vec[0]/range, vec[1]/range, vec[2]/range]
				Game.CastPosition(myent,ab,[xyz[0]+evec[0]*1200, xyz[1]+evec[1]*1200, xyz[2]+evec[2]*1200],false)
				return true
			}
			if (arg === 1)
				return false
		}
		return false
		})
		Game.ScriptLogMsg('Script enabled: PerfectDagger', '#00ff00')
		return
	}
	GameUI.SetMouseCallback( function(){})
	Game.ScriptLogMsg('Script disabled: PerfectDagger', '#ff0000')
}
var Temp = $.CreatePanel( "Panel", $('#scripts'), "PerfectDagger" )
Temp.SetPanelEvent( 'onactivate', BlinkMaxRangeOnCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="PerfectDagger" text="PerfectDagger"/></Panel></root>', false, false)  
var PerfectDagger = $.GetContextPanel().FindChildTraverse( 'PerfectDagger' ).Children()[0]