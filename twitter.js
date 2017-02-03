var assets={};

function update(data){
  console.log(data);
  $("#twitter").html("");
  for( var i = data.length-1; i >=0 ; i-- ) {
    //var profileImage = data[i].user.profile_image_url.match(/[^\/]*\.[^\/]*$/)[0];
    var profileImage = data[i].user.profile_image_url;
    var dt = ((new Date()).getTime()-Date.parse(data[i].created_at))/1000;
    console.log(profileImage);
    var tweet =$("<div></div>",{ "class": "tweet", });
    var icon  =$("<img></img>",{ "class": "icon","src":profileImage });
    var name  =$("<div></div>",{ "class": "name", }).text(data[i].user.name);
    var text  =$("<div></div>",{ "class": "text", }).text(data[i].text);
    var _cliant=$(data[i].source);
    var cliant=$("<div></div>",{ "class": "cliant", }).html(_cliant.text());
    var mediaBox=$("<div></div>",{ "class": "mediaBox", });
    var time = $("<div></div>",{ "class": "timer", }).text((function(){
      var timer="";
      if(dt<60)timer = Math.floor(dt)+"秒前";
      else if(dt<3600)timer = Math.floor(dt/60)+"分前";
      else if(dt<3600*24)timer = Math.floor(dt/3600)+"時間前";
      else timer =  Math.floor(dt/3600/24)+"日前";
      return timer;
    })());
    var screen_name =$("<div></div>",{ "class": "screen_name", }).text("@"+data[i].user.screen_name);
    tweet.append(icon)
         .append(name)
         .append(screen_name)
         .append(time)
    //     .append(cliant)
         .append('<br>')
         .append(text);
    //画像があれば表示する
    if(!!data[i].extended_entities){
      for(var key of data[i].extended_entities.media){
        var media =$("<img></img>",{ "class": "media","src":key.media_url});
        mediaBox.append(media);
        if(!!assets[profileImage])continue;
        assets[profileImage]="loaded";
        var imgPreloader = new Image();
        imgPreloader.onload=function(){};
        imgPreloader.src=key.media_url;
      }
      tweet.append(mediaBox);
    }
    $("#twitter").prepend(tweet);

    //アイコンの読み込み
    if(!!assets[profileImage])continue;
    assets[profileImage]="loaded";
    var imgPreloader = new Image();
    imgPreloader.onload=function(){};
    imgPreloader.src=data[i].user.profile_image_url;
  }
}

function Twitter() {}
Twitter.prototype = {
  consumerKey:    "RyHO8voqHhQMAdybXvlQm5cGZ",
  consumerSecret: "CPQ5lc49sUOX0eIIKrPPVPTfJeIJbm9C3PTqY0P1av6aNKz5sN",
  accessToken:    "1127330335-QEV7mW0MkCJEgesejkm9kdiglbG5RYVxzaWYSIn",
  tokenSecret:    "XiOMXhqGHZ9bMnS12z2ECQuS0ZgQhpp7ax0WkFPwtZtZS",
  lastId:         "0"
};
Twitter.prototype.get = function(api, content) {
  var accessor = {
    consumerSecret: this.consumerSecret,
    tokenSecret: this.tokenSecret
  };

  var message = {
    method: "GET",
    action: api,
    parameters: {
      oauth_version: "1.0",
      oauth_signature_method: "HMAC-SHA1",
      oauth_consumer_key: this.consumerKey,
      oauth_token: this.accessToken,
    }

  };
  for (var key in content) {
    message.parameters[key] = content[key];
  }
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var target = OAuth.addToURL(message.action, message.parameters);

  var options = {
    type: message.method,
    url: target,
    dataType: "jsonp",  //ここでjsonpを指定する
    jsonp: false,       //jQueryによるcallback関数名の埋め込みはしない
    cache: true         //リクエストパラメータに時刻を埋め込まない
  };
  $.ajax(options)
    .then(function(data){
      this.lastId=data[0].id;
    });
}
