importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

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
  
messaging.setBackgroundMessageHandler(function(payload) {  
 var  title = payload.data.title;
 var options = {
        body: payload.data.body,
        icon: payload.data.icon,
        image: payload.data.image,
     data:{
        time: new Date(Date.now()).toString(),
        click_action: payload.data.click_action
        }    
  };
 return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  var action_click = event.notification.data.click_action;
  event.notification.close();
  event.waitUntil(
    clients.openWindow(action_click)
  );
});