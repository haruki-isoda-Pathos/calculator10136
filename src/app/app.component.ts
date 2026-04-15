import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
selector:"app-root",
imports: [CommonModule],
templateUrl: "./app.component.html",
styleUrl: "./app.component.css",
})

export class AppComponent { 

curNumber: string = "" //入力保管用(桁加工前）
curNumber2: string = "" //入力保管用(桁加工後の計算用。onClickFunctionの便宜上必要)　
preNumber: string = "" //displayにマイナスが出ないようにするために噛ませるプロパティ
prevItem: string = "" //値保管用(前項逃がし用)
constant: string = "" //定数格納用
baseValue: string = "" //デフォルト値格納用
preItem: string = "" //計算コマンド用前項
latItem: string = "" //計算コマンド用後項

iniResult: string = "0" //計算結果保存用（プラスならdisplayNumberへ焼き、マイナスならdisplayMinNumberへ焼く。）
displayNumber: string = "0" //表示用。result直送
displayOverNumber: string = "0" //オバー値表示用。displayText直送

operator: string = "" //演算子格納用

isMinus: boolean = false //マイナス表示のためのもの。こいつがtrueだとhtml上でisMinorがtrueになる。
operandFrag: boolean = false //状態管理フラッグ。演算子入力直後、数字入力直前ならtrue。
pendingFrag: boolean = false //=でのデフォ値指定用。operandFrag下の数字入力完了でtrueになる。

onClickNumber(num: string) {
if (this.operandFrag) {
  this.isMinus = false
  this.curNumber += num 
  if (!this.curNumber.includes(".")) { this.curNumber += '.' }
  this.curNumber2 = this.curNumber.slice(0,10)
  this.preNumber = this.curNumber2
  this.displayNumber = this.preNumber
  this.operandFrag = false
  this.pendingFrag = true
} else {
  this.isMinus = false
  this.curNumber += num
  if (!this.curNumber.includes(".")) { this.curNumber += '.' }
  this.curNumber2 = this.curNumber.slice(0,10) 
  this.preNumber = this.curNumber2
  this.displayNumber = this.preNumber
}
}

onClickFunction(min: string) { 
  //isMinus=true(htmlにマイナスを返す)シナリオは3つ。計算結果がマイナス1。数字の後の―ボタン2。―ボタンを最初に単独で押した場合3
  if (min === '-' && this.curNumber2 !== '') { //パターン２
    this.isMinus = !this.isMinus 
    this.curNumber2 = String(Number(this.curNumber2) * -1) //計算用の値のみマイナスに。
  } else if (min === '-') { //パターン３
    this.isMinus = !this.isMinus
  } else {
    this.isMinus = false
  }
}

onClickOperator(opr: string) { 
  if (this.pendingFrag && !this.operandFrag) {
    this.preItem = this.prevItem
    this.latItem = this.curNumber2
    this.iniResult = this.calculation()
    if (Number(this.iniResult) < 0) { this.isMinus = true } 
    this.curNumber2 = this.iniResult
    this.operator = opr
    return this.displayShifting()
  } 
  if (!this.pendingFrag && this.operandFrag) {
    this.constant = this.prevItem
  } 
  this.operator = opr
  this.prevItem = this.curNumber2
  this.operandFrag = true
  this.curNumber = ''
  this.pendingFrag = false
  return
}

onClickEquals() {  //★計算結果マイナスの時に、isMinorに送り込む設定ができていない。
  this.isMinus = false
  this.constant = this.prevItem
  if (!this.operandFrag && this.pendingFrag && this.prevItem == '') {
    this.constant = this.curNumber2
    this.preItem = '0'
    this.latItem = this.constant
    this.iniResult = this.calculation()
    if (Number(this.iniResult) < 0) { this.isMinus = true } 
    return this.displayShifting()
  } 
  if (this.operandFrag && !this.pendingFrag) {
    switch (this.operator) {
      case '+' : this.preItem = '0', this.latItem = this.constant
      break
      case '-' : this.preItem = '0', this.latItem = this.constant
      break
      case '*' : this.preItem = this.constant, this.latItem = this.constant
      break
      case '/' : this.preItem = '1', this.latItem = this.constant
    }
    this.iniResult = this.calculation()
    if (Number(this.iniResult) < 0) { this.isMinus = true } 
    return this.displayShifting()
  }
  if (!this.operandFrag && !this.pendingFrag) {
    this.constant = this.curNumber2
    this.iniResult = this.constant
    if (Number(this.iniResult) < 0) { this.isMinus = true } 
    return this.displayShifting()
  } 
  if (!this.operandFrag && this.pendingFrag) {
    this.preItem = this.constant
    this.latItem = this.curNumber2
    this.iniResult = this.calculation()
    if (Number(this.iniResult) < 0) { this.isMinus = true } 
    return this.displayShifting()
  } 
  this.pendingFrag = false
  return;
  }

calculation(): string { 
    switch (this.operator) {
      case '+' : return String(Number(this.preItem) + Number(this.latItem))
      case '-' : return String(Number(this.preItem) - Number(this.latItem))
      case '*' : return String(Number(this.preItem) * Number(this.latItem))
      case '/' : return String(Number(this.preItem) / Number(this.latItem))
      default : return ''
    }
} 

onClickPercent() {
  if (!this.operandFrag && !this.pendingFrag) {
    this.curNumber2 = '0'
    this.prevItem = '0'
    this.displayNumber = '0'
  }   
  if (!this.operandFrag && this.pendingFrag) {
    this.preItem = this.prevItem
    this.latItem = String(Number(this.curNumber2) * 0.01)
    this.iniResult = this.calculation()
    return this.displayShifting()
  }
  return
}

onClickSquare() {
  if (Number(this.curNumber2) >= 0 && !this.prevItem) {
    const sqrt = String(Math.sqrt(Number(this.curNumber2)))
    this.prevItem = sqrt
    this.displayNumber = sqrt
  }
  else if (Number(this.curNumber2) >= 0 && this.prevItem) {
    const sqrt = String(Math.sqrt(Number(this.curNumber2)))
    this.displayNumber = sqrt
  }
   else if (Number(this.curNumber2) < 0){ 
    this.displayNumber = "E        0"
  }
}

onClickCe() { 
  this.curNumber = ''
  this.curNumber2 = ''
  this.preNumber = ''
  this.displayNumber = '' 
}

onClickC() {
  this.curNumber = ""
  this.curNumber2 = "" 
  this.preNumber = "" 
  this.prevItem = "" 
  this.constant = "" 
  this.baseValue = "" 
  this.preItem = "" 
  this.latItem = "" 
  this.iniResult = "0" 
  this.displayNumber = "0" 
  this.displayOverNumber = "0" 
  this.operator = ""
  this.isMinus = false 
  this.operandFrag = false 
  this.pendingFrag = false 
}

displayShifting() { //すみわけけ&値を加工などの表示bot
  if (Number(this.iniResult) >= 10000000000) {
    const intCount = Math.abs(Number(this.iniResult)).toString().split('.')[0].length//桁割する際のマニュアルを作成。一応Math.absで絶対値化。小数点で分割（なくてもよい）し、配列の最初を取得。
    const display = String(Number(this.iniResult) / 10**(intCount - 1)) //小数点の位置指定があるので、割り算は桁マニュアル。（prevNumber2は入力制御にかからないなら、小数点も含めて何ケタにでもなりえる。（1000000000000.355とか））
    const displayNumber = Number(display)
    const factor = 10 ** 8
    const truncated = Math.floor(displayNumber * factor) / factor //規定桁以下を切り捨てる。
    const ans = truncated.toFixed(8) //小数点表示を8ケタまで強制する。
    this.displayOverNumber = ans
    return this.displayOverNumber
  } else {
    this.displayNumber = String(Math.abs(Number(this.iniResult)))
    return this.displayNumber
  }
}

get result(): string {
  return this.displayNumber
}

get displayText(): string {
  return this.displayOverNumber
} 

get isError(): boolean { 
  return Number(this.iniResult) >= 10000000000 
}

get isMinor(): boolean { 
  return this.isMinus 
}

}





