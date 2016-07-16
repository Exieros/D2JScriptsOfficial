/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Автоматическое взрывание бочек, 
 отображенние суммарного урона стака мин, 
 автофорсстафф, учет бафов
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

var Config = []
//радиус срабатывания дистанционных мин
var triggerradius = 300
//интервал(в секундах) через который будет делаться проверка
var interval = 0.1
//урон мин
var damageland = [150,190,225,260]
//урон бочек без аганима
var damage = [300,450,600]
//с аганимом
var scepterdamage = [450,600,750]

//бафы, при наличии которых у вражеских героев, мины не будут срабатывать
var IgnoreBuffs = [
	"modifier_abaddon_borrowed_time",
	"modifier_brewmaster_primal_split",
	"modifier_omniknight_repel",
	"modifier_phoenix_supernova_hiding",
	"modifier_tusk_snowball_movement",
	"modifier_tusk_snowball_movement_friendly",
	"modifier_juggernaut_blade_fury",
	"modifier_medusa_stone_gaze",
	"modifier_nyx_assassin_spiked_carapace",
	"modifier_templar_assassin_refraction_absorb",
	"modifier_oracle_false_promise",
	"modifier_dazzle_shallow_grave",
	"modifier_treant_living_armor",
	"modifier_life_stealer_rage",
	"modifier_item_aegis"
]

//де\бафы на вражеских героях, умножающие маг. урон
var DebuffsAddMagicDmg = [
	["modifier_bloodthorn_debuff", 1.3],
	["modifier_orchid_malevolence_debuff", 1.3],
	["modifier_item_mask_of_madness_berserk", 1.25],
	["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]],
	["modifier_ursa_enrage", 0.2],
]

//бафы на вражеских героях, абсорбирующие определенное количество маг урона(не %)
var BuffsAbsorbMagicDmg = [
	["modifier_item_pipe_barrier", 400],
	["modifier_item_hood_of_defiance_barrier", 400],
	["modifier_item_infused_raindrop", 120],
	["modifier_abaddon_aphotic_shield", [110,140,170,200]],
	["modifier_ember_spirit_flame_guard", [50,200,350,500]]
]

//бафы на минере умножающие урон
var BuffsAddMagicDmgForMe = [
	["item_aether_lens", 1.05],
	["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]]
]

//Game.EzTechies.Remotemines = []
if(!Array.isArray(Game.EzTechies)){
	Game.EzTechies = []
	Game.EzTechies.Remotemines = []
}
if(!Array.isArray(Game.EzTechiesLVLUp)){
	Game.EzTechiesLVLUp = []
}

for(i in Game.Particles.EzTechies){
	try{Particles.DestroyParticleEffect(parseInt(Game.Particles.EzTechies[i]),parseInt(Game.Particles.EzTechies[i]))}catch(e){}
}
Game.Particles.EzTechies = []

try{ Game.Panels.EzTechies.DeleteAsync(0) }catch(e){}
try{ GameEvents.Unsubscribe(parseInt(Game.Subscribes.EzTechiesRemoteMinesSpawn)) }catch(e){}
try{ GameEvents.Unsubscribe(parseInt(Game.Subscribes.UltiUp)) }catch(e){}

Game.Subscribes.UltiUp = GameEvents.Subscribe("dota_player_learned_ability", function(a){
	if(a.PlayerID!=Game.GetLocalPlayerID()||a.abilityname!='techies_remote_mines')
		return
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var lvl = Abilities.GetLevel(Entities.GetAbility(MyEnt, 5))
	Game.EzTechiesLVLUp[lvl-1] = Game.GetGameTime()
})

Game.Subscribes.EzTechiesRemoteMinesSpawn = GameEvents.Subscribe('npc_spawned', function(a){
	var ent = parseInt(a.entindex)
	if( Entities.IsEnemy(ent) )
		return
	if(Entities.GetUnitName(ent)=='npc_dota_techies_remote_mine'){
		radius = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , ent)
		Particles.SetParticleControl(radius, 1, [triggerradius,0,0])
		Game.Particles.EzTechies.push(radius)
	}
})

function EzTechiesF(){
	var MyEnt = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var force = Game.GetAbilityByName(MyEnt,'item_force_staff')
	if ( !EzTechies.checked || Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_techies' )
		return
	var Ulti = Entities.GetAbility(MyEnt, 5)
	var UltiLvl = Abilities.GetLevel(Ulti)
	if(UltiLvl==0)
		return
	var HEnts = Game.PlayersHeroEnts()
	for (i in HEnts) {
		var ent = parseInt(HEnts[i])
		var buffsnames = Game.GetBuffsNames(ent)
		if ( !Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent) || Game.IntersecArrays(buffsnames, IgnoreBuffs))
			continue
		var MagicResist = Entities.GetArmorReductionForDamageType( ent, 2 )*100
		var MagicDamagePercent = 100+MagicResist //%
		var buffs = Game.GetBuffs(ent)
		for(m in buffs)
			for(k in DebuffsAddMagicDmg)
				if(Buffs.GetName(ent,buffs[m]) === DebuffsAddMagicDmg[k][0])
					if(Array.isArray(DebuffsAddMagicDmg[k][1]))
						MagicDamagePercent *= DebuffsAddMagicDmg[k][1][Abilities.GetLevel(Buffs.GetAbility(ent,buffs[i]))-1]
					else
						MagicDamagePercent *= DebuffsAddMagicDmg[k][1]
		var buffsme = Game.GetBuffs(MyEnt)
		for(m in buffsme)
			for(k in BuffsAddMagicDmgForMe)
				if(Buffs.GetName(ent,buffsme[m]) === BuffsAddMagicDmgForMe[k][0])
					if(Array.isArray(BuffsAddMagicDmgForMe[k][1]))
						MagicDamagePercent *= BuffsAddMagicDmgForMe[k][1][Abilities.GetLevel(buffsme.GetAbility(ent,buffsme[i]))-1]
					else
						MagicDamagePercent *= BuffsAddMagicDmgForMe[k][1]
		if(MagicDamagePercent==0)
			continue
		for(m in buffs)
			for(k in BuffsAbsorbMagicDmg)
				if(Buffs.GetName(ent,buffs[m]) === BuffsAbsorbMagicDmg[k][0])
					if(Array.isArray(BuffsAbsorbMagicDmg[k][1]))
						MagicDamagePercent -= BuffsAbsorbMagicDmg[k][1][Abilities.GetLevel(buffs.GetAbility(ent,buffs[i]))-1]
					else
						MagicDamagePercent -= BuffsAddMagicDmgForMe[k][1]
		var rmines = []
		var rminessummdmg = 0
		var HP = Entities.GetHealth(ent)
		var mines = Entities.GetAllEntitiesByClassname('npc_dota_techies_mines')
		c:
		for(m in mines){
			var rmine = mines[m]
			if(Entities.GetUnitName(rmine)!='npc_dota_techies_remote_mine')
				continue
			var buffs = Game.GetBuffs(rmine)
			if(buffs.length==0)
				continue
			for(k in buffs)
				if(Buffs.GetName(rmine,buffs[k])=='modifier_techies_deploy_trap')
					continue c;
			for(k in buffs)
				if(Buffs.GetName(rmine,buffs[k])=='modifier_techies_remote_mine')
					var time = Buffs.GetCreationTime(rmine, buffs[k])
			for(z=0;z<=3;z++){
				if(time>Game.EzTechiesLVLUp[z]){
					if(Entities.HasScepter(MyEnt))
						var dmg = scepterdamage[z]-scepterdamage[z]/100*MagicResist
					else
						var dmg = damage[z]-damage[z]/100*MagicResist
					if(Abilities.GetLevel(Entities.GetAbility(MyEnt, 5))==z+1)
						break
				}
			}
			if( Entities.GetRangeToUnit(rmine,ent)>triggerradius || !Entities.IsValidEntity(rmine))
				continue
			else{
				rmines.push(rmine)
				rminessummdmg += dmg
				if(rminessummdmg >= HP)
					break
			}
		}
		//rminessummdmg = rminessummdmg - rminessummdmg/100*MagicResist
		if(rmines.length!=0 || rminessummdmg!=0){
			if ( rminessummdmg >= HP ){
				for(n in rmines){
					var rminesn = parseInt(rmines[n])
					GameUI.SelectUnit(rminesn,false)
					Game.CastNoTarget(rminesn, Entities.GetAbilityByName(rminesn, 'techies_remote_mines_self_detonate'), false)
				}
			}
		}else{
			if(force!=-1 && Entities.GetRangeToUnit(MyEnt,ent)<=800){
				var rmines = []
				var rminessummdmg = 0
				C:
				for(m in mines){
					var rmine = mines[m]
					var buffs = Game.GetBuffs(rmine)
					if(buffs.length==0)
						continue
					for(k in buffs)
						if(Buffs.GetName(rmine,buffs[k])=='modifier_techies_deploy_trap')
							continue C;
					for(k in buffs)
						if(Buffs.GetName(rmine,buffs[k])=='modifier_techies_remote_mine')
							var time = Buffs.GetCreationTime(rmine, buffs[k])
					for(z=0;z<=3;z++){
						if(time>Game.EzTechiesLVLUp[z]){
							if(Entities.HasScepter(MyEnt))
								var dmg = scepterdamage[z]-scepterdamage[z]/100*MagicResist
							else
								var dmg = damage[z]-damage[z]/100*MagicResist
							if(Abilities.GetLevel(Entities.GetAbility(MyEnt, 5))==z+1)
								break
						}
					}
					var zxc = Entities.GetAbsOrigin(ent)
					var zxcm = Entities.GetAbsOrigin(rmine)
					var dforce = 600
					var forward = Entities.GetForward(ent)
					var newzxc = [forward[0]*dforce+zxc[0],forward[1]*dforce+zxc[1],forward[2]*dforce+zxc[2]]
					if(Game.PointDistance(newzxc,zxcm)>triggerradius)
						continue
					else
					{
						rmines.push(rmine)
						rminessummdmg += dmg
						if(rminessummdmg >= HP){
							GameUI.SelectUnit(MyEnt,false)
							Game.CastTarget(MyEnt, force, ent, false)
							break
						}
					}
				}
			}
		}
	}
}
function RefreshR(){
	var mines = Entities.GetAllEntitiesByClassname('npc_dota_techies_mines')
	for(i in Game.Particles.EzTechies){
		Particles.DestroyParticleEffect(parseInt(Game.Particles.EzTechies[i]),parseInt(Game.Particles.EzTechies[i]))
	}
	Game.Particles.EzTechies = []
	for(m in mines){
		var rmine = mines[m]
		if(Entities.GetUnitName(rmine)!='npc_dota_techies_remote_mine')
			continue
		var particle = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW , rmine)
		Particles.SetParticleControl(particle, 1, [triggerradius,0,0])
		Game.Particles.EzTechies.push(particle)
	}	
}

var EzTechiesCheckBoxClick = function(){
	if ( !EzTechies.checked ){
		try{Game.Panels.EzTechies.DeleteAsync(0)}catch(e){}
		for(i in Game.Particles.EzTechies){
			Particles.DestroyParticleEffect(parseInt(Game.Particles.EzTechies[i]),parseInt(Game.Particles.EzTechies[i]))
			}
		Game.Particles.EzTechies = []
		Game.ScriptLogMsg('Script disabled: EzTechies', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_techies' ){
		EzTechies.checked = false
		Game.ScriptLogMsg('EzTechies: Not Techies', '#ff0000')
		return
	}
	RefreshR()
	//циклически замкнутый таймер с проверкой условия с интервалом 'interval'
	Game.Panels.EzTechies = $.CreatePanel( "Panel", Game.GetMainHUD(), "EzTechiesSlider" )
	Game.Panels.EzTechies.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel style="padding:3px;border-radius:5px;width:150px;height:50px;flow-children:down;background-color:#000000EE;"><Slider class="HorizontalSlider" style="width:600px;" direction="horizontal" text="zxc"/><Panel style="flow-children:right;horizontal-align:center;"><Label text="Радиус триггера:" style="font-size:14px;"/><Label text="300" style="color:green;font-size:16px;"/></Panel></Panel></root>', false, false)
	GameUI.MovePanel(Game.Panels.EzTechies,function(p){
		var position = p.style.position.split(' ')
		Config.MainPanel.x = position[0]
		Config.MainPanel.y = position[1]
		Game.SaveConfig('eztechies/config.conf', Config)
	})
	Game.GetConfig('eztechies/config.conf',function(a){
		Config = a
		Game.Panels.EzTechies.style.position = Config.MainPanel.x + ' ' + Config.MainPanel.y + ' 0'
	});
	var slider = []
	Game.Panels.EzTechies.Children()[0].min = 0
	Game.Panels.EzTechies.Children()[0].max = 500
	Game.Panels.EzTechies.Children()[0].value = triggerradius
	Game.Panels.EzTechies.Children()[0].lastval = Game.Panels.EzTechies.Children()[0].value
	function x(){ $.Schedule( 0.1,function(){
		if(Game.Panels.EzTechies.Children()[0].value!=Game.Panels.EzTechies.Children()[0].lastval){
			triggerradius=Game.Panels.EzTechies.Children()[0].value
			Game.Panels.EzTechies.Children()[1].Children()[1].text = Math.floor(triggerradius)
			RefreshR()
		}
		Game.Panels.EzTechies.Children()[0].lastval=Game.Panels.EzTechies.Children()[0].value
		if(EzTechies.checked)
			x() 
		}
	)}
	x()
	function f(){ $.Schedule( interval,function(){
		EzTechiesF()
		if(EzTechies.checked)
			f()
		}
	)}
	f()
	Game.ScriptLogMsg('Script enabled: EzTechies', '#00ff00')
}

//шаблонное добавление чекбокса в панель
var Temp = $.CreatePanel( "Panel", $('#scripts'), "EzTechies" )
Temp.SetPanelEvent( 'onactivate', EzTechiesCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="EzTechies" text="EzTechies"/></Panel></root>', false, false)  
var EzTechies = $.GetContextPanel().FindChildTraverse( 'EzTechies' ).Children()[0]