/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Jтображает радиус получения опыта
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var Range = 1300

var exprangeLoad = function(){
	try{
		Particles.DestroyParticleEffect(Game.Particles.ExpRange,Game.Particles.ExpRange)
	}
	catch(e){}
	var MyEnt = Players.GetPlayerHeroEntityIndex( Game.GetLocalPlayerID() )
	Game.Particles.ExpRange = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , MyEnt)
	Particles.SetParticleControl(Game.Particles.ExpRange, 1, [Range,0,0])
}

function exprangeOnOff(){
	if ( !ExpRange.checked ){
		try{
			Particles.DestroyParticleEffect(Game.Particles.ExpRange,Game.Particles.ExpRange)
		}
		catch(e){}
		Game.ScriptLogMsg('Script disabled: ExpRange', '#ff0000')
		
	}else{
		exprangeLoad()
		Game.ScriptLogMsg('Script enabled: ExpRange', '#00ff00')
	}
}

var Temp = $.CreatePanel( "Panel", $('#scripts'), "ExpRange" )
Temp.SetPanelEvent( 'onactivate', exprangeOnOff )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="ExpRange" text="ExpRange"/></Panel></root>', false, false)  
ExpRange = $.GetContextPanel().FindChildTraverse( 'ExpRange' ).Children()[0]