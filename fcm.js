var firebaseConfig = {
   apiKey: "AIzaSyDHVzeqpAodDw0yf2LozMB0DFKchE0BhkA",
authDomain: "pwapush-617d0.firebaseapp.com",
databaseURL: "https://pwapush-617d0.firebaseio.com",
projectId: "pwapush-617d0",
storageBucket: "pwapush-617d0.appspot.com",
messagingSenderId: "247472682409",
appId: "1:247472682409:web:3ea716511dd79ba4b400b8"
};
  
  firebase.initializeApp(firebaseConfig);
  
  const messaging = firebase.messaging();

    if ("serviceWorker" in navigator) {
	  window.addEventListener("load", function() {
	  navigator.serviceWorker
		.register("upup.sw.min.js", {
		  scope: "./"
		})
		.then(registration => {
		  messaging.useServiceWorker(registration);
		});
	  });
    } 

    messaging.requestPermission().then(function() {  
    if(isTokenSentToServer()){  
    // console.log("Token Already sent");
    }else{
      getRegisterToken();
    }
    }).catch(function(err) {
    console.log('Unable to get permission to notify.', err);
    });

function getRegisterToken(){
    messaging.getToken().then(function(currentToken) {
    if (currentToken) {
       saveToken(currentToken);
      console.log(currentToken);
    sendTokenToServer(currentToken);
    } else {
    console.log('No Instance ID token available. Request permission to generate one.');
    setTokenSentToServer(false);
    }
    }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    setTokenSentToServer(false);
    });
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}
  
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' + 'unless it changes');
    }
}

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}
  
function saveToken(currentToken){
	jQuery.ajax({
	 data: {"token":currentToken, urlkey:"5ef5004929867"},
	 type: "post",
	 url: "../fcm_token_api.php",
	 success: function(result){
		console.log(result);
	    document.getElementById("toast").innerHTML = result;
		var x = document.getElementById("toast");
		x.className = "show";
		setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	 }  
    });
    }

messaging.onMessage((payload) => {
    var  title = payload.data.title;
    var options = {
        body: payload.data.body,
        icon: payload.data.icon,
        image: payload.data.image,
        data: {
            time: new Date(Date.now()).toString(),
            click_action: payload.data.click_action
        }
    };
    	
    navigator.serviceWorker.ready.then(function(registration) {
    registration.showNotification(title, options)	
    });	
	
});