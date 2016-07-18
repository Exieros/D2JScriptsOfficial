/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Автоматический тпаут при релокейте.
 и удивление врагов :)))
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

//ПИНГОЗАВИСИМЫЙ ПАРАМЕТР, С 0.1 У МЕНЯ ПРЕКРАСНО РАБОТАЛ СКРИПТ ПРИ ПИНГЕ 60 мс
const tpouttime = 0.1

var notify = false
var cd = false
function IORelocateEscapeF(){
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Buff = Game.GetBuffByName(MyEnt,'modifier_wisp_relocate_return')
	if(Buff==-1){
		notify = false
		cd = false
		return
	}
	var tp = Game.GetAbilityByName(MyEnt,'item_tpscroll')
	if(tp==-1||Abilities.GetCooldownTimeRemaining(tp)!=0){
		notify = false
		cd = false
		return
	}
	if(!notify){
		notify = true
		GameEvents.SendEventClientSide( 'antiaddiction_toast', {"message":"Внимание, активирован IORelocateEscape!","duration":"3"})
	}
	if((parseInt(Buffs.GetRemainingTime(MyEnt,Buff)*10))/10==tpouttime-10&&!cd){
		cd = true
		Abilities.CreateDoubleTapCastOrder( tp, MyEnt )
	}
}

var IORelocateEscapeOnCheckBoxClick = function(){
	if ( !IORelocateEscape.checked ){
		Game.ScriptLogMsg('Script disabled: IORelocateEscape', '#ff0000')
		return
	}
	function f(){ $.Schedule( 0,function(){
		if (IORelocateEscape.checked){
			f()
			IORelocateEscapeF()
		}
	})}
	f()
	Game.ScriptLogMsg('Script enabled: IORelocateEscape', '#00ff00')
}
var IORelocateEscape = Game.AddScript(1,"IORelocateEscape",IORelocateEscapeOnCheckBoxClick)