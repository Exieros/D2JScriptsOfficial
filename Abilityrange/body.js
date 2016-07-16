/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Показывает радиус абилов. Учитывает линзу.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

try{ Game.Panels.AbilityRange.DeleteAsync(0) }catch(e){}
for (i in Game.Subscribes.AbilityRange)
	try{ GameEvents.Unsubscribe( Game.Subscribes.AbilityRange[i] ) }catch(e){}
for(i in Game.Particles.AbilityRange)
	try{ Particles.DestroyParticleEffect(Game.Particles.AbilityRange[i],Game.Particles.AbilityRange[i]) }catch(e){}

Game.Particles.AbilityRange = []
Game.Subscribes.AbilityRange = []
Game.Panels.AbilityRange = []
var LensInInv = false
var Config = []

function GetAbilityRange( Abil ){
	var MyEnt = Players.GetPlayerHeroEntityIndex( Game.GetLocalPlayerID() )
	var Range = 0
	var Lens = Entities.HasItemInInventory( MyEnt, 'item_aether_lens' ) 
	Range = Abilities.GetCastRange( parseInt(Abil) )
	var Behavior = Game.Behaviors( parseInt(Abil) )
	if ( Lens && ( Behavior.indexOf(16)!=-1 || Behavior.indexOf(8)!=-1 ) )
		Range += 200
	return Range
}

function InventoryChanged(data){
	if (!AbilityRange.checked)
		return
	var MyID = Game.GetLocalPlayerID()
	if ( MyID==-1 )
		return
	MyEnt = Players.GetPlayerHeroEntityIndex(MyID)
	if ( MyEnt==-1 )
		return
	var Lens = Entities.HasItemInInventory( MyEnt, 'item_aether_lens' )
	if (Lens == LensInInv)
		return
	LensInInv = Lens
	if ( Game.Particles.AbilityRange.length == 0 )
		return
	for(var i in Game.Particles.AbilityRange){
		Range = GetAbilityRange(i)
		Particles.DestroyParticleEffect(Game.Particles.AbilityRange[i],Game.Particles.AbilityRange[i])
		if ( !Range || Range <= 0 )
			return
		Game.Particles.AbilityRange[i] = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , MyEnt)
		Particles.SetParticleControl(Game.Particles.AbilityRange[i], 1,  [Range,0,0])
	}
}

Destroy=function(){
	try{ Game.Panels.AbilityRange.DeleteAsync(0) }catch(e){}
	for (i in Game.Subscribes.AbilityRange.length)
		try{ GameEvents.Unsubscribe( Game.Subscribes.AbilityRange[i] ) }catch(e){}
	for(i in Game.Particles.AbilityRange)
		try{ Particles.DestroyParticleEffect(Game.Particles.AbilityRange[i],Game.Particles.AbilityRange[i]) }catch(e){}
	Game.Subscribes.AbilityRange = []
	Game.Particles.AbilityRange = []
}

function SkillLearned(data){
	if (!AbilityRange.checked)
		return
	var MyID = Game.GetLocalPlayerID()
	var MyEnt = Players.GetPlayerHeroEntityIndex(MyID)
	if ( data.PlayerID != MyID )
		return
	var LearnedAbil =  Entities.GetAbilityByName( MyEnt, data.abilityname )
	if ( LearnedAbil == -1 )
		return
	Range = GetAbilityRange( LearnedAbil )
	if ( data.abilityname == 'attribute_bonus' || Range<=0 )
		return
	if (Game.Particles.AbilityRange[LearnedAbil]){
		Particles.DestroyParticleEffect(Game.Particles.AbilityRange[LearnedAbil],Game.Particles.AbilityRange[LearnedAbil])
		Game.Particles.AbilityRange[LearnedAbil] = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , MyEnt)
		Particles.SetParticleControl(Game.Particles.AbilityRange[LearnedAbil], 1,  [Range,0,0])
	}
	CheckBs = AbilityRangePanel.Children()
	for(c=0;c<CheckBs.length;c++){
		Abil = CheckBs[c].GetAttributeInt('Skill', 0)
		if ( Abil == LearnedAbil )
			return
	}
	var CheckB = $.CreatePanel( "ToggleButton", AbilityRangePanel, "AbilityRangeSkill" )
	CheckB.BLoadLayoutFromString( "<root><styles><include src='s2r://panorama/styles/magadan.css' /><include src='s2r://panorama/styles/dotastyles.vcss_c' /></styles><Panel><ToggleButton class='CheckBox'  style='vertical-align:center;'></ToggleButton><DOTAAbilityImage style='width:30px;margin:30px;border-radius:15px;'/></Panel></root>", false, false)  
	CheckB.Children()[1].abilityname = Abilities.GetAbilityName(LearnedAbil)
	CheckB.SetAttributeInt('Skill', LearnedAbil)
	CheckB.SetPanelEvent( 'onactivate', chkboxpressed )
}

function MapLoaded(data){
	Destroy()
	AbilityRange.checked = false
}

function chkboxpressed(){
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var CheckBs = AbilityRangePanel.Children()
	for(c=0;c<CheckBs.length;c++){
		var Checked = CheckBs[c].Children()[0].checked
		var Abil = CheckBs[c].GetAttributeInt('Skill', 0)
		if (Abil == 0 )
			continue
		if (Checked){
			if (!Game.Particles.AbilityRange[Abil]){
				Game.Particles.AbilityRange[Abil] = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , MyEnt)
				Range = GetAbilityRange( Abil )
				Particles.SetParticleControl(Game.Particles.AbilityRange[Abil], 1,  [Range,0,0])
			}
		}else{
			if (Game.Particles.AbilityRange[Abil]){
				Particles.DestroyParticleEffect(Game.Particles.AbilityRange[Abil],Game.Particles.AbilityRange[Abil])
				delete Game.Particles.AbilityRange[Abil]
			}
		}
	}
}

AbilityRangeF = function(){
	if (AbilityRange.checked){
		var MyID = Game.GetLocalPlayerID()
		if ( MyID==-1 ){
			AbilityRange.checked = false
			Destroy()
			return
		}
		MyEnt = Players.GetPlayerHeroEntityIndex(MyID)
		if ( MyEnt==-1 ){
			AbilityRange.checked = false
			Destroy()
			return
		}
		Game.Panels.AbilityRange = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'AbilityRangePanel' )
		Game.Panels.AbilityRange.BLoadLayoutFromString( "<root><Panel class='AbilityRangePanel' style='flow-children: down;background-color:#00000099;border-radius:15px;padding:20px 0;'></Panel></root>", false, false )
		GameUI.MovePanel(Game.Panels.AbilityRange,function(p){
			var position = Game.Panels.AbilityRange.style.position.split(' ')
			Config.MainPanel.x = position[0]
			Config.MainPanel.y = position[1]
			Game.SaveConfig('abilityrange/config.conf', Config)
		})
		Game.GetConfig('abilityrange/config.conf',function(a){
			Config = a
			Game.Panels.AbilityRange.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
			Game.Panels.AbilityRange.style.flowChildren = Config.MainPanel.flow
		});
		Game.AddCommand( '__AbilityRange_Rotate', function(){
			if (Game.Panels.AbilityRange.style.flowChildren == 'right')
				Game.Panels.AbilityRange.style.flowChildren = 'down'
			else
				Game.Panels.AbilityRange.style.flowChildren = 'right'
			Config.MainPanel.flow = Game.Panels.AbilityRange.style.flowChildren
			Game.SaveConfig('abilityrange/config.conf', Config)
		}, '',0 )
	}else{
		Game.ScriptLogMsg('Script disabled: AbilityRange', '#ff0000')
		Destroy()
		return
	}
	AbilityRangePanel = Game.GetMainHUD().FindChildrenWithClassTraverse( 'AbilityRangePanel' )[0]
	for ( i = 0; i < Entities.GetAbilityCount(MyEnt ); i++){
		Abil = Entities.GetAbility(MyEnt,i)
		if ( Abil == -1 )
			continue
		Range = GetAbilityRange( Abil )
		if (Abilities.GetAbilityName(Abil) == 'attribute_bonus' || Range<=0 )
			continue
		Behavior = Abilities.GetBehavior( Abil )
		CheckB = $.CreatePanel( "ToggleButton", AbilityRangePanel, "AbilityRangeSkill" )
		CheckB.BLoadLayoutFromString( "<root><styles><include src='s2r://panorama/styles/magadan.css' /><include src='s2r://panorama/styles/dotastyles.vcss_c' /></styles><Panel><ToggleButton class='CheckBox'  style='vertical-align:center;'></ToggleButton><DOTAAbilityImage style='width:30px;margin:3px;border-radius:15px;'/></Panel></root>", false, false)  
		CheckB.Children()[1].abilityname = Abilities.GetAbilityName(Abil)
		CheckB.SetAttributeInt('Skill', Abil)
		CheckB.SetPanelEvent( 'onactivate', chkboxpressed )
	}
	Game.Subscribes.AbilityRange.push( GameEvents.Subscribe('game_newmap', MapLoaded) )
	Game.Subscribes.AbilityRange.push( GameEvents.Subscribe('dota_player_learned_ability', SkillLearned) )
	Game.Subscribes.AbilityRange.push( GameEvents.Subscribe('dota_inventory_changed', InventoryChanged) )
	Game.ScriptLogMsg('Script enabled: AbilityRange', '#00ff00')
}
		
var Temp = $.CreatePanel( "Panel", $('#scripts'), "AbilityRange" )
Temp.SetPanelEvent( 'onactivate', AbilityRangeF )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="AbilityRange" text="AbilityRange"/></Panel></root>', false, false)
var AbilityRange = $.GetContextPanel().FindChildTraverse( 'AbilityRange' ).Children()[0]