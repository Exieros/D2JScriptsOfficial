/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Выкладывает все предметы дающие запас маны,
использует арканы или соулринг и собирает обратно.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/
var ping = 0.25

var AbuseManaItems = [
	"item_arcane_boots",
	"item_guardian_greaves",
	"item_soul_ring"
]

Game.Functions.ManaAbuseF = function(){
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var XYZ = Entities.GetAbsOrigin( MyEnt )
	var uix = Game.WorldToScreenX( XYZ[0], XYZ[1], (XYZ[2]) )
	var uiy = Game.WorldToScreenY( XYZ[0], XYZ[1], (XYZ[2]) )
	var Inv = Game.GetInventory(MyEnt)
	var DropItems = []
	for(key in Inv){
		var Item = parseInt(Inv[key])
		var ItemName = Abilities.GetAbilityName( Item )
		var ManaPool = 0
		ManaPool += Abilities.GetSpecialValueFor( Item, 'bonus_int' )
		ManaPool += Abilities.GetSpecialValueFor( Item, 'bonus_intellect' )
		ManaPool += Abilities.GetSpecialValueFor( Item, 'bonus_all_stats' )
		ManaPool += Abilities.GetSpecialValueFor( Item, 'bonus_mana' )
		if(ManaPool>0&&AbuseManaItems.indexOf(ItemName)==-1){
			Game.DropItem(MyEnt,Item,XYZ,false)
			DropItems.push(Item)
		}
	}
	for(key in Inv){
		var Item = parseInt(Inv[key])
		var ItemName = Abilities.GetAbilityName( Item )
		if(AbuseManaItems.indexOf(ItemName)!=-1)
			Game.CastNoTarget(MyEnt,Item,false)
	}
	$.Schedule(ping,function(){
		var EntsOnCursor = GameUI.FindScreenEntities( [uix,uiy] )
		for(key in EntsOnCursor){
			var Item = parseInt(EntsOnCursor[key].entityIndex)
			Game.PuckupItem(MyEnt,Item,true)
		}
	})
	
}
GameEvents.Subscribe('game_newmap', function(){
	Game.Functions.ManaAbuse=true
	Game.AddCommand("__ManaAbuse", Game.Functions.ManaAbuseF, "", 0)
})
if(!Game.Functions.ManaAbuse){
	Game.Functions.ManaAbuse = true
	Game.AddCommand("__ManaAbuse", Game.Functions.ManaAbuseF, "", 0)
}