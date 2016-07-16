/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Автостак древних крипов
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

destroy()
var uiw = Game.GetScreenWidth()
var uih = Game.GetScreenHeight()
var interval = 0
var hpn = false
var b = false
var camp
var z = 0
var myid
var ent
var team
var status
var a = [
	[
		[-2625,-333,384],
		[-2576,-457,384],
		[-2517,-656,384],
		[-2675,-812,384],
		[-2826,-971,384],
		[-2987,-1121,384],
		[-3160,-1264,384],
		[-3292,-1416,384],
		[-3443,-1576,384],
		[-3621,-1706,384],
		[-3791,-1842,384],
		[-3959,-1983,384],
		[-4125,-2123,384]
	],
	[
		[3104,-769,256],
		[3033,-773,256],
		[2812,-786,256],
		[2602,-795,256],
		[2389,-772,256],
		[2207,-653,256],
		[2125,-447,256],
		[2085,-237,256],
		[2087,-15,256],
		[2152,187,256],
		[2267,360,256],
		[2322,575,256],
		[2400,736,256]
	]
]
var camps = [
	[
		[-2463,-160,384],
		55,
		-0.05
		
	],
	[
		[3535,-786,256],
		54.9,
		0.1
	]
]
var ancients = {
	npc_dota_neutral_black_drake:[250,279],
	npc_dota_neutral_big_thunder_lizard:[223,393],
	npc_dota_neutral_granite_golem:[230,393]
}
var spots = [[-3307, 383, -2564, -413, 400],[3456, -384, 4543, -1151, 300]]
function destroy(){
	if(typeof Game.Subscribes.AncientCreepStack != 'undefined')
		GameEvents.Unsubscribe(Game.Subscribes.AncientCreepStack)
	try{Game.Panels.AncientCreepStack.DeleteAsync(0)}catch(e){}
	for(i in Game.Particles.AncientCreepStack)
		try{Particles.DestroyParticleEffect(Game.Particles.AncientCreepStack[i],Game.Particles.AncientCreepStack[i])}catch(e){}
	Game.Particles.AncientCreepStack = []
}
function create(){
	myid = Players.GetLocalPlayer()
	team = Players.GetTeam(myid)-2
	camp = camps[team]
	status = 0
	ent = Players.GetLocalPlayerPortraitUnit()
	if(!(Entities.IsControllableByPlayer(ent,myid)&&Entities.IsCreep(ent)&&Entities.IsValidEntity(ent)&&Entities.IsAlive(ent)&&Entities.IsRangedAttacker(ent))){
		GameEvents.SendEventClientSide( 'antiaddiction_toast', {"message":"Выбранный юнит не является союзным подконтрольным крипом дальнего боя :(\nДоступна команда: __AncientCreepStack_Activate","duration":"5"})
		AncientCreepStack.checked = false
		return
	}
	DrawBox(spots[team])
	Game.Subscribes.AncientCreepStack = GameEvents.Subscribe("entity_hurt", function(a){
		if(a.entindex_attacker==ent)
			b=true
	})
	Game.Panels.AncientCreepStack = $.CreatePanel( "Panel", Game.GetMainHUD(), "AncientCreepStack" )
	Game.Panels.AncientCreepStack.BLoadLayoutFromString( '\
	<root>\
		<styles>\
			<include src="s2r://panorama/styles/dotastyles.vcss_c" />\
			<include src="s2r://panorama/styles/magadan.vcss_c" />\
		</styles>\
		<Panel style="padding:3px;border-radius:5px;flow-children:down;background-color:#000000EE;border: 1px solid white;">\
			<Label style="color:white;font-size:16px;"/>\
			<Label style="color:white;font-size:16px;"/>\
			<Label style="color:white;font-size:16px;"/>\
		</Panel>\
	</root>\
	', false, false)
	Game.AnimatePanel( Game.Panels.AncientCreepStack, {"transform": "rotateX( 35deg );"}, 0.3, "ease-in", 0)
	Game.ScriptLogMsg('Script enabled: AncientCreepStack', '#00ff00')
}
if(!Game.AncientCreepStackCreate){
	Game.AncientCreepStackCreate = true
	Game.AddCommand("__AncientCreepStack_Activate", create, "", 0)
}
function DrawBox(box){
	Game.Particles.AncientCreepStack.push(DrawLineInGameWorld( [ box[0], box[1], box[4] ], [ box[0], box[3], box[4] ]))
	Game.Particles.AncientCreepStack.push(DrawLineInGameWorld( [ box[2], box[1], box[4] ], [ box[2], box[3], box[4] ]))
	Game.Particles.AncientCreepStack.push(DrawLineInGameWorld( [ box[0], box[1], box[4] ], [ box[2], box[1], box[4] ]))
	Game.Particles.AncientCreepStack.push(DrawLineInGameWorld( [ box[0], box[3], box[4] ], [ box[2], box[3], box[4] ]))
}
function DrawLineInGameWorld(a, b){
		var temp = Particles.CreateParticle("particles/ui_mouseactions/bounding_area_view_a.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, 0)
		Particles.SetParticleControl(temp, 0, a)
		Particles.SetParticleControl(temp, 1, b)
		return temp
}
function ComparePoints(a,b,c){
	if(Math.abs(a[0]-b[0])>c||Math.abs(a[1]-b[1])>c||Math.abs(a[2]-b[2])>c)
		return false
	else
		return true
}
function GetNeutral(ent,maxrange){
	var neutrals = Entities.GetAllEntitiesByClassname('npc_dota_creep_neutral')
	var mr = maxrange
	var n = -1
	var l = 0
	var e = -1
	var gold = 0
	var exp = 0
	for(i in neutrals){
		var p = Entities.GetAbsOrigin(neutrals[i])
		if(!Entities.IsAncient(neutrals[i])||Entities.NoHealthBar(neutrals[i]))
			continue
		var name = Entities.GetUnitName(neutrals[i])
		if(typeof ancients[name] != 'undefined'){
			gold+=ancients[name][0]
			exp+=ancients[name][1]
		}
		if(p[0]>spots[team][0]-500&&p[0]<spots[team][2]+500&&p[1]<spots[team][1]+500&&p[1]>spots[team][3]-500)
			l++
		if(Entities.GetRangeToUnit(ent,neutrals[i])<maxrange)
			n++
		if(Entities.GetRangeToUnit(ent,neutrals[i])<mr&&Entities.GetRangeToUnit(ent,neutrals[i])<maxrange&&ent!=neutrals[i]){
			mr = Entities.GetRangeToUnit(ent,neutrals[i])
			e = neutrals[i]
		}
	}
	return [e,mr,n,l,gold,exp]
}
function AncientCreepStackF(){
	if ( !AncientCreepStack.checked || (Game.GetState()!=7 && Game.GetState()!=6)){
		AncientCreepStack.checked = false
		destroy()
		return
	}
	if(!Entities.IsAlive(ent)){
		GameEvents.SendEventClientSide( 'antiaddiction_toast', {"message":"Ваш крип помер смертью храбрых :(\nСкрипт деактивирован!","duration":"2"})
		AncientCreepStack.checked = false
		destroy()
		return
	}
	var xy = [Game.WorldToScreenX(spots[team][2]-400,spots[team][1],spots[team][4])+50,Game.WorldToScreenY(spots[team][2]-400,spots[team][1],spots[team][4]+50)]
	Game.Panels.AncientCreepStack.style.position = (xy[0]/uiw*100)+'% '+(xy[1]/uih*100)+'% 0'
	var time = (parseInt((Game.GetDOTATime(false,false)%60)*10))/10
	var entnow = Players.GetLocalPlayerPortraitUnit()
	//$.Msg([Math.floor(Entities.GetAbsOrigin(entnow)[0]),Math.floor(Entities.GetAbsOrigin(entnow)[1]),Math.floor(Entities.GetAbsOrigin(entnow)[2])])
	if(Entities.GetHealth(ent)<=400&&!hpn){
		hpn = true
		GameEvents.SendEventClientSide( 'antiaddiction_toast', {"message":"У вашего крипа мало HP!","duration":"2"})
	}else if(Entities.GetHealth(ent)>400)
		hpn = false
	var xyz = Entities.GetAbsOrigin(ent)
	if(!Entities.IsRangedAttacker(ent)&&GetNeutral(ent,1000)[1]<=250)
		b=true
	if(time<50){
		if(!ComparePoints(xyz,camp[0],5)&&status==0)
			move(ent,entnow,camp[0])
		interval = 0.5
	}
	else
		interval = 0
	//if(Math.abs(time+(GetNeutral(ent,1000)[1]/Entities.GetIdealSpeed(ent))-(camp[1]-(GetNeutral(ent,1000)[2]*camp[2])))<=0.2&&!Entities.IsMoving(ent)&&status==0) ну и хуйня ебаная.
	if(time==52.5){
		z=0
		b=false
		status=1
	}
	if(status==1&&!b){
		GameUI.SelectUnit(ent,false)
		Game.AttackTarget(ent,GetNeutral(ent,1000)[0],false)
		GameUI.SelectUnit(entnow,false)
	}else if(status==1&&b){
		if(z>=a[team].length-2){
			status=0
			z=0
			b=false
			return
		}
		if(z==0){
			z++
			move(ent,entnow,a[team][z])
			return
		}
		if(ComparePoints(xyz,a[team][z],150)){
			z++
			move(ent,entnow,a[team][z])
		}
	}
}
function AncientCreepStackU(){
	if ( !AncientCreepStack.checked || (Game.GetState()!=7 && Game.GetState()!=6))
		return
	var xy = [Game.WorldToScreenX(spots[team][2]-400,spots[team][1],spots[team][4])+50,Game.WorldToScreenY(spots[team][2]-400,spots[team][1],spots[team][4]+50)]
	if(xy[0]<0||xy[1]<0)
		Game.Panels.AncientCreepStack.visible = false
	else
		Game.Panels.AncientCreepStack.visible = true
	Game.Panels.AncientCreepStack.style.position = (xy[0]/uiw*100)+'% '+(xy[1]/uih*100)+'% 0'
	var neu = GetNeutral(ent,1000)
	Game.Panels.AncientCreepStack.Children()[0].text='Stacks: '+((parseInt((neu[3]/3)*10))/10)
	Game.Panels.AncientCreepStack.Children()[1].text='Gold: ~'+neu[4]
	Game.Panels.AncientCreepStack.Children()[2].text='Exp: ~'+neu[5]
	var time = (parseInt((Game.GetDOTATime(false,false)%60)*10))/10
	Game.AnimatePanel( Game.Panels.AncientCreepStack, {"transform": "rotateX( 35deg ) translate3d( 0px, "+((time-Math.floor(time))*20)+"px, 0px );"}, 0.3, "ease-in-out", 0)
}
function move(ent,entnow,xyz){
	GameUI.SelectUnit(ent,false)
	Game.MoveTo(ent,xyz,false)
	GameUI.SelectUnit(entnow,false)
}
var AncientCreepStackOnCheckBoxClick = function(){
	if ( !AncientCreepStack.checked ){
		destroy()
		Game.ScriptLogMsg('Script disabled: AncientCreepStack', '#ff0000')
		return
	}
	create()
	function f(){ $.Schedule( interval,function(){
		AncientCreepStackF()
		if(AncientCreepStack.checked)
			f()
	})}
	f()
	function u(){ $.Schedule( 0,function(){
		AncientCreepStackU()
		if(AncientCreepStack.checked)
			u()
	})}
	u()
}
var Temp = $.CreatePanel( "Panel", $('#scripts'), "AncientCreepStack" )
Temp.SetPanelEvent( 'onactivate', AncientCreepStackOnCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="AncientCreepStack" text="AncientCreepStack"/></Panel></root>', false, false)  
var AncientCreepStack = $.GetContextPanel().FindChildTraverse( 'AncientCreepStack' ).Children()[0]