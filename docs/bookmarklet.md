# TipLisk Bookmarklet

## ブックマークレットとは
Webブラウザのブックマーク機能を使用して、ちょっと便利な機能を使えるようにするプログラムのことです。<br>
※ブックマークレットの使用方法は検索して調べてください。

## Tiplskブックマークレット
こんなのが使えるようになります。<br>
<img src="https://lisknonanika.github.io/tiplisk/img/tiplskbookmarklet.png" width="50%" height="50%">

使いたい場合は、以下をブックマークのURLに貼り付けてください。
```JavaScript:bookmarklet.min.js
javascript:eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(W(){y(2.h(\'#10\'))1D;F a=2.1E(\'6\');a.k=\'10\';a.l=\'z-18:1F;19:1G;1a:1b(11% - 1c);12:1b(11% - 1c);1d:1e;13:1e;q-i:o(X,X,14,0.9);j:4 A o(11,1f,1H,0.5);j-s:m;1I-1d: 1J;1g-1K:12;7-1L:1M,"ヒラギノ角ゴ 1h 1N","1O 1P 1Q 1h",1R,"メイリオ",1S,"ＭＳ Ｐゴシック","1T 1U",1V-1W;\';F b=\'<6 l="13:1X;t:1Y m;w:4 1Z 4 21 !22;7-p:23;7-B:C;q-i:o(1f,24,25,0.5);j-s:m;">Y 26!</6>\';F c=\'<6 l="t: 4 u;7-p:1i;">\'+\'<a 1j="1k://27.28.29/2a/2b.2c" 1l="1m">Yの使い方</a>\'+\'&1n;/&1n;\'+\'<a 1j="1k://2d.2e.2f/2g/d/e/2h-2i-2j/2k?2l=1o&2m=1o&2n=2o&2p=k.2q" 1l="1m">2r 2s Y</a>\'+\'</6>\';F d=\'<6 k="1p" l="z-18:2t;19:2u;1a:4;2v:4;7-p:2w;i:#G;7-B:C;w:4 m;j:H A o(X,X,14,1);j-s:m;q-i:o(14,1q,1q,0.8);">×</6>\';F e=\'<6 k="1r" K="I" l="7-p:L;7-B:C;i:#G;j: H A #M;j-s:4;q-i:#N;w:m;t:4 u;O-P: 0 Q R o(0,0,0,0.3);">・誰かにチップ</6>\'+\'<6 k="1s" K="I" l="7-p:L;7-B:C;i:#G;j: H A #M;j-s:4;q-i:#N;w:m;t:4 u;O-P: 0 Q R o(0,0,0,0.3);">・リプライでチップ</6>\'+\'<6 k="1t" K="I" l="7-p:L;7-B:C;i:#G;j: H A #M;j-s:4;q-i:#N;w:m;t:4 u;O-P: 0 Q R o(0,0,0,0.3);">・残高確認</6>\'+\'<6 k="1u" K="I" l="7-p:L;7-B:C;i:#G;j: H A #M;j-s:4;q-i:#N;w:m;t:4 u;O-P: 0 Q R o(0,0,0,0.3);">・入金キー発行</6>\'+\'<6 k="1v" K="I" l="7-p:L;7-B:C;i:#G;j: H A #M;j-s:4;q-i:#N;w:m;t:4 u;O-P: 0 Q R o(0,0,0,0.3);">・出金</6>\'+\'<6 k="1w" K="I" l="7-p:L;7-B:C;i:#G;j: H A #M;j-s:4;q-i:#N;w:m;t:4 u;O-P: 0 Q R o(0,0,0,0.3);">・履歴確認</6>\';F f=\'<2x 2y="1g" k="v" l="7-p:u;t:4 u;q-i:#2z;j-s:4;13: 2A;w: m 4;" 1x="1x" 2B="コマンドがここに出力されるよ"/>\';F g=\'<6 k="D" l="7-p:1i;i:#2C;t-12: u;"></6>\';a.E=b+c+d+e+f+g;2.2D.2E(a);W 1y(){2.h(\'#10\').2F()}W 1z(){2.h(\'#D\').E="";y(S.k==="1r"){2.h(\'#v\').J="@x Z [ユーザー名] [枚数]";2.h(\'#D\').E="[ユーザー名]：渡す相手の2Gのユーザー名に置き換えてね。<T>[枚数]：渡す枚数に置き換えてね。<T>例：@x Z @2H 0.5"}V y(S.k==="1s"){2.h(\'#v\').J="@x Z [枚数]";2.h(\'#D\').E="[枚数]：渡したい枚数に置き換えてね。<T>例：@x Z 0.5"}V y(S.k==="1t"){2.h(\'#v\').J="@x 2I";2.h(\'#D\').E="※Yで使えるU枚数が15で届くよ。"}V y(S.k==="1u"){2.h(\'#v\').J="@x 2J";2.h(\'#D\').E="※入金先のUアドレスと入金キーが15で届くよ。"}V y(S.k==="1v"){2.h(\'#v\').J="@x 1A [Uアドレス] [枚数]";2.h(\'#D\').E="[Uアドレス]：出金先のUアドレスに置き換えてね。<T>[枚数]：出金する枚数に置き換えてね。<T>※出金可能最大値は「保有枚数-Uの送金手数料」だよ。<T>例：@x 1A 2K 0.5"}V y(S.k==="1w"){2.h(\'#v\').J="@x 2L";2.h(\'#D\').E="※直近20件の履歴が15で届くよ。"}}W 1B(){y(2.h(\'#v\').J.2M>0){2.h(\'#v\').2N();2.2O("2P");2Q("コピーしたよ！\\r\\n置換箇所がある場合は置換し忘れにご注意を！")}}2R(1C 2S 2.2T(\'I\')){1C.16(\'17\',1z)}2.h(\'#1p\').16(\'17\',1y);2.h(\'#v\').16(\'17\',1B)}())',62,180,'||document||5px||div|font||||||||||querySelector|color|border|id|style|10px||rgba|size|background||radius|margin|15px|TIPLSK_TEXT|padding|tiplsk|if||solid|weight|bold|TIPLSK_NOTE|innerHTML|var|666|1px|TIPLSK_BUTTON|value|class|13px|999|fff|box|shadow|2px|4px|this|br|LSK|else|function|240|Tiplsk|tip|TIPLSK_BOOKMARKLET|50|left|width|255|DM|addEventListener|click|index|position|top|calc|250px|height|500px|80|text|Pro|12px|href|https|target|_blank|nbsp|false|TIPLSK_CLOSE|100|TIPLSK_T1|TIPLSK_T2|TIPLSK_B|TIPLSK_D|TIPLSK_W|TIPLSK_H|readonly|fncTIPLSK_CLOSE|fncTIPLSK_BUTTON_CLICK|withdraw|fncTIPLSK_COMMAND_COPY|elem|return|createElement|10000|fixed|150|line|normal|align|family|Arial|W3|Hiragino|Kaku|Gothic|Osaka|Meiryo|MS|PGothic|sans|serif|420px|3px|0px||20px|important|22px|120|200|Helper|lisknonanika|github|io|tiplisk|howto|html|docs|google|com|presentation|2PACX|1vTaJ3FTqwG6FlqHejAanStBpn5K3kZBpQu7gIqX25RLoG7nel3FxeiZWsy8u3wb|WEu6fcDuBj9ci4H|pub|start|loop|delayms|3000|slide|p1|how|to|10001|absolute|right|18px|input|type|ffc|460px|placeholder|00f|body|appendChild|remove|Twitter|ys_mdmg|balance|deposit|1234567890123456L|history|length|select|execCommand|Copy|alert|for|of|getElementsByClassName'.split('|'),0,{}))
```

## 参考：Tiplskブックマークレット(最小化前)
コマンド部分を編集すれば他のチップBOTちゃん達用にも出来るかも。。？
```JavaScript:bookmarklet.js
javascript:
(function(){
  if(document.querySelector('#TIPLSK_BOOKMARKLET')) return;
  var TIPLSK_BOOKMARKLET = document.createElement('div');
  TIPLSK_BOOKMARKLET.id='TIPLSK_BOOKMARKLET';
  TIPLSK_BOOKMARKLET.style='z-index:10000;position:fixed;top:calc(50% - 250px);left:calc(50% - 250px);height:500px;width:500px;background-color:rgba(240,240,255,0.9);border:5px solid rgba(50,80,150,0.5);border-radius:10px;line-height: normal;text-align:left;font-family:Arial,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro",Osaka,"メイリオ",Meiryo,"ＭＳ Ｐゴシック","MS PGothic",sans-serif;';
  var TIPLSK_TITLE = '<div style="width:420px;margin:3px 10px;padding:5px 0px 5px 20px !important;font-size:22px;font-weight:bold;background-color:rgba(80,120,200,0.5);border-radius:10px;">Tiplsk Helper!</div>';
  var TIPLSK_LINK = '<div style="margin: 5px 15px;font-size:12px;">' +
                    '<a href="https://lisknonanika.github.io/tiplisk/howto.html" target="_blank">Tiplskの使い方</a>' +
                    '&nbsp;/&nbsp;' +
                    '<a href="https://docs.google.com/presentation/d/e/2PACX-1vTaJ3FTqwG6FlqHejAanStBpn5K3kZBpQu7gIqX25RLoG7nel3FxeiZWsy8u3wb-WEu6fcDuBj9ci4H/pub?start=false&loop=false&delayms=3000&slide=id.p1" target="_blank">how to Tiplsk</a>' +
                    '</div>';
  var TIPLSK_CLOSE = '<div id="TIPLSK_CLOSE" style="z-index:10001;position:absolute;top:5px;right:5px;font-size:18px;color:#666;font-weight:bold;padding:5px 10px;border:1px solid rgba(240,240,255,1);border-radius:10px;background-color:rgba(255,100,100,0.8);">×</div>';
  var TIPLSK_BUTTON = '<div id="TIPLSK_T1" class="TIPLSK_BUTTON" style="font-size:13px;font-weight:bold;color:#666;border: 1px solid #999;border-radius:5px;background-color:#fff;padding:10px;margin:5px 15px;box-shadow: 0 2px 4px rgba(0,0,0,0.3);">・誰かにチップ</div>' +
                      '<div id="TIPLSK_T2" class="TIPLSK_BUTTON" style="font-size:13px;font-weight:bold;color:#666;border: 1px solid #999;border-radius:5px;background-color:#fff;padding:10px;margin:5px 15px;box-shadow: 0 2px 4px rgba(0,0,0,0.3);">・リプライでチップ</div>' +
                      '<div id="TIPLSK_B" class="TIPLSK_BUTTON" style="font-size:13px;font-weight:bold;color:#666;border: 1px solid #999;border-radius:5px;background-color:#fff;padding:10px;margin:5px 15px;box-shadow: 0 2px 4px rgba(0,0,0,0.3);">・残高確認</div>' +
                      '<div id="TIPLSK_D" class="TIPLSK_BUTTON" style="font-size:13px;font-weight:bold;color:#666;border: 1px solid #999;border-radius:5px;background-color:#fff;padding:10px;margin:5px 15px;box-shadow: 0 2px 4px rgba(0,0,0,0.3);">・入金キー発行</div>' +
                      '<div id="TIPLSK_W" class="TIPLSK_BUTTON" style="font-size:13px;font-weight:bold;color:#666;border: 1px solid #999;border-radius:5px;background-color:#fff;padding:10px;margin:5px 15px;box-shadow: 0 2px 4px rgba(0,0,0,0.3);">・出金</div>' +
                      '<div id="TIPLSK_H" class="TIPLSK_BUTTON" style="font-size:13px;font-weight:bold;color:#666;border: 1px solid #999;border-radius:5px;background-color:#fff;padding:10px;margin:5px 15px;box-shadow: 0 2px 4px rgba(0,0,0,0.3);">・履歴確認</div>';
  var TIPLSK_TEXT = '<input type="text" id="TIPLSK_TEXT" style="font-size:15px;margin:5px 15px;background-color:#ffc;border-radius:5px;width: 460px;padding: 10px 5px;" readonly="readonly" placeholder="コマンドがここに出力されるよ"/>';
  var TIPLSK_NOTE = '<div id="TIPLSK_NOTE" style="font-size:12px;color:#00f;margin-left: 15px;"></div>';

  TIPLSK_BOOKMARKLET.innerHTML= TIPLSK_TITLE + TIPLSK_LINK + TIPLSK_CLOSE + TIPLSK_BUTTON + TIPLSK_TEXT + TIPLSK_NOTE;
  document.body.appendChild(TIPLSK_BOOKMARKLET);

  function fncTIPLSK_CLOSE(){
    document.querySelector('#TIPLSK_BOOKMARKLET').remove();
  }
  function fncTIPLSK_BUTTON_CLICK(){
    document.querySelector('#TIPLSK_NOTE').innerHTML="";
    if(this.id==="TIPLSK_T1") {
      document.querySelector('#TIPLSK_TEXT').value="@tiplsk tip [ユーザー名] [枚数]";
      document.querySelector('#TIPLSK_NOTE').innerHTML="[ユーザー名]：渡す相手のTwitterのユーザー名に置き換えてね。<br>[枚数]：渡す枚数に置き換えてね。<br>例：@tiplsk tip @ys_mdmg 0.5";
    } else if(this.id==="TIPLSK_T2") {
      document.querySelector('#TIPLSK_TEXT').value="@tiplsk tip [枚数]";
      document.querySelector('#TIPLSK_NOTE').innerHTML="[枚数]：渡したい枚数に置き換えてね。<br>例：@tiplsk tip 0.5";
    } else if(this.id==="TIPLSK_B") {
      document.querySelector('#TIPLSK_TEXT').value="@tiplsk balance";
      document.querySelector('#TIPLSK_NOTE').innerHTML="※Tiplskで使えるLSK枚数がDMで届くよ。";
    } else if(this.id==="TIPLSK_D") {
      document.querySelector('#TIPLSK_TEXT').value="@tiplsk deposit";
      document.querySelector('#TIPLSK_NOTE').innerHTML="※入金先のLSKアドレスと入金キーがDMで届くよ。";
    } else if(this.id==="TIPLSK_W") {
      document.querySelector('#TIPLSK_TEXT').value="@tiplsk withdraw [LSKアドレス] [枚数]";
      document.querySelector('#TIPLSK_NOTE').innerHTML="[LSKアドレス]：出金先のLSKアドレスに置き換えてね。<br>[枚数]：出金する枚数に置き換えてね。<br>※出金可能最大値は「保有枚数-LSKの送金手数料」だよ。<br>例：@tiplsk withdraw 1234567890123456L 0.5";
    } else if(this.id==="TIPLSK_H") {
      document.querySelector('#TIPLSK_TEXT').value="@tiplsk history";
      document.querySelector('#TIPLSK_NOTE').innerHTML="※直近20件の履歴がDMで届くよ。";
    }
  }
  function fncTIPLSK_COMMAND_COPY(){
    if(document.querySelector('#TIPLSK_TEXT').value.length>0){
      document.querySelector('#TIPLSK_TEXT').select();
      document.execCommand("Copy");
      alert("コピーしたよ！\r\n置換箇所がある場合は置換し忘れにご注意を！");
    }
  }
  for(elem of document.getElementsByClassName('TIPLSK_BUTTON')){elem.addEventListener('click',fncTIPLSK_BUTTON_CLICK);}
  document.querySelector('#TIPLSK_CLOSE').addEventListener('click',fncTIPLSK_CLOSE);
  document.querySelector('#TIPLSK_TEXT').addEventListener('click',fncTIPLSK_COMMAND_COPY);
}())
```

[戻る](https://lisknonanika.github.io/tiplisk/)
