# expo-rubika

# hello guys my name is mohammad afrwzeh

From now on, you can rebuild the Rubika application

> SDK >= 49

> PROGRAMMER : MOHAMMAD AFRWZEH

## whats is new in 1.0.7V :
* fix downloadFile method 

* add downloadAvatar method

## Installation

```sh
npm install expo-rubika
```

## Usage Crypto

```js
import {Crypto} from "expo-rubika";
let encryption = new Crypto(auth,privateKey)
```

## Usage Client


```js
import {Client} from "expo-rubika";
let bot = new Client(auth, privateKey, platform)
```

## get updates example 

```js
import {Client} from "expo-rubika";
let bot = new Client(auth, privateKey, platform)
bot.onMessage(update=>{
    console.log(update)
  },{
  onClose:(e)=>{
    console.log("ws closed.")
  }
  //more events
})
```

## Create Session

```js
import {Login} from "expo-rubika";
let login = new Login(platform,regestring,appName) //platform : android or web
// regestring value is true or false : true for auto register auth
let sendCodeData = await login.sendCode(phoneNumber)
/*
more code ...
*/
```

## Usage Rubino

```js
import {Rubino} from "expo-rubika";
let rubino = new Rubino(auth,platform)
//platform in Rubino is : android or ios or pwa
```

## platform list :
* android
* ios
* pwa
* web

## tools list :
* getMethods
* getMethodInfo
* getEvents
* getFileBuffer
* getFileMime
* getFileName
* getFileSize
* getChatTypeByGuid
* getAudioInfo
* getImageDimensions
* getMusicInfo
* getNowTime
* getStateTime
* getVideoInfo
* getVideoThumbnail
* responseToBuffer
* concatBuffer
* createFileInline
* createImageThumbnail
 

## get all methods from Class instance :

```js
import {Client, Tools} from "expo-rubika"
let bot = new Client(auth,privateKey,platform)
let methods = Tools.getMethods(bot) // [method1,method2,...]
```

## get method info with method : 

```js
import {Client, Tools} from "expo-rubika"
let bot = new Client(auth,privateKey,platform)
let methods = Tools.getMethodInfo(bot.sendMessage) 
```

> whats is options argument ?

options argument is object for handling events


## handle event example

```js
import {Client} from "expo-rubika";
let bot = new Client(auth, privateKey, platform)
await bot.sendMessage(chat_id,text,null,null,{
  onStartRequest:(e)=>{e.cancelRequest()}
})
```

## all event List :

* onStartRequestFile (upload)
* onEndRequestFile (upload)
* onSuccessRequestFile (upload)
* onErrorRequestFile (upload)
* onStartUpload (upload)
* onUploadPartSend (upload)
* onEndUpload (upload)
* onErrorUpload (upload)
* onUploadCanceled (upload)
* onErrorRequest (methods)
* onStartRequest (methods)
* onSendRequest (methods)
* onCancelRequest (methods)
* onOpen (onMessage)
* onError (onMessage)
* onClose (onMessage)
* onMessage (onMessage)
* onDownloadStart (download)
* onDownloadPart (download)
* onDownloadEnd (download)
* onDownloadCanceled (download)

> support markdown text syntax in send message methods

## markdown text example :

```js
import {Client} from "expo-rubika";
let bot = new Client(auth, privateKey, platform)
await bot.sendMessage(chat_id,"__italic__ **bold** ``mono`` ~~strike~~ --underline-- @@Mention@@(url or chat_id) ##spoiler##")
```

## FOLLOW ME :

[INSTAGRAM](https://instagram.com/techcode_programmer)
