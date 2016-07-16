/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Показывает анимацию каста следующих скиллов:
	стан лины, санстрайк, торрент кунки,
	разгон бары, шар тускара.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var modifiers = [
	["modifier_invoker_sun_strike", 1.7],
	["modifier_kunkka_torrent_thinker", 1.6],
	["modifier_lina_light_strike_array", 0.5],
	["modifier_leshrac_split_earth_thinker", 0.35],
	["modifier_spirit_breaker_charge_of_darkness_vision", 1.5],
	["modifier_tusk_snowball_visible", 1.5]
]

var z = []

function SAllertEvery(){
	try{if (!SkillAlert.checked){return}}catch(e){}
	thinkers = Entities.GetAllEntitiesByName('npc_dota_thinker')
	
	var User = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())

	for ( var m in thinkers){
		var ent = thinkers[m]
		var xyz = Entities.GetAbsOrigin(ent)
		var buffsnames = Game.GetBuffsNames(ent)
		if(buffsnames.length!=1)
			continue
		var f = false
		for(i in modifiers)
		{
			Game.ScriptLogMsg( buffsnames[0], '#00ff00')
			if(modifiers[i][0]==buffsnames[0])
				CreateTimerParticle(xyz,modifiers[i][1])	
		}
	}
	
	var UserBuffs = Game.GetBuffsNames(User)
	var xyz = Entities.GetAbsOrigin(User)
	
	for (ibuff in UserBuffs)
		for(imod in modifiers)
		{
			//Game.ScriptLogMsg( 'My buffs: ' + UserBuffs[ibuff], '#00ff00')
			if (modifiers[imod][0]==UserBuffs[ibuff])
			{
				if ((modifiers[imod][0]=="modifier_spirit_breaker_charge_of_darkness_vision")||(modifiers[imod][0]=="modifier_tusk_snowball_visible"))
					CreateFollowParticle(modifiers[imod][1],"particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_target_mark.vpcf",User)
				else
					CreateTimerParticle(xyz,modifiers[imod][1])
			}
		}
}

function CreateFollowParticle(time,particlepath,someobj,ent){
	if(z.indexOf(ent)!=-1)
		return
	var p = Particles.CreateParticle(particlepath, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, someobj)
	Particles.SetParticleControl(p, 0,  0)
	z.push(ent)
	$.Schedule(time+0.1,function(){ Particles.DestroyParticleEffect(p,p); z.splice(z.indexOf(ent),1); })
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
		function f(){ $.Schedule( 0.1,function(){
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