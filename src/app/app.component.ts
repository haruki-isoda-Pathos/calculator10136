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
curNumber: string = "" //計算用１
curNumber2: string = "" //計算用２
storNumber: string = "" //入力保管用
prevNumber: string = "" //出力準備用
prevNumber2: string = "" //出力準備用２（計算結果保管用）
ejeNumber: string = "" //避難用
operator: string = "" //演算子格納用
isMinus: boolean = false //マイナス表示のためのもの
result: string = "0"; //このほうが安全か？数字はstringにできても。符号はnumberにできないから。

onClickNumber(num: string) {
this.result = ''
this.isMinus = false //符号→数字入力は符号無視。
this.curNumber += num //イニシャルの0を消してその後数を入れる。注意したいのは、curNumberこそ、計算用の値である。
if (this.curNumber.length <= 10) { 
this.prevNumber = this.curNumber //11ケタ以上入力防止措置。
} 
this.result = this.prevNumber //入力数字表示用。
}

onClickFunction(min: string) { 
  //isMinus=true(htmlにマイナスを返す)シナリオは3つ。計算結果がマイナス1。数字の後の―ボタン2。―ボタンを最初に単独で押した場合3
  if (min === '-' && this.curNumber !== '') { //パターン２の処理
    this.isMinus = !this.isMinus //boolean値反転
    this.curNumber = String(Number(this.curNumber) * -1) //curNumber符号反転させて上書き
  } else if (min === '-') { //パターン３
    this.isMinus = !this.isMinus
  } else this.isMinus = false
 //状態変化と判定は分けるべきらしい。　
}

//パターン１は-ボタンを押すこととは別の話なので、ここで処理されるべきではない。

get isMinor(): boolean { 
return this.isMinus 
}

//演算子入力でなく、次の数字入力から消え手数字になるのって、どうする？？

onClickOperator(opr: string) { //まずはresultに格納して(表示させておいて)、そののちprevと結合させたものをresultに塗り替える。
  this.storNumber = this.curNumber //演算子入力をもって、いったんsoreNumberを確定（計算ロットに待避させる）。★これだとstorNumberで渋滞して値分けられないよね。
  this.operator = opr //基本上書きが繰り返されるだけだから、これで重登録防止しているかと。
  this.curNumber = '' //curNumberリセット。表示はほかの箱に入っているから安心です。
}
//★これだと演算子入力＝結果、にならん。

onClickCe() { //この機能がある以上、prevNumberとcurNumberでわけたほうがいいですね。
this.curNumber = '0' //入力内容消去
this.result = '0' //0表示
/*構造の整理。

★ボタン入力されたとき
curNumberに入力される。
curNumberは値保管用のprevNumberに入り、prevNumberはそのまま表示（result）に上書きされる。

★ファンクションされたとき
curNumberに何かしかが入力されていた場合、curNumber符号反転。
（そうでないときは-だけ表示）

★
保管用のstorNumberにcurNumberを入れるのは演算子入れたときのはずだ。でないと、次の数字入力で箱を分けられない。

★どこにresult持ってくるべきか問題。
入力した数字の表示についてもボタンプロパティで行うのでなく、getで逐一行うのだと思う。でないと不都合（忘れた）。

*/
}

onClickC() {
this.prevNumber = ''
this.curNumber = ''
this.operator = ''
this.result = '0'
this.isMinus = false
}

/*
onClickDecimal() { 
}
*/

onClickEquals() {  //★計算結果マイナスの時に、isMinorに送り込む設定ができていない。

  this.curNumber2 = this.curNumber

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
  this.result = this.prevNumber2.slice(0,10) //すべてのreturn.this.resultにslice加工（文字列制御）
  return this.result
  
}

get isError(): boolean {  //計算結果桁エラーのエラーケースの定義とE表示（htmlの仕事）
    return Number(this.prevNumber2) >= 10000000000
}

get displayText(): string { //エラーケースの数字処理。条件分岐付き。
    if (this.isError) {  
      this.prevNumber2 = String(Number(this.prevNumber2) / 10000000000)
      const length = this.prevNumber2.length
      const display = Number(this.prevNumber2)
      const decimalLength = 10 - length - 1
      const ans = display.toFixed(Math.max(decimalLength, 0))
      return String(ans)
    } else 
    this.result = this.prevNumber2.slice(0,10)
    return this.result
  }

} 



