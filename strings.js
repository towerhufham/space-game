var language = "english"
var strings;

function loadStrings(l) {
	if (l === "english") {
		strings = loadEnglish();
	}
}

loadStrings(language);
// console.log("aries-m: " + strings["aries-m"]);
// console.log("aries-s: " + strings["aries-s"]);