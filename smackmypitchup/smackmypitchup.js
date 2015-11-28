var glide = T("param", {value:880});
//var table = [200, [4800, 150], [2400, 500]];
//var cutoff = T("env", {table:table}).bang();
var cutoff = 1000;
var VCO = T("saw", {freq:glide, mul:0.2});
var VCF = T("lpf", {cutoff:cutoff, Q:20}, VCO);
var EG  = T("adsr", {a:10, d:1500, s:1, r:500}, VCF).play();
var currentFreq;
var currentAmp = 0;
var initAmp = 0;


var colors = {
	"A": "#500000",
	"A#": "#202000",
	"B": "#005000",
	"C": "#000050",
	"C#": "#002020",
	"D": "#404000",
	"D#": "#200020",
	"E": "#400040",
	"F": "#004040",
	"F#": "#103060",
	"G": "#603010",
	"G#": "#103010"
};
var currentColor = "#000";
function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}


$(document).ready(function () {
	$(document).on('pitchChanged', function (event, pitch, freq) {	
		if (freq) {
			glide.linTo(freq, "50ms");
		}
				currentColor = colors[pitch];
		if (!currentColor) {
			currentColor = "#000";
		}
	});
	$(document).on('ampChanged', function (event, amp) {

		$('body').css({'background-color': LightenDarkenColor(currentColor, amp * 10)});
		amp = Math.round(amp*1000)/1000;

		if (amp - currentAmp > 2) {
			initAmp = amp;
			EG.bang();
		}
		if (amp > 0.01) {
			var ampCutoff = amp/initAmp * 4600;
			VCF.cutoff = Math.max(ampCutoff, 500);
		}
		if (amp < 0.1) {
			EG.release();
		}
		currentAmp = amp;
	});
});