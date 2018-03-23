import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ToastController } from 'ionic-angular';

enum UnitToMs {
  minutes = 60000,
  seconds = 1000
}
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public form: FormGroup;
  public submitted = false;
  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private vibration: Vibration,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private toast: ToastController
  ) {
    this.form = this.formBuilder.group({
      'min': ['',[Validators.required]],
      'max': ['',[Validators.required]],
      'unit':[null,[Validators.required]],
      'text':['']
    });
  }

  public onSubmit() {
    this.submitted = true;
    this.backgroundMode.enable();
    let min = this.form.controls['min'].value;
    let max = this.form.controls['max'].value;
    let unit = this.form.controls['unit'].value;
    let text = this.form.controls['text'].value;
    let timeout = this.randomIntFromInterval((+UnitToMs[unit] * + min), (+UnitToMs[unit] * + max));
    console.log(timeout);
    setTimeout(() => {
      this.vibration.vibrate(200);
      console.log('Firing notification');
      this.localNotifications.schedule({
        id: 1,
        text: text ? text : 'Time\'s up! (Alarm was set for ' + timeout / +UnitToMs[unit] + ' ' + unit + ')' ,
        title: 'Random Timer',
        smallIcon: 'file://assets/icon/icon.png'
      });
      this.submitted = false;
      this.backgroundMode.disable();
    }, timeout);
    console.log('Firing toast');
    let toast = this.toast.create({
      message:'Reminder set for somewhere between ' + min + ' and ' + max + ' ' + unit,
      duration: 2000
    });
    toast.present();
  }

  public numbersInvalid() {
    let min = this.form.controls['min'].value;
    let max = this.form.controls['max'].value;
    return max && min && (max < min);
  }

  private randomIntFromInterval(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

}
