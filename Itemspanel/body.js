/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Отображает панель вражеского инвентаря.
Уведомляет при появлении важного предмета.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

try{ Game.Panels.ItemsPanel01.DeleteAsync(0) }catch(e){}
var Config = []
Config.MainPanel = []
Config.Items = []
Game.ItemsPanelItems = []

function NewItem(oldinv, newinv, ent){
	for(i in newinv){
		n = newinv[i]
		if ( oldinv.indexOf(n)==-1 && Config.Items.indexOf(Abilities.GetAbilityName(n))!= -1 ){
			if(Config.Notify=="true"){
				A = $.CreatePanel( 'Panel', Game.Panels.ItemsPanel01, 'Alert'+ent+n )
				A.BLoadLayoutFromString( '<root><Panel style="width:100%;height:37px;background-color:#111;"><DOTAHeroImage heroname="" style="vertical-align:center;width:60px;height:35px;position:160px;"/><Image src="s2r://panorama/images/hud/button_courier_greenarrow_png.vtex" style="horizontal-align:center;vertical-align:center;" /><DOTAItemImage itemname="" style="vertical-align:center;width:60px;height:35px;position:20px;"/></Panel></root>', false, false )
				A.Children()[0].heroname = Entities.GetUnitName(ent)
				A.Children()[2].itemname = Abilities.GetAbilityName(n)
				A.DeleteAsync( parseInt( Config.NotifyTime ) )
			}
			if (Config.EmitSound=="true")
				Game.EmitSound( 'General.Buy' )
		}
	}
}

function ItemsPanel01Every(){
	if ( !ItemsPanel01.checked ){
		Game.ItemsPanelItems = []
		try{ Game.Panels.ItemsPanel01.DeleteAsync(0) }catch(e){}
		return
	}
	if(Game.GetState()!=7 && Game.GetState()!=6){
		try{ Game.Panels.ItemsPanel01.DeleteAsync(0) }catch(e){}
		Game.ItemsPanelItems = []
		ItemsPanel01.checked = false
		return
	}
	var ents = Game.PlayersEnemyHeroEnts()
	for(m in ents){
		var Ent = ents[m]
		var P = Game.Panels.ItemsPanel01.Children()[m]
		if(P.Children()[0].heroname!=Entities.GetUnitName(Ent))
			P.Children()[0].heroname=Entities.GetUnitName(Ent)
		var Inv = Game.GetInventory(Ent)
		if ( Array.isArray(Game.ItemsPanelItems[Ent])){
			if ( Game.CompareArrays(Game.ItemsPanelItems[Ent],Inv) )
				continue
		}else
			Game.ItemsPanelItems[Ent] = []
		NewItem(Game.ItemsPanelItems[Ent],Inv,Ent)
		Game.ItemsPanelItems[Ent]=Inv
		for(z = 1;z<=6;z++){
			P.Children()[z].itemname = Abilities.GetAbilityName( Entities.GetItemInSlot( Ent, z-1 ) )
		}
	}
}

var ItemsPanel01Load = function(){
	Game.GetFile('itemspanel/panel.xml', function(a){
		Game.Panels.ItemsPanel01 = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'ItemsPanel1' )
		Game.Panels.ItemsPanel01.BLoadLayoutFromString( a, false, false )
		GameUI.MovePanel(Game.Panels.ItemsPanel01,function(p){
			var position = p.style.position.split(' ')
			Config.MainPanel.x = position[0]
			Config.MainPanel.y = position[1]
			Game.SaveConfig('itemspanel/config.conf', Config)
		})
		
		Game.GetConfig('itemspanel/config.conf',function(a){
			Config = a
			Game.Panels.ItemsPanel01.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
		});
		function f(){ $.Schedule( 0.5,function(){
			if (ItemsPanel01.checked){
				ItemsPanel01Every()
				f()
			}
		})}
		f()
	});
}

function ItemsPanel01LoadOnOff(){
	if ( !ItemsPanel01.checked ){
		Game.ItemsPanelItems = []
		try{ Game.Panels.ItemsPanel01.DeleteAsync(0) }catch(e){}
		Game.ScriptLogMsg('Script disabled: ItemsPanel', '#ff0000')
		
	}else{
		ItemsPanel01Load()
		Game.ScriptLogMsg('Script enabled: ItemsPanel', '#00ff00')
	}
}

var Temp = $.CreatePanel( "Panel", $('#scripts'), "ItemsPanel01" )
Temp.SetPanelEvent( 'onactivate', ItemsPanel01LoadOnOff )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="ItemsPanel01" text="ItemsPanel"/></Panel></root>', false, false)  
var ItemsPanel01 = $.GetContextPanel().FindChildTraverse( 'ItemsPanel01' ).Children()[0]