/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Добавление демопанельки в игру, превью скриптов
Автор: vk.com/exieros
/////////////////////////////////////////////////
-----------------------End---------------------*/

try{ Game.Panels.ScriptMovies.DeleteAsync(0) }catch(e){}

Game.Panels.ScriptMovies = $.CreatePanel( 'Panel', Game.GetMainHUD(), 'ScriptMovies' )
Game.Panels.ScriptMovies.BLoadLayoutFromString( '\
<root>\
	<styles>\
		<include src="s2r://panorama/styles/dotastyles.vcss_c" />\
	</styles>\
	<Panel style="vertical-align:center;horizontal-align:center;opacity:1;width:100%;height:100%;flow-children:down;background-color:#000000AA;position:-100% 0 0;padding: 20px;z-index:999;" onactivate="$.Msg(\'123\')">\
		<Panel style="width:80%;height:80%;vertical-align:center;horizontal-align:center;flow-children:right;">\
			<Panel style="width:20%;height:100%;vertical-align:center;horizontal-align:center;flow-children:down;background-color:#111111;border-radius:20px 0 0 20px;"></Panel>\
			<Movie id="ZooIntroMoviePlayer" src="" controls="full" style="width:80%;height:100%;border-radius:0 20px 20px 0;"/>\
		</Panel>\
	</Panel>\
</root>\
', false, false )
var ScriptMoviesButton = $.CreatePanel( 'Panel', $('#Buttons'), 'Button4' )
ScriptMoviesButton.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /></styles><Button class="BlueButton" style="width:100%;margin: 1px;background-color: #3366aa33;"><Label text="Демонстрация скриптов"/></Button></root>', false, false )
ScriptMoviesButton.SetPanelEvent('onactivate',function(){Game.AnimatePanel( Game.Panels.ScriptMovies, {"position": "0 0 0;"}, 0.5, "linear", 0)})
var ScriptContainer = Game.Panels.ScriptMovies.Children()[0].Children()[0]
var VideoContainer = Game.Panels.ScriptMovies.Children()[0].Children()[1]
var t = $.CreatePanel( 'Panel', ScriptContainer, 'CloseButton' )
t.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /></styles><Button class="CloseButton" style="align:right;margin: 1px;background-color: #3366aa33;"><Label text=""/></Button></root>', false, false )
t.SetPanelEvent('onactivate',function(){
	Game.AnimatePanel( Game.Panels.ScriptMovies, {"position": "-100% 0 0;"}, 0.5, "linear", 0)
	VideoContainer.Stop()
})
function AddScriptToMovies(cont,videocont,scriptname,url){
	var t = $.CreatePanel( 'Panel', cont, 'ButtonMovie' )
	t.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /></styles><Button class="FlatButton" style="width:100%;margin: 1px;background-color: #3366aa33;"><Label text="'+scriptname+'"/></Button></root>', false, false )
	t.SetPanelEvent('onactivate',function(){
		videocont.SetMovie(url)
		videocont.SetPlaybackVolume(100)
		videocont.SetRepeat(true)
		videocont.Play()
	})
}
AddScriptToMovies(ScriptContainer,VideoContainer,'Ability Range','https://www.dropbox.com/s/il40ih7j8ar2x33/abilityRange.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Anti Initiation','https://www.dropbox.com/s/oya0domynxtsd6l/Antinitiation.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Enemy Chat','https://www.dropbox.com/s/z82lurbl9p3tqr3/enemychat.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Enemy ManaBars','https://www.dropbox.com/s/jw77jn0jkf78lou/enemymanabars.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Ez Meepo','https://www.dropbox.com/s/8a8p0apyfaoi62q/ezmeepo.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Ez Techies','https://www.dropbox.com/s/444ubgddm5crxm4/eztechis.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Invoker Panel','https://www.dropbox.com/s/k0us91u4ux6w33w/invokerpanel.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Items Panel','https://www.dropbox.com/s/dow8kg73bmnhnav/Itempanel11.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Skill Allert','https://www.dropbox.com/s/sqfyqrsy8vub501/skillalert.webm?dl=1')
AddScriptToMovies(ScriptContainer,VideoContainer,'Zeus AutoUlt','https://www.dropbox.com/s/97hnnuippyqhfer/zeusautoult.webm?dl=1')