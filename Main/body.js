/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Необходимый для боковой панели скрипт.
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

GameEvents.Subscribe('game_newmap', MapLoaded)
GameEvents.Subscribe('player_team', RefreshToggles)
function RefreshToggles(){
	MyID = Game.GetLocalPlayerID()
	Toggles = $('#scripts').Children()
	if ( MyID == -1 )
		for ( var i in Toggles )
			Toggles[i].enabled = false
	else
		for ( var i in Toggles )
			Toggles[i].enabled = true
}
function MapLoaded(data){
	if(!Game.ToggleSPanelR){
		Game.ToggleSPanelR = true
		try{Game.AddCommand( '__ToggleSPanel', function(){
			$.GetContextPanel().ToggleClass('PopupOpened')
		}, '',0 )}catch(e){}
	}
	GameUI.SetCameraDistance( slider.value )
	RefreshToggles()
}
$('#Buttons').RemoveAndDeleteChildren()
var Reload = $.CreatePanel( 'Panel', $('#Buttons'), 'Button1' )
Reload.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /></styles><Button class="BlueButton" style="width:100%;margin: 1px;background-color: #3366aa33;" onactivate="Game.ReloadDota2JScripts();"><Label text="Перезагрузить скрипты"/></Button></root>', false, false )
var Official = $.CreatePanel( 'Panel', $('#Buttons'), 'Button3' )
Official.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /></styles><Button class="BlueButton" style="width:100%;margin: 1px;background-color: #3366aa33;" onactivate="DOTADisplayURL( \'http://vk.com/d2jscripts\' );"><Label text="Официальная группа ВК"/></Button></root>', false, false )
var slider = $.GetContextPanel().FindChildInLayoutFile( "CameraDistance" )
//КОСТЫЛЬ ОБНОВИТЬ XML
	$('#scripts').style.height = "300px"
slider.min = 1000
slider.max = 1800
slider.value = 1134
lastValue = slider.value
$('#CamDist').text = 'Дальность камеры: ' + Math.floor(slider.value)
function f(){ $.Schedule( 0,function(){
	if (slider.value != lastValue)
	GameUI.SetCameraDistance( slider.value )
	$('#CamDist').text = 'Дальность камеры: ' + Math.floor(slider.value)
	lastValue = slider.value
	f()
})}
f()
Game.ScriptLogMsg('MainScript sucessfull loaded', '#00ff00')