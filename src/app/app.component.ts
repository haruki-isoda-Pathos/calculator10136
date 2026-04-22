import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
selector:"app-root",
imports: [CommonModule],
templateUrl: "./app.component.html",
styleUrl: "./app.component.css",
})

export class AppComponent { 

displayNumber: string = '0' //表示用
numberA: string = '' //桁加工前
numberB: string = '' //桁加工後（計算用）
numberC: string = '' //前項待避用
operator: string = '' //演算子格納用
preNum: string = '' //前項
latNum: string = '' //後項
result: string = '' //計算結果保存用←不要論。

dif: boolean = false//＊３＊＝と２＋３ー（５）＝　区別フラッグ
pending: boolean = false //演算子後フラッグ
endCalc: boolean = false //＝後フラッグ
error: boolean = false //エラーフラッグ
accomp: boolean = false //後項入力終了フラッグ
methOne: boolean = false // 連続演算用フラッグ
methTwo: boolean = false //連続演算用フラッグ
methThree: boolean = false //連続演算用フラッグ

onClickNumber(num: string) {
  if (this.operator == '') {this.dif = true}
  this.methOne = false
  this.methTwo = false 
  this.methThree = false
  if (this.endCalc) {
    this.numberC = this.displayNumber
    this.endCalc = false
  }
  this.numberA += num
  if (!this.numberA.includes(".") && num == '.') { this.numberA += '.' }
  this.numberB = this.digitMod(this.numberA)
  this.displayNumber = this.numberB
  if (this.operator != '') {this.accomp = true}
}

digitMod(curNumber: string): string {
  let [intPart, decimalPart = ''] = curNumber.split('.')
  intPart = intPart.slice(0,10)
  decimalPart = decimalPart.slice(0,8)
  return decimalPart ? `${intPart}.${decimalPart}` : `${intPart}`
}

onClickOperator(opr: string) {
  this.methOne = false
  this.methTwo = false
  this.methThree = false
  if (this.numberB == '') {
    this.operator = opr
    return
  }
  if (this.operator != '' && this.accomp) {
    this.onClickEquals()
    this.methOne = false
    this.methTwo = true
    this.operator = opr
    this.pending = true
    this.numberA = ''
    if (this.numberC == '') {this.numberC = this.displayNumber}
    this.endCalc = true
  } else {
    if (!this.endCalc) {this.numberC = this.displayNumber}
    this.operator = opr
    this.pending = true
    this.numberA = ''
    if (this.endCalc) {this.methTwo = true}
  }
}

onClickEquals() {
  this.numberA = ''
  this.endCalc = true
  if (this.operator == '') { 
    this.pending = false
    this.accomp = false
    return 
  } 
  if (this.methOne) {
    this.calcMethodOne()
    this.displayNumber = this.calculation()
    this.pending = false
    this.accomp = false
    return this.displayNumber
  }
  if (this.methTwo) {
    this.numberC = this.displayNumber
    this.calcMethodTwo()
    this.displayNumber = this.calculation()
    this.pending = false
    this.accomp = false
    if (this.dif) {
      this.methTwo = false
      this.methThree = true
    }
    return this.displayNumber
  }
  if (this.methThree) {
    this.calcMethodThree()
    this.displayNumber = this.calculation()
    this.pending = false
    this.accomp = false
    return this.displayNumber
  }
  if (this.numberC != '' && !this.accomp) {
    switch (this.operator) {
      case '+' : this.preNum = '0', this.latNum = this.numberB
      break
      case '-' : this.preNum = '0', this.latNum = this.numberB
      break
      case '*' : this.preNum = this.numberB, this.latNum = this.numberB
      break
      case '/' : this.preNum = '1', this.latNum = this.numberB
      }
  this.methOne = true
  this.displayNumber = this.calculation()
  this.pending = false
  this.accomp = false
  return this.displayNumber
  } 
  if (this.numberC == '' && this.accomp) {
    this.preNum = '0'
    this.latNum = this.numberB
    this.displayNumber = this.calculation()
    this.methOne = true
    this.pending = false
    this.accomp = false
  return this.displayNumber
  }
  else {
    this.calcMethodDef()
    this.displayNumber = this.calculation()
    this.methOne = true
    this.pending = false
    this.accomp = false
  return this.displayNumber
  }
}

calcMethodDef() {
  this.preNum = this.numberC
  this.latNum = this.displayNumber
}

calcMethodOne() {
  this.preNum = this.displayNumber
  this.latNum = this.numberB 
}

calcMethodTwo() {
  this.preNum = this.numberB
  this.latNum = this.displayNumber 
}

calcMethodThree() {
  this.preNum = this.displayNumber
  this.latNum = this.numberC
}

calculation () {
  if (this.operator == '/' && (this.latNum == '' || this.latNum == '0')) {
      this.error = true
    }
    if (this.operator == '/' && this.preNum == '1' && this.latNum == '') {
      this.error = true 
    }
      switch (this.operator) {
        case '+' : return String(Number(this.preNum) + Number(this.latNum))
        case '-' : return String(Number(this.preNum) - Number(this.latNum))
        case '*' : return String(Number(this.preNum) * Number(this.latNum))
        case '/' : return String(Number(this.preNum) / Number(this.latNum)) 
        default : return this.numberB
      }
}

onClickFunction() {
  this.displayNumber = String(Number(this.displayNumber) * -1) 
  if (this.pending && !this.endCalc) {
    this.numberC = String(Number(this.numberC) * -1)
  }
}

onClickCe() {
 this.displayNumber = '0'
 this.numberA = ''
 this.numberB = ''
}

onClickC() {
  this.displayNumber = '0' //表示用
  this.numberA = '' //桁加工前
  this.numberB = '' //桁加工後（計算用）
  this.numberC = '' //前項待避用
  this.operator = '' //演算子格納用
  this.preNum = '' //前項
  this.latNum = '' //後項
  this.result = '' //計算結果保存用
  
  this.dif = false
  this.pending = false
  this.endCalc = false 
  this.error = false 
  this.accomp = false 
  this.methOne = false 
  this.methTwo = false 
  this.methThree = false
}

errorProperty() {
 if (Number(this.displayNumber) >= 10000000000) {
  this.error = true
 } 
 if (this.displayNumber.includes('.')) {
  const dig = this.displayNumber.split('.')[1]
  if (dig.length > 8) {
    this.error = true
  }
 }
 if (Number(this.displayNumber) <= 10000000000) {
  this.error = true
 }
}

get displayText(): string {
  return this.displayNumber
} 

get isError(): boolean { 
  return this.error
}

onClickPercent() {}

onClickSquare() {}

}





