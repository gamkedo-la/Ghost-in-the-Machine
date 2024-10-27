var MusicPlayer = new musicPlayer();

function musicPlayer() {
	Started = false;

	var group1 = {
		duration: 51.200,
		tracks: [
		"./audio/music_jqh_beepbox_01.ogg",
		"./audio/music_jqh_beepbox_02.ogg",
		"./audio/music_jqh_beepbox_03.ogg",
		]};
	var group2 = {
		duration: 41.600,
		tracks: [
		"./audio/music-NoDrum_jqh_beepbox_01.ogg",
		"./audio/music-NoDrum_jqh_beepbox_02.ogg",
		"./audio/music-NoDrum_jqh_beepbox_03.ogg",
		]};

	var nextMusicGroup = group1;
	var nextTrackTime = 0.0;

	this.update = function() {
		if (!navigator.userActivation.hasBeenActive) return;

		if (performance.now() / 1000 >= nextTrackTime) {
			var randomIndex = rndInt(2);
			AudioMan.playMusic(nextMusicGroup.tracks[randomIndex], 0.5);
			nextTrackTime = performance.now() / 1000 + nextMusicGroup.duration;

			nextMusicGroup = nextMusicGroup == group1 ? group2 : group1;
		}
	}
}