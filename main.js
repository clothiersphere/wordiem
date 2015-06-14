var knownWordList = ['the','be','to','of','and','a','in','that','have','I','it','for','not','on','with','he'];
var text;
function writeText(){
	while (document.getElementsByClassName('text-container')[0].firstChild) {
    	document.getElementsByClassName('text-container')[0].removeChild(document.getElementsByClassName('text-container')[0].firstChild);
	}
	text = document.getElementsByClassName('image-text')[0].innerHTML.split(' ');
	var words = [];
	for(var i = 0; i < text.length; i++){
		var word = document.createElement('p');
		word.innerHTML = text[i]+' ';
		word.classList.add('highlighted');
		for(var j = 0; j < knownWordList.length; j++){
			if(text[i] == knownWordList[j] || text[i].length < 5){
				word.classList.remove('highlighted');
			}
		}
		word.addEventListener('click', function(){
			if(this.classList.contains('highlighted')){
				document.getElementsByClassName('definition-container')[0].style.display = 'block';
				var xmlhttp = new XMLHttpRequest();
				var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&max_page_results=1&summary=quick&text="+this.innerHTML.slice(0,this.innerHTML.length-1);
				xmlhttp.onreadystatechange = function() {
				    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				    	var response = JSON.parse(xmlhttp.responseText);
				        document.getElementsByClassName('definition-container')[0].innerHTML = response.documents[0].summary;
				    }
				}
				xmlhttp.open("GET", url, true);
				xmlhttp.send();
			}
		});
		word.addEventListener('mouseenter', function(){
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
		});
		word.addEventListener('mouseleave', function(){
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
		});		
		word.addEventListener('dblclick', function(){
			this.classList.remove('highlighted');
			knownWordList.push(this.innerHTML.slice(0,this.innerHTML.length-1));
			document.getElementsByClassName('definition-container')[0].style.display = 'none';
			writeText();
		});		
		document.getElementsByClassName('text-container')[0].appendChild(word);
	}
}
document.getElementsByClassName('url-input')[0].value = 'http://www.rjionline.org/sites/default/files/images/the_text_column_should_satisfy_four_conditions.jpeg'
document.getElementsByClassName('url-button')[0].addEventListener('click', function(){
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.idolondemand.com/1/api/sync/ocrdocument/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&url="+document.getElementsByClassName('url-input')[0].value;
//  http://www.rjionline.org/sites/default/files/images/the_text_column_should_satisfy_four_conditions.jpeg
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	    	var response = JSON.parse(xmlhttp.responseText);
	        document.getElementsByClassName('image-text')[0].innerHTML = response.text_block[0].text;
	    }
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
});
document.getElementsByClassName('enter-text')[0].addEventListener('click', function(){
	writeText();
});
document.getElementsByClassName('speech-button')[0].addEventListener('click', function(){
	var knownWords = [];
	var unknownWords = [];
	var wordGroup = '';
	var wordKnown = false;
	var index = 0;
	var msg;
	var voices;
	for(var i = 0; i < text.length; i++){
		var wordKnown = false;
		for(var j = 0; j < knownWords.length; j++){
			if(text[i] == knownWords[j] || text[i].length < 5){
				wordKnown = true;
			}
		}
		if(wordKnown){
			wordGroup+=text[i]+' ';
		}else{
			knownWords.push(wordGroup);
			wordGroup = '';
			unknownWords.push(text[i]);
		}
	}
	function addDefinition(){
		var xmlhttp = new XMLHttpRequest();
		var url = "https://api.idolondemand.com/1/api/sync/querytextindex/v1?apikey=66c1a05f-e956-426f-a0e0-2c2f3756423f&max_page_results=1&summary=quick&text="+unknownWords[index];
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    	var response = JSON.parse(xmlhttp.responseText);
		        unknownWords[index]+=' '+response.documents[0].summary;
		        index++;
				if(index < unknownWords.length){
					addDefinition();
				}else{
					for(var i = 0; i < knownWords.length; i++){
						msg = new SpeechSynthesisUtterance();
						voices = window.speechSynthesis.getVoices();
						msg.voice = voices[10];
						msg.text = knownWords[i];
						window.speechSynthesis.speak(msg);
//						msg = new SpeechSynthesisUtterance();
						msg.voice = voices[5];
						msg.text = unknownWords[i];
						window.speechSynthesis.speak(msg);
					}
				}
		    }
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
	addDefinition();
});