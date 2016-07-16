/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Показывает анимацию каста следующих скиллов:
	стан лины, санстрайк, торрент кунки
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var modifiers = [
	["modifier_invoker_sun_strike", 1.7],
	["modifier_kunkka_torrent_thinker", 1.6],
	["modifier_lina_light_strike_array", 0.5],
	["modifier_leshrac_split_earth_thinker", 0.35]
]

var z = []

function SAllertEvery(){
	try{if (!SkillAlert.checked){return}}catch(e){}
	thinkers = Entities.GetAllEntitiesByName('npc_dota_thinker')
	for ( var m in thinkers){
		var ent = thinkers[m]
		var xyz = Entities.GetAbsOrigin(ent)
		var buffsnames = Game.GetBuffsNames(ent)
		if(buffsnames.length!=1)
			continue
		var f = false
		for(i in modifiers)
			if(modifiers[i][0]==buffsnames[0])
				CreateTimerParticle(xyz,modifiers[i][1])	
	}
}

function CreateTimerParticle(xyz,time,ent){
	if(z.indexOf(ent)!=-1)
		return
	var p = Particles.CreateParticle("particles/neutral_fx/roshan_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, 0)
	Particles.SetParticleControl(p, 0, xyz)
	z.push(ent)
	$.Schedule(time+0.1,function(){ Particles.DestroyParticleEffect(p,p); z.splice(z.indexOf(ent),1); })
}

function SkillAlertChkBox(){
	if ( !SkillAlert.checked ){
		Game.ScriptLogMsg('Script disabled: SkillAlert', '#ff0000')
	}else{
		function f(){ $.Schedule( 0,function(){
			try{if (SkillAlert.checked){
				SAllertEvery()
				f()
			}}catch(e){}
		})}
		f()
		Game.ScriptLogMsg('Script enabled: SkillAlert', '#00ff00')
	}
}

var Temp = $.CreatePanel( "Panel", $('#scripts'), "SkillAlert" )
Temp.SetPanelEvent( 'onactivate', SkillAlertChkBox )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="SkillAlert" text="SkillAlert"/></Panel></root>', false, false)  
var SkillAlert = $.GetContextPanel().FindChildTraverse( 'SkillAlert' ).Children()[0]

