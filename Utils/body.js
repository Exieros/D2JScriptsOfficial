/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Описание базовых функций для других скриптов
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

//загрузка произвольного файла с сервера будь то конфиг или xml. Учитывайте, что это асинхронная функция, потому она не возвращает результат мгновенно.
//Пример использования: var test; Game.GetFile('папка_файла.xml', function(a){ test = a });
Game.GetFile = function(file, callback){
	$.AsyncWebRequest(
		'http://127.0.0.1:8083/'+file+'?nocache='+Game.Time(),
		{
			type: 'GET',
			dataType: 'text',
			contentType: 'application/json',
			cache: false,
			success: function(a){
				callback(a)
			}
		}
	)
}
//загрузка конфига в json - спецификации
Game.GetConfig = function(config, callback){
	$.AsyncWebRequest(
		'http://127.0.0.1:8083/'+config+'?nocache='+Game.Time(),
		{
			type: 'GET',
			dataType: 'text',
			contentType: 'application/json',
			cache: false,
			success: function(a){
				callback(JSON.parse(a))
			}
		}
	)
}

//сохранение конфига в json - спецификации
Game.SaveConfig = function(config, json){
	$.AsyncWebRequest(
        'http://127.0.0.1:8083', 
        {
            type: 'POST',
			dataType: 'json',
			data: {
				'writefile':config,
				'data':JSON.stringify(json)
			},
			contentType: 'text/html',
			success: function(a){
				$.Msg('Config saved.')
			}
        }
	)
}


//Таймер. Лучше использовать $.Schedule() если это возможно
Game.Every = function(start, time, tick, func){var startTime = Game.Time();var tickRate = tick;if(tick < 1){if(start < 0) tick--;tickRate = time / -tick;}var tickCount =  time/ tickRate;if(time < 0){tickCount = 9999999;}var numRan = 0;$.Schedule(start, (function(start,numRan,tickRate,tickCount){return function(){if(start < 0){start = 0;if(func()){return;}; }  var tickNew = function(){numRan++;delay = (startTime+tickRate*numRan)-Game.Time();if((startTime+tickRate*numRan)-Game.Time() < 0){delay = 0;}$.Schedule(delay, function(){if(func()){return;};tickCount--;if(tickCount > 0) tickNew();});};tickNew();}})(start,numRan,tickRate,tickCount));};

//глобальные массивы для хранения объектов, которые могут остаться в старой области видимости при перезагрузке скрипта
if(!Array.isArray(Game.Particles))
	Game.Particles = []
if(!Array.isArray(Game.Panels))
	Game.Panels = []
if(!Array.isArray(Game.Functions))
	Game.Functions = []
if(Array.isArray(Game.Subscribes)){
	for(i in Game.Subscribes){
		if ( typeof Game.Subscribes[i] === 'number' )
			try{ GameEvents.Unsubscribe(Game.Subscribes[i]) }catch(e){}
		else if( typeof Game.Subscribes[i] === 'object' ){
			for(m in Game.Subscribes[i])
				try{ GameEvents.Unsubscribe(Game.Subscribes[i][m]) }catch(e){}
		}
	}
}
Game.Subscribes = []


/*         ФУНКЦИИ ДЛЯ РАБОТЫ С UI     */         
//сообщение в боковую панель
Game.ScriptLogMsg = function(msg, color){
	var ScriptLog = $('#ScriptLog')
	var ScriptLogMessage = $.CreatePanel( "Label", ScriptLog, "ScriptLogMessage" )
	ScriptLogMessage.BLoadLayoutFromString( "<root><Label /></root>", false, false)
	ScriptLogMessage.style.fontSize = '15px'
	var text = '	•••	' + msg
	ScriptLogMessage.text = text
	if (color){
		ScriptLogMessage.style.color = color
		ScriptLogMessage.style.textShadow = '0px 0px 4px 1.2 ' + color + '33';
	}
	ScriptLogMessage.DeleteAsync(7)
	Game.AnimatePanel( ScriptLogMessage, {"opacity": "0;"}, 2, "linear", 4)
}
//Функция делает панельку перемещаемой кликом мыши по ней. callback нужен например для того, чтобы сохранить координаты панели в файл
GameUI.MovePanel = function(a, callback){
	var e = function(){
		if (!GameUI.IsControlDown())
			return
		var color = a.style.backgroundColor
		a.style.backgroundColor = '#FFFF00FF'
		var uiw = Game.GetMainHUD().actuallayoutwidth
		var uih = Game.GetMainHUD().actuallayoutheight
		linkpanel = function(){
			a.style.position = (GameUI.GetCursorPosition()[0]/uiw*100) + '% ' + (GameUI.GetCursorPosition()[1]/uih*100) + '% ' + '0'
			if (GameUI.IsMouseDown( 0 )){
				Game.DTick(linkpanel)
				a.SetPanelEvent('onactivate', e)
				a.style.backgroundColor = color
				callback(a)
			}
		}
		Game.Tick(linkpanel)
	}
	a.SetPanelEvent( 'onactivate', e)
}
//добавление чекбокса в список скриптов
Game.AddScript = function(type,name,callback){
	if(type==1){
		var Temp = $.CreatePanel( "Panel", $('#scripts'), name )
		Temp.SetPanelEvent( 'onactivate', callback )
		Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="'+name+'" text="'+name+'"/></Panel></root>', false, false)
		return $.GetContextPanel().FindChildTraverse(name).Children()[0]
	}
	$("#scripts").Children().sort(function(a,b){
		if (a.text > b.text) return 1;
		if (a.text < b.text) return -1;
	})
}
//нахождение главного родительского HUD`a
Game.GetMainHUD = function(){
	var globalContext=$.GetContextPanel()
	while(true){
		if(globalContext.paneltype == "DOTAHud"){
			break
		}else{
			globalContext = globalContext.GetParent()
		}
	}
	return globalContext
}
//анимирование панелей. Источник moddota.com
var AnimatePanel_DEFAULT_DURATION = "300.0ms";
var AnimatePanel_DEFAULT_EASE = "linear";
Game.AnimatePanel = function(panel, values, duration, ease, delay)
{
	var durationString = (duration != null ? parseInt(duration * 1000) + ".0ms" : AnimatePanel_DEFAULT_DURATION);
	var easeString = (ease != null ? ease : AnimatePanel_DEFAULT_EASE);
	var delayString = (delay != null ? parseInt(delay * 1000) + ".0ms" : "0.0ms"); 
	var transitionString = durationString + " " + easeString + " " + delayString;
	var i = 0;
	var finalTransition = ""
	for (var property in values)
	{
		finalTransition = finalTransition + (i > 0 ? ", " : "") + property + " " + transitionString;
		i++;
	}
	panel.style.transition = finalTransition + ";";
	for (var property in values)
		panel.style[property] = values[property];
}
/*         END       */ 


//получение высоты полоски hp у героев
Game.HBOffsets={"npc_dota_hero_lone_druid": 145, 
"npc_dota_hero_huskar": 170, "npc_dota_hero_drow_ranger": 130, "npc_dota_hero_pugna": 140, "npc_dota_hero_naga_siren": 180, "npc_dota_hero_wisp": 160, "npc_dota_hero_vengefulspirit": 170, "npc_dota_hero_ogre_magi": 180, "npc_dota_hero_sand_king": 130, "npc_dota_hero_slardar": 140, "npc_dota_hero_jakiro": 280, "npc_dota_hero_windrunner": 160, "npc_dota_hero_tiny": 165, "npc_dota_hero_morphling": 140, "npc_dota_hero_lycan": 220, "npc_dota_hero_medusa": 200, "npc_dota_hero_enigma": 220, "npc_dota_hero_oracle": 240, "npc_dota_hero_razor": 230, "npc_dota_hero_shredder": 250, "npc_dota_hero_clinkz": 144, "npc_dota_hero_templar_assassin": 180, "npc_dota_hero_riki": 115, "npc_dota_hero_magnataur": 220, "npc_dota_hero_skeleton_king": 190, "npc_dota_hero_slark": 140, "npc_dota_hero_weaver": 110, "npc_dota_hero_abaddon": 175, "npc_dota_hero_puck": 165, "npc_dota_hero_antimage": 140, "npc_dota_hero_legion_commander": 200, "npc_dota_hero_bane": 235, "npc_dota_hero_kunkka": 150, "npc_dota_hero_pudge": 180, "npc_dota_hero_arc_warden": 160, "npc_dota_hero_abyssal_underlord": 200, "npc_dota_hero_winter_wyvern": 200, "npc_dota_hero_ancient_apparition": 190, "npc_dota_hero_techies": 150, "npc_dota_hero_phoenix": 240, "npc_dota_hero_life_stealer": 130, "npc_dota_hero_faceless_void": 150, "npc_dota_hero_venomancer": 150, "npc_dota_hero_earthshaker": 155, "npc_dota_hero_enchantress": 180, "npc_dota_hero_undying": 250, "npc_dota_hero_earth_spirit": 200, "npc_dota_hero_mirana": 155, "npc_dota_hero_keeper_of_the_light": 230, "npc_dota_hero_lina": 170, "npc_dota_hero_tusk": 190, "npc_dota_hero_bristleback": 200, "npc_dota_hero_centaur": 220, "npc_dota_hero_troll_warlord": 200, "npc_dota_hero_visage": 180, "npc_dota_hero_phantom_lancer": 190, "npc_dota_hero_spirit_breaker": 160, "npc_dota_hero_elder_titan": 200, "npc_dota_hero_rattletrap": 130, "npc_dota_hero_nevermore": 250, "npc_dota_hero_dazzle": 160, "npc_dota_hero_tidehunter": 190, "npc_dota_hero_disruptor": 200, "npc_dota_hero_rubick": 170, "npc_dota_hero_terrorblade": 280, "npc_dota_hero_batrider": 240, "npc_dota_hero_treant": 260, "npc_dota_hero_phantom_assassin": 180, "npc_dota_hero_meepo": 125, "npc_dota_hero_brewmaster": 140, "npc_dota_hero_night_stalker": 165, "npc_dota_hero_luna": 185, "npc_dota_hero_lion": 170, "npc_dota_hero_beastmaster": 180, "npc_dota_hero_axe": 160, "npc_dota_hero_juggernaut": 170, "npc_dota_hero_shadow_demon": 175, "npc_dota_hero_obsidian_destroyer": 350, "npc_dota_hero_spectre": 180, "npc_dota_hero_silencer": 130, "npc_dota_hero_bounty_hunter": 120, "npc_dota_hero_zuus": 130, "npc_dota_hero_invoker": 170, "npc_dota_hero_omniknight": 145, "npc_dota_hero_alchemist": 200, "npc_dota_hero_furion": 180, "npc_dota_hero_crystal_maiden": 135, "npc_dota_hero_gyrocopter": 240, "npc_dota_hero_broodmother": 120, "npc_dota_hero_doom_bringer": 240, "npc_dota_hero_ursa": 150, "npc_dota_hero_chen": 190, "npc_dota_hero_death_prophet": 200, "npc_dota_hero_bloodseeker": 130, "npc_dota_hero_shadow_shaman": 130, "npc_dota_hero_storm_spirit": 170, "npc_dota_hero_dark_seer": 130, "npc_dota_hero_queenofpain": 145, "npc_dota_hero_sniper": 110, "npc_dota_hero_lich": 225, "npc_dota_hero_skywrath_mage": 300, "npc_dota_hero_necrolyte": 160, "npc_dota_hero_warlock": 195, "npc_dota_hero_nyx_assassin": 200, "npc_dota_hero_sven": 150, "npc_dota_hero_dragon_knight": 170, "npc_dota_hero_tinker": 150, "npc_dota_hero_leshrac": 170, "npc_dota_hero_ember_spirit": 200, "npc_dota_hero_witch_doctor": 150, "npc_dota_hero_chaos_knight": 220, "npc_dota_hero_viper": 210}

//приказ герою переместится в точку с координатами [x,y,z]
Game.MoveTo = function(ent, xyz, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION
	order.UnitIndex = ent
	order.Position = xyz;   
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order );
}

//каст способности или айтема на цель
Game.CastTarget = function(ent, abil, target, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
	order.UnitIndex = ent
	order.TargetIndex  = target
	order.AbilityIndex = abil
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order );
}

//атаковать
Game.AttackTarget = function(ent, target, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET 
	order.UnitIndex = ent
	order.TargetIndex  = target
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order );
}

//атаковать в точку
Game.AttackPoint = function(ent, xyz, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET 
	order.UnitIndex = ent
	order.Position = xyz
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order );
}

//каст способности или айтема в точку (sunstrike)
Game.CastPosition = function(ent, abil, xyz, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
	order.UnitIndex = ent
	order.Position = xyz
	order.AbilityIndex = abil
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//каст notarget способности или айтема
Game.CastNoTarget = function(ent, abil, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
	order.UnitIndex = ent
	order.AbilityIndex = abil
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//переключение способности
Game.ToggleAbil = function(ent, abil, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE
	order.UnitIndex = ent
	order.AbilityIndex = abil
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//приказ остановиться
Game.EntStop = function(ent, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_STOP 
	order.UnitIndex = ent
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//разобрать артефакт
Game.DisassembleItem = function(ent, item, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM 
	order.UnitIndex = ent
	order.AbilityIndex = item
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//разобрать артефакт
Game.DropItem = function(ent, item, xyz, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM
	order.UnitIndex = ent
	order.Position = xyz
	order.AbilityIndex = item
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//поднять артефакт
Game.PuckupItem = function(ent, item, queue){
	var order = {};
	order.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM 
	order.UnitIndex = ent
	order.TargetIndex  = item
	order.Queue = queue
	order.ShowEffects = false
	Game.PrepareUnitOrders( order )
}

//Получение расстояния между двумя точками в пространстве, высшая математика епта
Game.PointDistance = function(a,b){
	return Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))
}

//"округление" числа до определенного кол-ва знаков после запятой
Game.roundPlus = function(x, n){
	if(isNaN(x) || isNaN(n)) return false;
	var m = Math.pow(10,n)
	return Math.round(x*m)/m
}

//логарифм по основанию
Math.logb = function(number, base) {
	return Math.log(number) / Math.log(base)
}

//поэлементное сравнение двух массивов, порядок элементов не учитывается
Game.CompareArrays = function(a,b){
	if (a==b)
		return true
	if (a.length!=b.length)
		return false
	for(i in a)
		if (a[i]!=b[i])
			return false
	return true
}

//проверяет есть ли в двух объектах хотя бы один одинаковый элемент
Game.IntersecArrays = function(a,b){
	for(i in a)
		for(m in b)
			if(a[i]==b[m])
				return true
	return false
}

//получение массива с инвентарем юнита
Game.GetInventory = function(entity){
	inv = []
	for(i = 0; i<6; i++){
		if(Entities.GetItemInSlot( entity, i )!=-1)
			inv.push(Entities.GetItemInSlot( entity, i ))
	}
	return inv
}

//проверяет является ли иллюзией герой
Game.IsIllusion = function(entity){
	var PlayersEnt = []
	var PlayersIDs = Game.GetAllPlayerIDs()
	for(i in PlayersIDs)
		PlayersEnt.push( Players.GetPlayerHeroEntityIndex( PlayersIDs[i] ) )
	if (PlayersEnt.indexOf(entity)==-1)
		return true
	else
		return false
}

//список указателей на героев без иллюзий
Game.PlayersHeroEnts = function(){
	var PlayersEnt = []
	var PlayersIDs = Game.GetAllPlayerIDs()
	for(i in PlayersIDs)
		PlayersEnt.push( Players.GetPlayerHeroEntityIndex( PlayersIDs[i] ) )
	return PlayersEnt
}

//список указателей на только вражеских героев без иллюзий
Game.PlayersEnemyHeroEnts = function(){
	var PlayersEnt = []
	var PlayersIDs = Game.GetAllPlayerIDs()
	for(i in PlayersIDs)
		if(Players.GetTeam(Players.GetLocalPlayer())!=Players.GetTeam(PlayersIDs[i]))
			PlayersEnt.push( Players.GetPlayerHeroEntityIndex( PlayersIDs[i] ) )
	return PlayersEnt
}

//возвращает DOTA_ABILITY_BEHAVIOR в удобном представлении
Game.Behaviors = function(DABor){
	var DABh = []
	var ZBehavior = Abilities.GetBehavior( parseInt( DABor ) )
	var s = 32
	while ( ZBehavior > 0 && s > 0 ){
		if(Math.pow(2,s)>ZBehavior){
			s--
			continue
		}
		ZBehavior-=Math.pow(2,s)
		DABh.push(Math.pow(2,s))
	}
	return DABh
}
Game.Behaviors2 = function(DABor){
	var DABh = []
	var ZBehavior = DABor
	var s = 32
	while ( ZBehavior > 0 && s > 0 ){
		if(Math.pow(2,s)>ZBehavior){
			s--
			continue
		}
		ZBehavior-=Math.pow(2,s)
		DABh.push(Math.pow(2,s))
	}
	return DABh
}

//ищет по названию и в абилках и в инвентаре
Game.GetAbilityByName = function(ent,name){
	var GABN = Entities.GetAbilityByName( ent, name )
	if (GABN!=-1)
		return GABN
	for(i=0;i<6;i++){
		var item = Entities.GetItemInSlot( ent, i )
		if(Abilities.GetAbilityName(item)==name)
			return item
	}
	return -1
}

//объект с указателями на бафы юнита
Game.GetBuffs = function(ent){
	var buffs = []
	for(i=0;i<Entities.GetNumBuffs(ent);i++)
		buffs.push(ent,Entities.GetBuff(ent,i))
	return buffs
}
//объект с именами бафов юнита
Game.GetBuffsNames = function(ent){
	var buffs = []
	for(i=0;i<Entities.GetNumBuffs(ent);i++)
		buffs.push(Buffs.GetName(ent,Entities.GetBuff(ent,i)))
	return buffs
}
Game.GetBuffByName = function(ent,buffname){
	var buff = -1
	for(i=0;i<Entities.GetNumBuffs(ent);i++)
		if(Buffs.GetName(ent,Entities.GetBuff(ent,i))==buffname)
			buff = Entities.GetBuff(ent,i)
	return buff
}

//клонирование объекта
Game.CloneObject = function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

Game.VelocityWaypoint = function(ent, time){
	var zxc = Entities.GetAbsOrigin(ent)
	var forward = Entities.GetForward(ent)
	var movespeed = Entities.GetIdealSpeed(ent)
	return [zxc[0]+forward[0]*movespeed*time,zxc[1]+forward[1]*movespeed*time,zxc[2]+forward[2]*movespeed*time]
}

//SetCameraTargetPosition(10,10)
/*
GetName
GetClass
GetTexture
GetDuration
GetDieTime
GetRemainingTime
GetElapsedTime
GetCreationTime
GetStackCount
IsDebuff
IsHidden
GetCaster
GetParent
GetAbility
ent.IsMoving
*/
Game.ScriptLogMsg('Utils sucessfull loaded', '#00ff00')