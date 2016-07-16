/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Панель показывает куллдаун скилов и манакост, 
так же позволяет сотворить заклинание кликом по иконке
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var Config
try{ Game.Panels.InvokerPanel.DeleteAsync(0) }catch(e){}
for (i in Game.Subscribes.InvokerPanel)
	try{ GameEvents.Unsubscribe( Game.Subscribes.InvokerPanel[i] ) }catch(e){}
Game.Subscribes.InvokerPanel = []
Game.Subscribes.InvokerPanel.push( GameEvents.Subscribe('game_newmap', RefreshIPS) )
Game.Subscribes.InvokerPanel.push( GameEvents.Subscribe('player_connect_full', RefreshIPS) )
Game.Subscribes.InvokerPanel.push( GameEvents.Subscribe('player_connect', RefreshIPS) )
Game.Subscribes.InvokerPanel.push( GameEvents.Subscribe('dota_player_pick_hero', RefreshIPS) )
Game.Subscribes.InvokerPanel.push( GameEvents.Subscribe('dota_player_update_hero_selection', RefreshIPS) )


function RefreshIPS(){
	var MyID = Game.GetLocalPlayerID()
	try{ Game.Panels.InvokerPanel.DeleteAsync(0) }catch(e){}
	for (i in Game.Subscribes.InvokerPanel)
		try{ GameEvents.Unsubscribe( Game.Subscribes.InvokerPanel[i] ) }catch(e){}
	Game.Subscribes.InvokerPanel = []
}



InvokerPanelF = function(){
	var MyID = Game.GetLocalPlayerID()
	if ( MyID==-1 ){
		InvokerPanel.checked = false
		try{ Game.Panels.InvokerPanel.DeleteAsync(0) }catch(e){}
		for (i in Game.Subscribes.InvokerPanel)
			try{ GameEvents.Unsubscribe( Game.Subscribes.InvokerPanel[i] ) }catch(e){}
		Game.Subscribes.InvokerPanel = []
		return
	}
	if ( Players.GetPlayerSelectedHero(MyID) != 'npc_dota_hero_invoker' ){
		//Game.ScriptLogMsg('InvokerPanel: Not Invoker', '#ff0000')
		InvokerPanel.checked = false
		try{ Game.Panels.InvokerPanel.DeleteAsync(0) }catch(e){}
		for (i in Game.Subscribes.InvokerPanel)
			try{ GameEvents.Unsubscribe( Game.Subscribes.InvokerPanel[i] ) }catch(e){}
		Game.Subscribes.InvokerPanel = []
		return
	}
	if (InvokerPanel.checked){
		Game.GetFile('Invokerpanel/invokerpanel.xml', function(a){
			Game.Panels.InvokerPanel = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'InvokerPanelMain' )
			Game.Panels.InvokerPanel.BLoadLayoutFromString( a, false, false )
			GameUI.MovePanel(Game.Panels.InvokerPanel,function(p){
				var position = p.style.position.split(' ')
				Config.MainPanel.x = position[0]
				Config.MainPanel.y = position[1]
				Game.SaveConfig('Invokerpanel/config.conf', Config)
			})
			Game.GetConfig('Invokerpanel/config.conf',function(a){
				Config = a[0]
				Game.Panels.InvokerPanel.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
				Game.Panels.InvokerPanel.style.flowChildren = Config.MainPanel.flow
			})
			try{Game.AddCommand( '__InvokerPanel_Rotate', function(){
				if (Game.Panels.InvokerPanel.Children()[0].style.flowChildren == 'right')
					Game.Panels.InvokerPanel.Children()[0].style.flowChildren = 'down'
				else
					Game.Panels.InvokerPanel.Children()[0].style.flowChildren = 'right'
				Config.MainPanel.flow = Game.Panels.InvokerPanel.style.flowChildren
				Game.SaveConfig('Invokerpanel/config.conf', Config)
			}, '',0 )}catch(e){}
		})
		Game.ScriptLogMsg('Script enabled: InvokerPanel', '#00ff00')
	}else{
		try{ Game.Panels.InvokerPanel.DeleteAsync(0) }catch(e){}
		for (i in Game.Subscribes.InvokerPanel)
			try{ GameEvents.Unsubscribe( Game.Subscribes.InvokerPanel[i] ) }catch(e){}
		Game.Subscribes.InvokerPanel = []
	}
}
		
var Temp = $.CreatePanel( "Panel", $('#scripts'), "Invokerpanel" )
Temp.SetPanelEvent( 'onactivate', InvokerPanelF )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="Invokerpanel" text="InvokerPanelV"/></Panel></root>', false, false)
var InvokerPanel = $.GetContextPanel().FindChildTraverse( 'Invokerpanel' ).Children()[0]

RefreshIPS()