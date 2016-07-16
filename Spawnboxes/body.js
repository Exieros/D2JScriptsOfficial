/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Показывает границы лагерей нейтральных крипов
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

Game.Particles.SpawnBoxes = []

function MapLoaded(){
	GameEvents.Unsubscribe( Game.Subscribes.SpawnBoxesOnmaploaded )
	SpawnBoxes.checked = false
	Game.Particles.SpawnBoxes = []
}

function DrawLineInGameWorld( a, b, Grb ){
	//a = [0,0,0], b = [100,200,150]
		temp = Particles.CreateParticle("particles/ui_mouseactions/bounding_area_view_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, 0)
		Grb.push(temp)
		Particles.SetParticleControl(temp, 0, a)
		Particles.SetParticleControl(temp, 1, b)
		Particles.SetParticleControl(temp, 16, [1,0,0])
}

SpawnBoxes = function(){
	if ( !SpawnBoxes.checked ){
		GameEvents.Unsubscribe( Game.Subscribes.SpawnBoxesOnmaploaded )
		for ( i=0; i<Game.Particles.SpawnBoxes.length; i++ )
			Particles.DestroyParticleEffect(Game.Particles.SpawnBoxes[i],Game.Particles.SpawnBoxes[i])
		Game.ScriptLogMsg('Script disabled: SpawnBoxes', '#ff0000')
		return
	}
	spots = [
		//Radiant Spawns
		[2690, -4409, 3529, -5248, 400], 
		[3936, -3277, 5007, -4431, 400], 
		[1088, -3200, 2303, -4543, 400], 
		[-3307, 383, -2564, -413, 400],
		[-1023, -2728, 63, -3455, 300], 
		[-2227, -3968, -1463, -4648, 300],
		[-4383, 1295, -3136, 400, 400], 
		//Dire Spawns
		[3344, 942, 4719, 7, 400],
		[-3455, 4927, -2688, 3968, 400], 
		[-4955, 4071, -3712, 3264, 400], 
		[3456, -384, 4543, -1151, 300],
		[-1967, 3135, -960, 2176, 300],
		[-831, 4095, 0, 3200, 400],
		[448, 3775, 1663, 2816, 400]
	]
	for ( i=0; i<spots.length; i++ ){
		spot = spots[i]
		DrawLineInGameWorld( [ spot[0], spot[1], spot[4] ], [ spot[0], spot[3], spot[4] ], Game.Particles.SpawnBoxes)
		DrawLineInGameWorld( [ spot[2], spot[1], spot[4] ], [ spot[2], spot[3], spot[4] ], Game.Particles.SpawnBoxes)
		DrawLineInGameWorld( [ spot[0], spot[1], spot[4] ], [ spot[2], spot[1], spot[4] ], Game.Particles.SpawnBoxes)
		DrawLineInGameWorld( [ spot[0], spot[3], spot[4] ], [ spot[2], spot[3], spot[4] ], Game.Particles.SpawnBoxes)
	}
	Game.Subscribes.SpawnBoxesOnmaploaded = GameEvents.Subscribe('game_newmap', MapLoaded)
	Game.ScriptLogMsg('Script enabled: SpawnBoxes', '#00ff00')
}
var Temp = $.CreatePanel( "Panel", $('#scripts'), "SpawnBoxes" )
Temp.SetPanelEvent( 'onactivate', SpawnBoxes )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="SpawnBoxes" text="SpawnBoxes"/></Panel></root>', false, false)  
SpawnBoxes = $.GetContextPanel().FindChildTraverse( 'SpawnBoxes' ).Children()[0]