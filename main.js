const { Artboard, Text, Color, textScript } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;

function CSVToArray( strData, strDelimiter ){
  // https://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
	strDelimiter = (strDelimiter || ",");
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
		);
	var arrData = [[]];
	var arrMatches = null;
	while (arrMatches = objPattern.exec( strData )){
		var strMatchedDelimiter = arrMatches[ 1 ];
		if (
			strMatchedDelimiter.length &&
			(strMatchedDelimiter != strDelimiter)
			){
			arrData.push( [] );
		}
		if (arrMatches[ 2 ]){
			var strMatchedValue = arrMatches[ 2 ].replace(
				new RegExp( "\"\"", "g" ),
				"\""
				);
		} else {
			var strMatchedValue = arrMatches[ 3 ];
		}
		arrData[ arrData.length - 1 ].push( strMatchedValue );
	}
	return( arrData );
}



async function insertTextFromFileHandler(selection, documentRoot) {
    const aFile = await fs.getFileForOpening({ types: ["csv"] });
    if (!aFile)
        return;
    const contents = await aFile.read();
    replaceText(selection, documentRoot, contents)
}

const split = /\{(.*?)}/g;

function replaceText(selection, documentRoot, contents) {
  const array = CSVToArray(contents, ',')
  documentRoot.children.forEach(node => {
    if (node instanceof Artboard) {
      let artboard = node;
      let textLayers = artboard.children.filter(artboardChild => {
          return artboardChild instanceof Text;
      })
      textLayers.forEach(text => {
        for (var i = 0; i < array.length; i++) {
          if ( text.name === array[i][0] ) {
            var value = array[i][1].split(split)
            for (var z = 0; z < value.length; z++) {

              value[z] = value[z].replace(/<br\/>/g, "\n").replace(/<br>/g, "\n")

              if ( value[z].charAt(0) === '%' ) {
                value[z] = { text: value[z].slice(1,-1), textScript: 'superscript' }
              } else {
                value[z] = { text: value[z], textScript: 'none' }
              }
            }
            text.text = value.map(item => item.text).join("");
            text.styleRanges = value.map(item => ({
              length: item.text.length,
              textScript: item.textScript
            }));
          }
        }
      })
    }
  })
}

module.exports = {
    commands: {
        "insertTextFromFileCommand": insertTextFromFileHandler,
    }
};
