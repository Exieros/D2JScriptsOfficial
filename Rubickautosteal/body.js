/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Автостил спеллов при игре за рубика.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

try{
	Game.Panels.RubickAutoSteal.DeleteAsync(0)
}catch(e){}

var interval = 0.1
var LenseBonusRange = 200
var flag = false
var StealIfThere = true
var LastSpells = {}
var Config = []

function RubickAutoStealF(){
	if ( !RubickAutoSteal.checked ){
		try{
			Game.Panels.RubickAutoSteal.DeleteAsync(0)
		}catch(e){}
		return
	}
	if(flag)
		return
	var AbPanel = Game.Panels.RubickAutoSteal.Children()
	var z = []
	for(i in AbPanel)
		if(AbPanel[i].style.opacity==1 || AbPanel[i].style.opacity==null)
			z.push(AbPanel[i].Children()[0].abilityname)
	var MyEnt = parseInt( Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()) )
	var Ulti = Entities.GetAbilityByName(MyEnt, 'rubick_spell_steal' )
	var UltiRange = Abilities.GetCastRange( Ulti )
	if(Entities.HasItemInInventory( MyEnt, 'item_aether_lens'))
		UltiRange+=LenseBonusRange
	var UltiLvl = Abilities.GetLevel(Ulti)
	var UltiCd = Abilities.GetCooldownTimeRemaining( Ulti )
	if(UltiLvl==0)
		return
	var HEnts = Game.PlayersHeroEnts()
	for(i in LastSpells)
		if(HEnts.indexOf(i)==-1)
			LastSpells[i]=-1
	for (i in HEnts) {
		ent = parseInt(HEnts[i])
		if( !Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent))
			continue
		var Range = Entities.GetRangeToUnit(MyEnt, ent)
		if(Range>UltiRange)
			continue
		var Count = Entities.GetAbilityCount( ent )
		for(i=0;i<Count;i++){
			var ab = Entities.GetAbility( ent, i )
			var lvl = Abilities.GetLevel( ab )
			if(lvl==-1 || !Abilities.IsDisplayedAbility(ab) || Abilities.IsPassive(ab) )
				continue
			var name = Abilities.GetAbilityName( ab )
			if(z.indexOf(name)==-1)
				continue
			var cd = Abilities.GetCooldownTimeRemaining( ab )
			var cda = Abilities.GetCooldown( ab )
			var me = Entities.GetAbilityByName(MyEnt, name)
			if(me!=-1 && !StealIfThere)
				continue
			if( Math.ceil(cd)==cda && cda!=0 ){
				LastSpells[ent] = ab
			}
			if(LastSpells[ent]>0){
				flag = true
				$.Schedule(0.3,function(){ flag=false })
				GameUI.SelectUnit(MyEnt,false)
				Game.EntStop(MyEnt, false)
				Game.CastTarget(MyEnt, Ulti, ent, false)
			}
		}
	}
}
function RubickAutoStealCreatePanel(){
	Game.Panels.RubickAutoSteal = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'RubickAutoStealAbilities' )
	Game.Panels.RubickAutoSteal.BLoadLayoutFromString( '<root><Panel style="border: 1px solid #000;background-color:#000000EE;flow-children:down-wrap;max-width:200px;border-radius:10px;padding:5px 3px;" onactivate="Add()"></Panel></root>', false, false )
	GameUI.MovePanel(Game.Panels.RubickAutoSteal,function(p){
		var position = p.style.position.split(' ')
		Config.MainPanel.x = position[0]
		Config.MainPanel.y = position[1]
		Game.SaveConfig('rubickautosteal/config.conf', Config)
	})
	Game.GetConfig('rubickautosteal/config.conf',function(a){
		
		Config = a
		Game.Panels.RubickAutoSteal.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
	});
	var HEnts = Game.PlayersHeroEnts()
	for (i in HEnts) {
		ent = parseInt(HEnts[i])
		if(!Entities.IsEnemy(ent))
			continue
		var Count = Entities.GetAbilityCount( ent )
		for(i=0;i<Count;i++){
			var ab = Entities.GetAbility( ent, i )
			if(!Abilities.IsDisplayedAbility(ab) || Abilities.IsPassive(ab) || Abilities.GetCooldown(ab)==0 )
				continue
			var name = Abilities.GetAbilityName( ab )
			var Item = $.CreatePanel( 'Panel', Game.Panels.RubickAutoSteal, 'RubickAutoStealAbilities' )
			//Item.BLoadLayoutFromString( '<root><Panel><DOTAAbilityImage style="width:35px;"/></Panel></root>', false, false )
			Item.BLoadLayoutFromString( '<root><script>function Add(){$.GetContextPanel().style.opacity="0.1";$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){$.GetContextPanel().style.opacity="1.0";$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Rem()"><DOTAAbilityImage style="width:35px;"/></Panel></root>', false, false )
			Item.style.opacity = 0.1
			Item.Children()[0].abilityname=name
		}
	}
}

var RubickAutoStealOnCheckBoxClick = function(){
	if ( !RubickAutoSteal.checked ){
		try{
			Game.Panels.RubickAutoSteal.DeleteAsync(0)
		}catch(e){}
		Game.ScriptLogMsg('Script disabled: RubickAutoSteal', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_rubick' ){
		RubickAutoSteal.checked = false
		Game.ScriptLogMsg('RubickAutoSteal: Not Rubick', '#ff0000')
		return
	}
	//циклически замкнутый таймер с проверкой условия с интервалом 'interval'
	function f(){ $.Schedule( interval,function(){
		RubickAutoStealF()
		if(RubickAutoSteal.checked)
			f()
	})}
	f()
	RubickAutoStealCreatePanel()
	Game.ScriptLogMsg('Script enabled: RubickAutoSteal', '#00ff00')
}

//шаблонное добавление чекбокса в панель
var Temp = $.CreatePanel( "Panel", $('#scripts'), "RubickAutoSteal" )
Temp.SetPanelEvent( 'onactivate', RubickAutoStealOnCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="RubickAutoSteal" text="RubickAutoSteal"/></Panel></root>', false, false)  
var RubickAutoSteal = $.GetContextPanel().FindChildTraverse( 'RubickAutoSteal' ).Children()[0]