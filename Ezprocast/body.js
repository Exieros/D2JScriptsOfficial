/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Самостоятельно комбинирование прокастов
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

try{Game.Panels.EzProcast.DeleteAsync(0)}catch(e){}
	
var Config = []

Game.Functions.EzProcastF = function(){
		var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
		var EntOnCursor = GameUI.FindScreenEntities( GameUI.GetCursorPosition() )
		var CursorXYZ = Game.ScreenXYToWorld( GameUI.GetCursorPosition()[0],GameUI.GetCursorPosition()[1] )
		var items = Game.Panels.EzProcast.Children()[2].Children()
		var abils = []
		for(i in items){
			if(items[i].Children()[0].paneltype=='DOTAAbilityImage'){
				abils.push(items[i].Children()[0].abilityname)
			
			}else if(items[i].Children()[0].paneltype=='DOTAItemImage'){
				abils.push(items[i].Children()[0].itemname)
			}
		}
		$.Msg('Abils: '+abils)
		Game.EntStop(MyEnt, false)
		for(i in abils){
			var AbName = abils[i]
			var Abil = Game.GetAbilityByName(MyEnt,abils[i])
			var EzPBeh = Game.Behaviors( Abil )
			var EzPDUTT = Abilities.GetAbilityTargetTeam( Abil )
			var myxyz = Entities.GetAbsOrigin(MyEnt)
			$.Msg('Team Target: '+EzPDUTT)
			$.Msg('Ability Behavior: '+EzPBeh)
			if(EzPBeh.indexOf(512)!=-1){
				Game.ToggleAbil(MyEnt, Abil, true)
				continue
				
			}else if(EzPBeh.indexOf(4)!=-1){

				Game.CastNoTarget(MyEnt, Abil, true)
				continue
				
			}else if(EzPBeh.indexOf(16)!=-1){
				$.Msg(Game.PointDistance(CursorXYZ,myxyz))
				if(AbName=="item_blink" && Game.PointDistance(CursorXYZ,myxyz)<=400)
					continue
				Game.CastPosition(MyEnt, Abil, CursorXYZ, true)
				continue
				
			}else if(AbName=="item_ethereal_blade" || AbName=="item_diffusal_blade" || AbName=="item_diffusal_blade_2"){
				
				if( EntOnCursor.length!=0 && Entities.IsEnemy(EntOnCursor[0].entityIndex ))
					Game.CastTarget(MyEnt, Abil, EntOnCursor[0].entityIndex, true)
				else
					Game.CastTarget(MyEnt, Abil, MyEnt, true)
				
			}else if(EzPBeh.indexOf(8)!=-1 || EzPBeh.length == 0 ){
				
				if( parseInt(EzPDUTT)==3 || parseInt(EzPDUTT)==1 ){
					Game.CastTarget(MyEnt, Abil, MyEnt, true)
				}else if( parseInt(EzPDUTT)==4  || parseInt(EzPDUTT)==7 ){
					Game.CastTarget(MyEnt, Abil, MyEnt, true)
				}else if( parseInt(EzPDUTT)==2 ){
					Game.CastTarget(MyEnt, Abil, EntOnCursor[0].entityIndex, true)
				}
				
			}
		}
	}

var MyInv = []
function UpdateUnv(){
	if (!EzProcast.checked)
		return
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Inv = Game.GetInventory(MyEnt)
	if(Game.CompareArrays(MyInv,Inv)){
		
		return
	}
	MyInv = Inv
	try{Game.Panels.EzProcast.Children()[0].RemoveAndDeleteChildren()}catch(e){}
	var AbC = Entities.GetAbilityCount(MyEnt)
	for(i=0;i<AbC;i++){
		var Ab = Entities.GetAbility( MyEnt, i )
		if( !Abilities.IsDisplayedAbility(Ab) || Abilities.IsPassive(Ab) )
			continue
		var P = $.CreatePanel( 'Panel', Game.Panels.EzProcast.Children()[0], 'EzProcast1Items' )
		P.BLoadLayoutFromString( '<root><script>function Add(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[2]);$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[0]);$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Add()"><DOTAAbilityImage /></Panel></root>', false, false )
		P.Children()[0].abilityname = Abilities.GetAbilityName( Ab )
	}
	for(i in Inv){
		Behaviors = Game.Behaviors(Inv[i])
		if( Behaviors.indexOf(2)!=-1 )
			continue
		var P = $.CreatePanel( 'Panel', Game.Panels.EzProcast.Children()[0], 'EzProcast1Items2' )
		P.BLoadLayoutFromString( '<root><script>function Add(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[2]);$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[0]);$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Add()"><DOTAItemImage /></Panel></root>', false, false )
		P.Children()[0].itemname = Abilities.GetAbilityName( Inv[i] )
	}
}

EzProcastOnOffLoad = function(){
	Game.GetFile('ezprocast/panel.xml', function(a){
		Game.Panels.EzProcast = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'EzProcast1' )
		Game.Panels.EzProcast.BLoadLayoutFromString( a, false, false )
		GameUI.MovePanel(Game.Panels.EzProcast,function(p){
			var position = p.style.position.split(' ')
			Config.MainPanel.x = position[0]
			Config.MainPanel.y = position[1]
			Game.SaveConfig('ezprocast/config.conf', Config)
		})
		Game.GetConfig('ezprocast/config.conf',function(a){
			Config = a
			Game.Panels.EzProcast.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
		});
		var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
		var AbC = Entities.GetAbilityCount( MyEnt )
		for(i=0;i<AbC;i++){
			var Ab = Entities.GetAbility( MyEnt, i )
			if( !Abilities.IsDisplayedAbility(Ab) || Abilities.IsPassive(Ab) )
				continue
			var P = $.CreatePanel( 'Panel', Game.Panels.EzProcast.Children()[0], 'EzProcast1Items' )
			P.BLoadLayoutFromString( '<root><script>function Add(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[2]);$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[0]);$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Add()"><DOTAAbilityImage /></Panel></root>', false, false )
			P.Children()[0].abilityname = Abilities.GetAbilityName( Ab )
		}
		var Inv = Game.GetInventory(MyEnt)
		for(i in Inv){
			Behaviors = Game.Behaviors(Inv[i])
			if( Behaviors.indexOf(2)!=-1 )
				continue
			var P = $.CreatePanel( 'Panel', Game.Panels.EzProcast.Children()[0], 'EzProcast1Items2' )
			P.BLoadLayoutFromString( '<root><script>function Add(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[2]);$.GetContextPanel().SetPanelEvent("onactivate", Rem)}function Rem(){Parent=$.GetContextPanel().GetParent().GetParent();$.GetContextPanel().SetParent(Parent.Children()[0]);$.GetContextPanel().SetPanelEvent("onactivate", Add)}</script><Panel style="border: 1px solid #000; border-radius: 10px;" onactivate="Add()"><DOTAItemImage /></Panel></root>', false, false )
			P.Children()[0].itemname = Abilities.GetAbilityName( Inv[i] )
		}
	});
}

function EzProcastOnOff(){
	if ( !EzProcast.checked ){
		try{
			Game.Panels.EzProcast.DeleteAsync(0)
		}catch(e){}
		Game.ScriptLogMsg('Script disabled: EzProcast-V0.1', '#ff0000')
		
	}else{
		EzProcastOnOffLoad()
		function L(){ $.Schedule( 0,function(){
			if (EzProcast.checked){
				UpdateUnv()
			}
			L()
		})}
		L()
		GameEvents.Subscribe('game_newmap', function(){
			Game.Functions.EzProcast = false
			Game.Functions.EzProcast = false
		})
		if(!Game.Functions.EzProcast){
			Game.Functions.EzProcast = true
			Game.AddCommand("__EzProcast", Game.Functions.EzProcastF, "", 0)
		}
		Game.ScriptLogMsg('Script enabled: EzProcast-V0.1', '#00ff00')
	}
}
var EzProcast = Game.AddScript(1,"EzProcast",EzProcastOnOff)