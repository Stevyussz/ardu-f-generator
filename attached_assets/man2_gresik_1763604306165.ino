#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_PWMServoDriver.h>
#include <LiquidCrystal_I2C.h>
#include <EEPROM.h>

#define SERVOMIN  150 // this is the 'minimum' pulse length count (out of 4096)
#define SERVOMAX  600 // this is the 'maximum' pulse length count (out of 4096)

Adafruit_PWMServoDriver servo = Adafruit_PWMServoDriver();
LiquidCrystal_I2C lcd(0x27, 16, 2); // Set the LCD I2C address

String data;
int pwm_ka,pwm_ki;
int kecepatan,kec;
int speed_ = 1;
int ENA_belakang = 10;
int IN1_belakang = 29;
int IN2_belakang = 27;
int IN3_belakang = 25;
int IN4_belakang = 23;
int ENB_belakang = 9;
int ENA_depan = 12;
int IN1_depan = 37;
int IN2_depan = 35;
int IN3_depan = 33;
int IN4_depan = 31;
int ENB_depan = 11;
int IN2 = 43; 
int IN1 = 45;
int b1 = 5;     //Limit Switch Atas
int b2 = 4;     //Limit Switch Bawah
const int button1=46;
const int button2=44;
const int button3=42;
unsigned char tombol1=0;
unsigned char tombol2=0;
unsigned char tombol3=0;
int data_b1,data_b2;
uint8_t servonum = 0;
int data_sensor[10];
int xsensor,var,jumlah_indeks,jum_indeks;
int s0,s1,s2,s3,s4,s5,s6,s7,s8,s9,flag;
int ref[10],sens[10];
int sensor_now[10],maks[10];
int minimal[10]={1100,1100,1100,1100,1100,1100,1100,1100,1100,1100};
int address=0,address_speed=15,address_kons_p=20,address_kons_d=30,address_kons_i=40;
int indeks=0,laju,pi,di,ai,kons_p,kons_d,kons_i;

void maju(int pwm_ki, int pwm_ka){
  analogWrite(ENA_depan,pwm_ka);
  digitalWrite(IN1_depan, LOW);
  digitalWrite(IN2_depan, HIGH);
  analogWrite(ENA_belakang,pwm_ka);
  digitalWrite(IN1_belakang, LOW);
  digitalWrite(IN2_belakang, HIGH);

  analogWrite(ENB_depan,pwm_ki);
  digitalWrite(IN3_depan, HIGH);
  digitalWrite(IN4_depan, LOW);
  analogWrite(ENB_belakang,pwm_ki);
  digitalWrite(IN3_belakang, HIGH);
  digitalWrite(IN4_belakang, LOW);
}
void mundur(int pwm_ki, int pwm_ka){
  analogWrite(ENA_depan,pwm_ka);
  digitalWrite(IN1_depan, HIGH);
  digitalWrite(IN2_depan, LOW);
  analogWrite(ENA_belakang,pwm_ka);
  digitalWrite(IN1_belakang, HIGH);
  digitalWrite(IN2_belakang, LOW);

  analogWrite(ENB_depan,pwm_ki);
  digitalWrite(IN3_depan, LOW);
  digitalWrite(IN4_depan, HIGH);
  analogWrite(ENB_belakang,pwm_ki);
  digitalWrite(IN3_belakang, LOW);
  digitalWrite(IN4_belakang, HIGH);
}
void belka(int pwm_ki, int pwm_ka){
  analogWrite(ENA_depan,pwm_ka);
  digitalWrite(IN1_depan, HIGH);
  digitalWrite(IN2_depan, LOW);
  analogWrite(ENA_belakang,pwm_ka);
  digitalWrite(IN1_belakang, HIGH);
  digitalWrite(IN2_belakang, LOW);

  analogWrite(ENB_depan,pwm_ki);
  digitalWrite(IN3_depan, HIGH);
  digitalWrite(IN4_depan, LOW);
  analogWrite(ENB_belakang,pwm_ki);
  digitalWrite(IN3_belakang, HIGH);
  digitalWrite(IN4_belakang, LOW);
}
void belki(int pwm_ki, int pwm_ka){
  analogWrite(ENA_depan,pwm_ka);
  digitalWrite(IN1_depan, LOW);
  digitalWrite(IN2_depan, HIGH);
  analogWrite(ENA_belakang,pwm_ka);
  digitalWrite(IN1_belakang, LOW);
  digitalWrite(IN2_belakang, HIGH);

  analogWrite(ENB_depan,pwm_ki);
  digitalWrite(IN3_depan, LOW);
  digitalWrite(IN4_depan, HIGH);
  analogWrite(ENB_belakang,pwm_ki);
  digitalWrite(IN3_belakang, LOW);
  digitalWrite(IN4_belakang, HIGH);
}
void geser_kanan(int pwm_ki, int pwm_ka){
  analogWrite(ENA_depan,pwm_ka);
  digitalWrite(IN1_depan, HIGH);
  digitalWrite(IN2_depan, LOW);
  analogWrite(ENA_belakang,pwm_ka);
  digitalWrite(IN1_belakang, LOW);
  digitalWrite(IN2_belakang, HIGH);

  analogWrite(ENB_depan,pwm_ki);
  digitalWrite(IN3_depan, HIGH);
  digitalWrite(IN4_depan, LOW);
  analogWrite(ENB_belakang,pwm_ki);
  digitalWrite(IN3_belakang, LOW);
  digitalWrite(IN4_belakang, HIGH);
}
void geser_kiri(int pwm_ki, int pwm_ka){
  analogWrite(ENA_depan,pwm_ka);
  digitalWrite(IN1_depan, LOW);
  digitalWrite(IN2_depan, HIGH);
  analogWrite(ENA_belakang,pwm_ka);
  digitalWrite(IN1_belakang, HIGH);
  digitalWrite(IN2_belakang, LOW);

  analogWrite(ENB_depan,pwm_ki);
  digitalWrite(IN3_depan, LOW);
  digitalWrite(IN4_depan, HIGH);
  analogWrite(ENB_belakang,pwm_ki);
  digitalWrite(IN3_belakang, HIGH);
  digitalWrite(IN4_belakang, LOW);
}
void stopped(){
  analogWrite(ENA_depan,0);
  digitalWrite(IN1_depan, LOW);
  digitalWrite(IN2_depan, LOW);
  analogWrite(ENA_belakang,0);
  digitalWrite(IN1_belakang, LOW);
  digitalWrite(IN2_belakang, LOW);

  analogWrite(ENB_depan,0);
  digitalWrite(IN3_depan, LOW);
  digitalWrite(IN4_depan, LOW);
  analogWrite(ENB_belakang,0);
  digitalWrite(IN3_belakang, LOW);
  digitalWrite(IN4_belakang, LOW);
}
void lifter_up(){
  digitalWrite(IN2,HIGH);   
  digitalWrite(IN1,LOW);
}
void lifter_down(){
  digitalWrite(IN2,LOW);   
  digitalWrite(IN1,HIGH);
}
void lifter_stopped(){
  digitalWrite(IN1,LOW);
  digitalWrite(IN2,LOW);
}
void gripper_open(){
  servo.setPWM(0, 0, 425);   //servo kanan
  servo.setPWM(1, 0, 350);   //servo kiri
}
void gripper_close(){
  servo.setPWM(0, 0, 600);  
  servo.setPWM(1, 0, 180);
}
void baca_button(){
  data_b1=digitalRead(b1);
  data_b2=digitalRead(b2);
  tombol1=digitalRead(button1);
  tombol2=digitalRead(button2);
  tombol3=digitalRead(button3);
}
void sensing(){
  data_sensor[0]=analogRead(A0);
  data_sensor[1]=analogRead(A1);
  data_sensor[2]=analogRead(A2);
  data_sensor[3]=analogRead(A3);
  data_sensor[4]=analogRead(A4);
  data_sensor[5]=analogRead(A5);
  data_sensor[6]=analogRead(A6);
  data_sensor[7]=analogRead(A7);
  data_sensor[8]=analogRead(A8);
  data_sensor[9]=analogRead(A9);
  Serial.print(data_sensor[0]);
  Serial.print(", ");
  Serial.print(data_sensor[1]);
  Serial.print(", ");
  Serial.print(data_sensor[2]);
  Serial.print(", ");
  Serial.print(data_sensor[3]);
  Serial.print(", ");
  Serial.print(data_sensor[4]);
  Serial.print(", ");
  Serial.print(data_sensor[5]);
  Serial.print(", ");
  Serial.print(data_sensor[6]);
  Serial.print(", ");
  Serial.print(data_sensor[7]);
  Serial.print(", ");
  Serial.print(data_sensor[8]);
  Serial.print(", ");
  Serial.println(data_sensor[9]);
}
void sensing_kalibrasi(){
  sensor_now[0]=analogRead(A0);
  sensor_now[1]=analogRead(A1);
  sensor_now[2]=analogRead(A2);
  sensor_now[3]=analogRead(A3);
  sensor_now[4]=analogRead(A4);
  sensor_now[5]=analogRead(A5);
  sensor_now[6]=analogRead(A6);
  sensor_now[7]=analogRead(A7);
  sensor_now[8]=analogRead(A8);
  sensor_now[9]=analogRead(A9);
}
void read_sensor(){
  sensing();
  xsensor=1023;
  xsensor&=1023;
  if(data_sensor[0]<(sens[0]*4)){s0=0; var=1;}   else{s0=1; var=0; flag=1;} xsensor&=~var; 
  if(data_sensor[1]<(sens[1]*4)){s1=0; var=2;}   else{s1=1; var=0;} xsensor&=~var; 
  if(data_sensor[2]<(sens[2]*4)){s2=0; var=4;}   else{s2=1; var=0;} xsensor&=~var;
  if(data_sensor[3]<(sens[3]*4)){s3=0; var=8;}   else{s3=1; var=0;} xsensor&=~var;
  if(data_sensor[4]<(sens[4]*4)){s4=0; var=16;}  else{s4=1; var=0;} xsensor&=~var;
  if(data_sensor[5]<(sens[5]*4)){s5=0; var=32;}  else{s5=1; var=0;} xsensor&=~var;
  if(data_sensor[6]<(sens[6]*4)){s6=0; var=64;}  else{s6=1; var=0;} xsensor&=~var;
  if(data_sensor[7]<(sens[7]*4)){s7=0; var=128;} else{s7=1; var=0;} xsensor&=~var;
  if(data_sensor[8]<(sens[8]*4)){s8=0; var=256;} else{s8=1; var=0;} xsensor&=~var; 
  if(data_sensor[9]<(sens[9]*4)){s9=0; var=512;} else{s9=1; var=0; flag=0;} xsensor&=~var; 
}
void tampil_all_sensor(){
  read_sensor();
  lcd.setCursor(0,0);
  lcd.print(s0);
  lcd.print(s1);
  lcd.print(s2);
  lcd.print(s3);
  lcd.print(s4);
  lcd.print(s5);
  lcd.print(s6);
  lcd.print(s7);
  lcd.print(s8);
  lcd.print(s9);
  lcd.setCursor(0,1);
  lcd.print(xsensor);
  lcd.print("   ");
}
void tampil_raw_sensor(){
  lcd.setCursor(0,0);
  lcd.print(sensor_now[0]);
  lcd.setCursor(4,0);
  lcd.print(sensor_now[1]);
  lcd.setCursor(8,0);
  lcd.print(sensor_now[2]);
  lcd.setCursor(12,0);
  lcd.print(sensor_now[3]);
  lcd.setCursor(0,1);
  lcd.print(sensor_now[4]);
  lcd.setCursor(4,1);
  lcd.print(sensor_now[5]);
  lcd.setCursor(8,1);
  lcd.print(sensor_now[6]);
  lcd.setCursor(12,1);
  lcd.print(sensor_now[7]);
}
void pid(unsigned char simpan){
  unsigned int kec_maks=simpan+20;
  unsigned int kec_min=simpan-20; //30
  int kp=kons_p;    //7
  int kd=kons_d;    //4
  int ki=kons_i;    //0  
  double lastProcess = 0,sumError = 0;                                                         
  static int error,lastError,Error,LastError,SumError,right_speed,left_speed;
  
  double deltaTime = (millis() - lastProcess) / 10000.0;
  lastProcess = millis();   
          
  read_sensor();                
  switch(xsensor){
  case 0b0000110000 : error = 0; break;
  case 0b0000010000 : error = -1; break;
  case 0b0000100000 : error =  1; break;
  case 0b0000011000 : error = -2; break;
  case 0b0001100000 : error =  2; break;
  case 0b0000001000 : error = -3; break;
  case 0b0001000000 : error =  3; break;
  case 0b0000001100 : error = -4; break;
  case 0b0011000000 : error =  4; break;
  case 0b0000000100 : error = -5; break;
  case 0b0010000000 : error =  5; break;
  case 0b0000000110 : error = -6; break;
  case 0b0110000000 : error =  6; break;
  case 0b0000000010 : error = -7; break;
  case 0b0100000000 : error =  7; break;
  case 0b0000000011 : error =  -8; break;
  case 0b1100000000 : error =  8; break;
  case 0b0000000001 : error =  -9; break;
  case 0b1000000000 : error =  9; break;
  case 0:  
    if(flag==0){error=10;}
    else{error=-11;} 
      break;
    } 
  int SetPoint = 0;     
  Error = SetPoint - error; 
  sumError += Error * deltaTime;
  int outPID = kp*0.01*Error + kd*(Error - lastError)/deltaTime + 0.0001*ki*sumError;
  lastError = Error;
  
  double motorKi = simpan - outPID;     // Motor Kiri
  double motorKa = simpan + outPID;     // Motor Kanan
  
  /*** Pembatasan kecepatan ***/
  if (motorKi > kec_maks)motorKi = kec_maks;
  if (motorKi < kec_min)motorKi = kec_min;
  if (motorKa > kec_maks)motorKa = kec_maks;
  if (motorKa < kec_min)motorKa = kec_min;
   
  if(motorKi==motorKa){  
    maju(simpan,simpan);
  }
  else if(motorKi>motorKa){
    belka(motorKi,motorKa);
  }
  else if(motorKa>motorKi){
    belki(motorKi,motorKa);
  }
}
void kalibrasi2(){
  sensing_kalibrasi();
  tampil_raw_sensor();
  for(int i=0;i<=9;i++){
    if(sensor_now[i]>maks[i]){
      maks[i]=sensor_now[i];
    }
    else if(sensor_now[i]<minimal[i]){
      minimal[i]=sensor_now[i];
    }
    ref[i]=(((maks[i]-minimal[i])/2)+minimal[i])/4;
    EEPROM.write(i,ref[i]); 
  }
}
void run_manual(){
  if(Serial3.available()){
    delay(25);
    while(Serial3.available()){
      char c = Serial3.read();
      if(c=='>'){
        speed_ += 1;
        if(speed_ > 4){speed_ = 4;}
        if(speed_==1){
          kec=135; 
          pwm_ka=kec;
          pwm_ki=kec; 
        }
        else if(speed_==2){
          kec=170;  
          pwm_ka=kec;
          pwm_ki=kec; 
        }
        else if(speed_==3){
          kec=210;  
          pwm_ka=kec;
          pwm_ki=kec; 
        }
        else if(speed_==4){
          kec=255;  
          pwm_ka=kec;
          pwm_ki=kec; 
        }       
        Serial.print("Speed: ");
        Serial.println(kec);
      }
      else if(c=='<'){
        speed_ -= 1;
        if(speed_ < 1){speed_ = 1;}
        if(speed_==1){
          kec=135; 
          pwm_ka=kec;
          pwm_ki=kec;  
        }
        else if(speed_==2){
          kec=170;  
          pwm_ka=kec;
          pwm_ki=kec; 
        }
        else if(speed_==3){
          kec=210;  
          pwm_ka=kec;
          pwm_ki=kec; 
        }
        else if(speed_==4){
          kec=255;  
          pwm_ka=kec;
          pwm_ki=kec; 
        }
        Serial.print("Speed: ");
        Serial.println(kec);
      }
      else if(c=='^'){
        c = Serial3.read();
        kecepatan=kec;
        if(c=='1'){
          Serial.print("==> maju :");
          Serial.println(kecepatan);
          maju(pwm_ki,pwm_ka);
        }
        else if(c=='2'){
          Serial.print("==> mundur :");
          Serial.println(kecepatan);
          mundur(pwm_ki,pwm_ka);
        }
        else if(c=='3'){
          Serial.print("==> kanan :");
          Serial.println(kecepatan);
          belka(pwm_ki,pwm_ka);
        }
        else if(c=='4'){   
          Serial.print("==> kiri :");
          Serial.println(kecepatan);
          belki(pwm_ki,pwm_ka);
        }
        else if(c=='5'){ 
          Serial.println("==> berhenti");
          kecepatan=0;
          stopped();
          lifter_stopped();
        }
        else if(c=='6'){ 
          geser_kiri(pwm_ki,pwm_ka);
        }
        else if(c=='7'){
          geser_kanan(pwm_ki,pwm_ka);
        }
        else if(c=='8'){
          lifter_up();
        }
        else if(c=='9'){
          lifter_down();
        }
      }
      else if(c=='('){
        gripper_open();
      }
      else if(c==')'){
        gripper_close();
      }
    }
  }
}
void per3an_kanan(){
  while(1){ //STEP 1 -> PEMETAAN SENSOR
    pid(kecepatan);
    if(s0 || s9)break;
  }
  while(1){ //STEP 2 -> ACTION
    maju(100,100);
    read_sensor();
    if(!s0 || !s9)break;
  }
  while(1){ //STEP 3 -> ACTION
    belka(200,200);
    read_sensor();
    if(s0)break;
  }
  while(1){ //STEP 3 -> ACTION
    belka(200,200);
    read_sensor();
    if(s2)break;
  }
}
void setup() {
  Serial3.begin(9600);
  Serial.begin(9600);
  lcd.begin();
  servo.begin();
  servo.setPWMFreq(60);  // Analog servos run at ~60 Hz updates
  yield();
  pinMode(ENA_belakang, OUTPUT);
  pinMode(IN1_belakang, OUTPUT);
  pinMode(IN2_belakang, OUTPUT); 
  pinMode(ENB_belakang, OUTPUT);
  pinMode(IN3_belakang, OUTPUT);
  pinMode(IN4_belakang, OUTPUT);
  pinMode(ENA_depan, OUTPUT);
  pinMode(IN1_depan, OUTPUT);
  pinMode(IN2_depan, OUTPUT); 
  pinMode(ENB_depan, OUTPUT);
  pinMode(IN3_depan, OUTPUT);
  pinMode(IN4_depan, OUTPUT); 
  pinMode(IN2, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(b1,INPUT_PULLUP);
  pinMode(b2,INPUT_PULLUP); 
  pinMode(button1, INPUT_PULLUP); 
  pinMode(button2, INPUT_PULLUP);
  pinMode(button3, INPUT_PULLUP);
  gripper_open();
}

void loop() {
  //run_manual();
  awal:
  lcd.setCursor(0,0);
  lcd.print("1.Setting ");
  lcd.setCursor(0,1);
  lcd.print("2.Sensor "); 
  lcd.setCursor(10,0);
  lcd.print("3.Play");
  baca_button();
  while(tombol1 && tombol2 && tombol3){baca_button();}//tampil_sensor();} 
  if(!tombol1){
    delay(200);
    lcd.clear();
    delay(200);
    while(!tombol1){
      baca_button();
      lcd.setCursor(0,0);
      lcd.print("1.Kalib ");
      lcd.setCursor(0,1);
      lcd.print("2.Speed ");
      lcd.setCursor(10,0);
      lcd.print("3.PID");
    }
    while(1){
      while(tombol1 && tombol2 && tombol3){baca_button();}
      if(!tombol1){
        lcd.clear();
        delay(200);
        while(!tombol1){
          delay(50);
          while(1){
            baca_button();
            kalibrasi2();
            if(!tombol1){
              delay(200);
              lcd.clear();
              goto awal;
            }
          } 
        } 
      }
      else if(!tombol2){
        delay(100);
        kecepatan=EEPROM.read(address_speed);
        laju=kecepatan;
        while(!tombol2){baca_button();}
        lcd.clear();
        while(1){
          lcd.setCursor(0,0);
          lcd.print("Speed:");
          lcd.print(kecepatan);
          lcd.print("  ");
          baca_button();
          if(!tombol1){
            delay(200);
            laju++;
            if(laju>255){laju=0;}
            lcd.print(laju);
            lcd.print("  ");
          }
          else if(!tombol2){
            delay(200);
            laju--;
            if(laju<0){laju=255;}
            lcd.print(laju);
            lcd.print("  ");
          }
          else if(!tombol3){
            delay(200);
            lcd.clear();
            EEPROM.write(address_speed,laju);
            delay(500);
            lcd.setCursor(0,0);
            lcd.print("OK");
            delay(500);
            lcd.clear();
            goto awal;
          }
        }  
      }
      else if(!tombol3){
        delay(100);
        lcd.clear();
        delay(200);
        kons_p=EEPROM.read(address_kons_p);
        kons_d=EEPROM.read(address_kons_d);
        kons_i=EEPROM.read(address_kons_i);
        pi=kons_p;
        di=kons_d;
        ai=kons_i;
        lcd.setCursor(0,0);
        lcd.print("Kp:");
        lcd.print(pi);  
        lcd.setCursor(0,1);
        lcd.print("Kd:");
        lcd.print(di); 
        lcd.setCursor(8,0);
        lcd.print("Ki:");
        lcd.print(ai);  
        while(!tombol1){baca_button();}
        while(1){
          baca_button();
          if(!tombol1 && indeks==0){
            delay(200);
            pi++;
            if(pi>255){pi=0;}
            lcd.setCursor(3,0);
            lcd.print(pi);
            lcd.print("  ");
          }
          else if(!tombol2 && indeks==0){
            delay(200);
            pi--;
            if(pi<0){pi=255;}
            lcd.setCursor(3,0);
            lcd.print(pi);
            lcd.print("  ");
          }
          else if(!tombol3 && indeks==0){
            delay(200);
            EEPROM.write(address_kons_p,pi);
            delay(500);
            lcd.setCursor(8,1);
            lcd.print("OK");
            delay(500);
            lcd.setCursor(8,1);
            lcd.print("  ");
            indeks=1;
            delay(500);
          }
          while(indeks==1){
          baca_button();
          if(!tombol1 && indeks==1){
            delay(200);
            di++;
            if(di>255){di=0;}
            lcd.setCursor(3,1);
            lcd.print(di);
            lcd.print("  ");
          }
          else if(!tombol2 && indeks==1){
            delay(200);
            di--;
            if(di<0){di=255;}
            lcd.setCursor(3,1);
            lcd.print(di);
            lcd.print("  ");
          }
          else if(!tombol3 && indeks==1){
            delay(200);
            EEPROM.write(address_kons_d,di);
            delay(500);
            lcd.setCursor(8,1);
            lcd.print("OK");
            indeks=2;
            delay(500);
            lcd.setCursor(8,1);
            lcd.print("OK");
            delay(500);
            lcd.setCursor(8,1);
            lcd.print("  ");
          }
          }
          while(indeks==2){
          baca_button();
          if(!tombol1 && indeks==2){
            delay(200);
            ai++;
            if(ai>255){ai=0;}
            lcd.setCursor(11,0);
            lcd.print(ai);
            lcd.print("  ");
          }
          else if(!tombol2 && indeks==2){
            delay(200);
            ai--;
            if(ai<0){ai=255;}
            lcd.setCursor(11,0);
            lcd.print(ai);
            lcd.print("  ");
          }
          else if(!tombol3 && indeks==2){
            delay(200);
            EEPROM.write(address_kons_i,ai);
            delay(500);
            indeks=0;
            lcd.setCursor(8,1);
            lcd.print("OK");
            delay(500);
            lcd.setCursor(8,1);
            lcd.print("  ");
            delay(1000);
            lcd.clear();
            goto awal;
          }
          }
        }
      }
    }
  }
  else if(!tombol2){
    delay(100);
    lcd.clear();
    kons_p=EEPROM.read(address_kons_p);
    kons_d=EEPROM.read(address_kons_d);
    kons_i=EEPROM.read(address_kons_i);
    kecepatan=EEPROM.read(address_speed);
    sens[0]=EEPROM.read(0);
    sens[1]=EEPROM.read(1);
    sens[2]=EEPROM.read(2);
    sens[3]=EEPROM.read(3);
    sens[4]=EEPROM.read(4);
    sens[5]=EEPROM.read(5);
    sens[6]=EEPROM.read(6);
    sens[7]=EEPROM.read(7);
    sens[8]=EEPROM.read(8);
    sens[9]=EEPROM.read(9);
    sens[10]=EEPROM.read(10);
    sens[11]=EEPROM.read(11);
    sens[12]=EEPROM.read(12);
    sens[13]=EEPROM.read(13);
    while(1){
      tampil_all_sensor();
    }  
  }
  else if(!tombol3){
    delay(100);
    kons_p=EEPROM.read(address_kons_p);
    kons_d=EEPROM.read(address_kons_d);
    kons_i=EEPROM.read(address_kons_i);
    kecepatan=EEPROM.read(address_speed);
    sens[0]=EEPROM.read(0);
    sens[1]=EEPROM.read(1);
    sens[2]=EEPROM.read(2);
    sens[3]=EEPROM.read(3);
    sens[4]=EEPROM.read(4);
    sens[5]=EEPROM.read(5);
    sens[6]=EEPROM.read(6);
    sens[7]=EEPROM.read(7);
    sens[8]=EEPROM.read(8);
    sens[9]=EEPROM.read(9);
    sens[10]=EEPROM.read(10);
    sens[11]=EEPROM.read(11);
    sens[12]=EEPROM.read(12);
    sens[13]=EEPROM.read(13);
    lcd.clear();
    delay(100);
    while(!tombol3){
      baca_button();
      lcd.setCursor(0,0);
      lcd.print("1.Start ");
      lcd.setCursor(0,1);
      lcd.print("2.Retry ");  
      while(tombol1 && tombol2){baca_button();}
      if(!tombol1){
        lcd.clear();
        delay(200);
        while(!tombol1){
          baca_button();
          lcd.setCursor(0,0);
          lcd.print("1.Auto ");
          lcd.setCursor(0,1);
          lcd.print("2.Manual "); 
          while(tombol1 && tombol2){baca_button();}
          if(!tombol1){   //program untuk start1
            lcd.clear();
            delay(200);
            while(!tombol1){
              //MULAI DARI SINI
              //pid(kecepatan);
              while(1){ //ACTION1
                geser_kiri(200,200);
                delay(1000);
                break;
              }
              while(1){ //ACTION2
                maju(200,200);
                read_sensor();
                if(s0 || s9)
                break;
              }
              while(1){ //ACTION3
                maju(200,200);
                read_sensor();
                if(!s0 || !s9)
                break;
              }
              while(1){ //ACTION2
                maju(200,200);
                read_sensor();
                if(s0 || s9)
                break;
              }
              while(1){
                stopped();
              }        
              //BERAKHIR DISINI
            }
          }
          else if(!tombol2){
            lcd.clear();
            delay(200);
            while(!tombol2){  //program untuk mode remote
              run_manual();              
            }
          }
        }
      }
    }
  }
}
