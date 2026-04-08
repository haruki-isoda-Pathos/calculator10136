import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
selector:"app-root",
imports: [CommonModule],
templateUrl: "./app.component.html",
styleUrl: "./app.component.css",
})

export class AppComponent { 
//文字としてとらえないと桁追加も小数点表示も空定義もできない。これ配列じゃないけど箱化していいと思う。
curNumber: string = "" //入力保管用
curNumber2: string = "" //入力保管用
storNumber: string = "" //入力保管用
prevNumber: string = "" //計算用
prevNumber2: string = "" //出力準備用２（計算結果保管用）
prevMinor: string = "" //result２数字表示処理専用
ejeNumber: string = "" //避難用
operator: string = "" //演算子格納用
isMinus: boolean = false //マイナス表示のためのもの。こいつがtrueだとhtml上でisMinorがtrueになる。
result: string = "0" //このほうが安全か？数字はstringにできても。符号はnumberにできないから。
result2: string = "0" //計算結果マイナス表示用。

onClickNumber(num: string) {
this.result = ''
this.result2 = ''
this.isMinus = false //符号→数字入力は符号無視。
this.curNumber += num //イニシャルの0を消してその後数を入れる。
if (this.curNumber.length <= 10) { 
this.prevNumber = this.curNumber //ケタ入力防止措置。このprevNumberで計算していく。
} 
this.result = this.prevNumber //入力数字表示用。
}

onClickFunction(min: string) { 
  //isMinus=true(htmlにマイナスを返す)シナリオは3つ。計算結果がマイナス1。数字の後の―ボタン2。―ボタンを最初に単独で押した場合3
  if (min === '-' && this.prevNumber !== '') { //パターン２の処理
    this.isMinus = !this.isMinus //boolean値反転
    this.prevNumber = String(Number(this.prevNumber) * -1) //計算用のprevNumberに符号反転させて上書き(Nubmer押さない限り、このprevNumberはresultに上書きされないので表示の面では出てこない。)
    this.prevMinor = String(Math.abs(Number(this.prevNumber)))
    this.result2 = this.prevMinor //表示用に加工したものを投影。
  } else if (min === '-') { //パターン３
    this.isMinus = !this.isMinus
  } else this.isMinus = false
 //状態変化と判定は分けるべきらしい。　
}

//パターン１は-ボタンを押すこととは別の話なので、ここで処理されるべきではない。

get isMinor(): boolean { 
return this.isMinus //resultは常にプラス（Math.abs()）でないといかんのだが、しかし、計算結果がマイナスの時にthis.isMinusはtrueでなくてはならない。
}

/*
get result2(): string { //入力、ならびに計算結果マイナス時の数字の表示としてresult2
  if (this.isMinus) { //入力のほう。resultの値をそのままresult2としてhtmlに渡す。
    return this.result
  } else if (this.isMinus = true && this.prevMinor !== ''){ //計算結果マイナス時に絶対値の値を返すもの。
    //const num = Number(this.prevNumber2)
    //if (isNaN(num)) return this.prevNumber2
    return this.prevMinor
  } else {
    return this.result
  }
  */
 
  /*
  else if (Number(this.prevNumber2) < 0) {//計算結果のほう
    this.isMinus = true
    return String(Math.abs(Number(this.prevMinor)))  //マイナスモードオンにして、resultを加工してresult2としてhtmlに渡す。
    //return String(Math.abs(Number(this.prevNumber2))) 
  } else {
    this.result = this.prevNumber2.slice(0,10) 
    return this.result
  }
  */
//演算子入力でなく、次の数字入力から消え手数字になるのって、どうする？？

onClickOperator(opr: string) { //まずはresultに格納して(表示させておいて)、そののちprevと結合させたものをresultに塗り替える。
  this.storNumber = this.prevNumber //演算子入力をもって、いったんsoreNumberを確定（計算ロットに待避させる）。★これだとstorNumberで渋滞して値分けられないよね。
  this.operator = opr //基本上書きが繰り返されるだけだから、これで重登録防止しているかと。★できてない。
  this.curNumber = ''
  this.prevNumber = '' //prevNumberとcurNumberリセット。表示はresultに入っているし入力数字はstorNumberに入っているから安心です。
}
//★これだと演算子入力＝結果、にならん。

onClickCe() { //storNumberは絶対に消してはいけない。
this.curNumber = '' 
this.prevNumber = '' //この２つで入力内容消去。前項の値はstorNumberに待避させているから問題なし。
this.result = '0' //0表示
this.isMinus = false //ー対応？
/*構造の整理。

ボタン入力されたとき
curNumberに入力される。
curNumberは桁加工した計算用のprevNumberに入り、prevNumberはそのまま表示（result）に上書きされる。

ファンクションされたとき
prevNumberに何かしかが入力されていた場合、prevNumber符号反転。
（そうでないときは-だけ表示）

保管用のstorNumberにprevNumberを入れるのは演算子入れたときのはずだ。でないと、次の数字入力で箱を分けられない。

どこにresult持ってくるべきか問題。
入力した数字の表示についてもボタンプロパティで行うのでなく、getで逐一行うのだと思う。でないと不都合（忘れた）。

*/
}

onClickC() {
this.curNumber = "" //入力保管用
this.curNumber2 = "" //入力保管用
this.storNumber = "" //入力保管用
this.prevNumber = "" //計算用
this.prevNumber2 = "" //出力準備用２（計算結果保管用）
this.ejeNumber = "" //避難用
this.operator = "" //演算子格納用
this.isMinus = false //マイナス表示のためのもの
this.result = "0"
}

/*
onClickDecimal() { 
}
*/

onClickEquals() {  //★計算結果マイナスの時に、isMinorに送り込む設定ができていない。

  this.curNumber2 = this.prevNumber //後項入力をcurNumber2に入れる。

  if (this.operator === '+') {
    this.prevNumber2 = String(Number(this.storNumber) + Number(this.curNumber2))  //result上書きdで表示　
  } else if (this.operator === '-') {
    this.prevNumber2 = String(Number(this.storNumber) - Number(this.curNumber2))
  } else if (this.operator === '*') {
    this.prevNumber2 = String(Number(this.storNumber) * Number(this.curNumber2)) 
  } else if (this.operator === '/') {
    this.prevNumber2 = String(Number(this.storNumber) / Number(this.curNumber2))
  } else if (this.operator === '√') {
    this.prevNumber2 = String(Math.sqrt(Number(this.storNumber))) 
  } else if (this.operator === '%') {
    this.prevNumber2 
  }

  if (Number(this.prevNumber2) < 0) {
    this.isMinus = true
    this.result2 = String(Math.abs(Number(this.prevNumber2)))
  } else {
    this.isMinus = false
    this.result = this.prevNumber2
  }
  /*
  if (Number(this.prevNumber2) > 0) {
    this.prevMinor = this.prevNumber2
    return this.result2
  } else{
   */
  /*
  if (Number(this.prevNumber2) >= 0) {//resultとしてhtmlに返すものをprevNumber2がプラスの場合に限定。
    this.result = this.prevNumber2.slice(0,10) //すべてのreturn.this.resultにslice加工（文字列制御）
    return this.result
  } else {
    this.prevMinor = String(Math.abs(Number(this.prevNumber2))) 
    return this.prevNumber
  }
    */
}


get isError(): boolean {  //計算結果桁エラーのエラーケースの定義とE表示（htmlの仕事）
    return Number(this.prevNumber2) >= 10000000000 //計算結果の桁エラー（E表示）の場合はひとまずこれだけ。下振れは０表示。
}

get displayText(): string { //エラーケースの数字処理。条件分岐付き。
    if (this.isError) {  
      const intCount = Math.abs(Number(this.prevNumber2)).toString().split('.')[0].length//桁割する際のマニュアルを作成。一応Math.absで絶対値化。小数点で分割（なくてもよい）し、配列の最初を取得。
      const display = String(Number(this.prevNumber2) / 10**(intCount - 1)) //小数点の位置指定があるので、割り算は桁マニュアル。（prevNumber2は入力制御にかからないなら、小数点も含めて何ケタにでもなりえる。（1000000000000.355とか））
      const displayNumber = Number(display)
      const factor = 10 ** 8
      const truncated = Math.floor(displayNumber * factor) / factor //規定桁以下を切り捨てる。
      const ans = truncated.toFixed(8) //小数点表示を8ケタまで強制する。
      return ans
      /*
      const length = this.prevNumber2.length
      const display = Number(this.prevNumber2)
      const decimalLength = 10 - length - 1
      const ans = display.toFixed(Math.max(decimalLength, 0))
      return String(ans)
      */
    } else 
    this.result = this.prevNumber2.slice(0,10)
    return this.result
  }

}





