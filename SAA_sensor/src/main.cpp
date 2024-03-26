#define BID 1

#define SILENT

#include <Arduino.h>
#include <LCD1602_ANIM.h>
#include <RTClib.h>
#include <ArduinoJson.h>

#include <string.h>

#include <SAA_pins.h>
#include <SAA_status.h>
#include <SAA_EEPROM_records.h>
#include <SAA_LCD1602_RUS.h>
#include <EEPROM.h>
//#pragma once
//#include <initialization.cpp>
//#include <debug.cpp>

Status last_status = STANDALONE_STATUS;

RTC_DS3231 rtc;

struct Record
{
  public:
  byte uid[10];
  uint32_t timestamp;
};

LiquidCrystal_I2C LCD(0x27, 16, 8);
MFRC522 rfid(SDA_PIN, RST_PIN);

void lcdMessage(String message)
{
  LCD.clear();
  LCD.setCursor(0, 0);
  LCD.print(message.substring(0, 16));
  LCD.setCursor(0, 1);
  LCD.print(message.substring(16, 31));
  delay(700);
}



String convertUID(byte bytes[]){
  String result = "";
  
  for (byte i = 0; i < sizeof(bytes); i++)
      {
        // Serial.print(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
        // Serial.print(rfid.uid.uidByte[i], DEC);
        result.concat(String(bytes[i] < 0x10 ? "0" : ""));
        result.concat(String(bytes[i], HEX));
        result += String(bytes[i], HEX);
      }
  return result;
}


void buzzMessage(Status status){
  switch (status)
  {
  case ERROR_STATUS:
    tone(BUZZER_PIN,200);
    delay(500);
    noTone(BUZZER_PIN);
    break;
  case OFFLINE_STATUS:
    tone(BUZZER_PIN,400);
    delay(200);
    tone(BUZZER_PIN,300);
    delay(200);
    tone(BUZZER_PIN,200);
    delay(200);
    noTone(BUZZER_PIN);
    break;
    case NOT_FOUND_STATUS:
    tone(BUZZER_PIN,400);
    delay(300);
    noTone(BUZZER_PIN);
    delay(100);
    tone(BUZZER_PIN,400);
    delay(300);
    noTone(BUZZER_PIN);
    delay(100);
    tone(BUZZER_PIN,400);
    delay(200);
    noTone(BUZZER_PIN);
    delay(100);
    noTone(BUZZER_PIN);
    break;
  
  default:
    break;
  }
}
void showMessage(Status status){
   switch (status){
    case NOT_FOUND_STATUS:
      LCD_print_cyrl(LCD,"Студент",new byte[2]{0,4});
      LCD_print_cyrl(LCD,"не найден",new byte[2]{1,4});
      break;
    case LATE_STATUS:
      LCD_print_cyrl(LCD,"НЕ ОПАЗДЫВАЙТЕ!",new byte[2]{0,1});
      break;

   }
}


// put function declarations here:

bool waitForSerial(uint16_t timeout)
{
  
  uint32_t init_time = millis();
  while ((millis() - init_time) < timeout)
    if (Serial.available() > 0)
      return true;
  return false;
};
bool pingSerial(){
  
}

void setup()
{
  //EEPROM.write(0,0);
  Serial.begin(9600);
  if (!rtc.begin())
  {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    abort();
  }
  //rtc.adjust(DateTime(1711331600));
  SPI.begin(); 
  rfid.PCD_Init();
  LCD.init();
  LCD.backlight();

  LCD.home();


  //lcdMessage("START CYRL WRITING");
  
}

bool sendRecord(Record record){
      StaticJsonDocument<200> message;

      message["uid"] = convertUID(record.uid);
      message["bid"] = int(BID);
      message["timestamp"] = record.timestamp;

      String json_str;
      serializeJson(message, json_str);
      //Serial.write(json_str.c_str());
      Serial.write((json_str + "\n").c_str());
      lcdMessage("WAITING FOR SERIAL");
      Status got_status = STANDALONE_STATUS;
      if (waitForSerial(1000))
      {
        String answer = Serial.readStringUntil('\n');
        lcdMessage("SERIAL RESPONDED, PARSING...");
        LCD.print(answer);
        // lcdMessage(answer)
        JsonDocument responce;
        deserializeJson(responce, answer);
        
        if (responce.containsKey("status"))
        {
          lcdMessage("CONTAINS STATUS");
          String responce_status = responce["status"];
          for (byte s = 0; s < STATUS_COUNT; s++)
            if (String(STATUS_STRINGS[s]) == responce_status)
            {
              //lcdMessage(String("FOUND STATUS: ") + responce_status);
              got_status = Status(s);
              break;
            }
        }
        if (responce.containsKey("unixtime")){
          rtc.adjust(DateTime((int32_t)responce["unixtime"]));
          lcdMessage("nowtime updated to " + String((int32_t)responce["unixtime"]));
        }
        
        //switch (got_status) { case ERROR_STATUS: /* code */ break; default: break; }
        lcdMessage("PARSING ENDED");
        lcdMessage("RESULT: " + String(STATUS_STRINGS[got_status]));
        // #ifndef SILENT
        // buzzMessage(got_status);
        // #endif
        //showMessage(got_status);
      }
      else{
        lcdMessage("SERIAL NOT RESPONDED");
        byte count=EEPROM.read(0);
        if (count < 73){
          EEPROM.put(1+count*sizeof(Record),record);
          //EEPROM.put(1+count+4,record.uid);
          EEPROM.write(0,++count);
        }
        lcdMessage("EEPROM FILLED " + String(count) + " of 73");
      }
      return got_status!=STANDALONE_STATUS;
}

void resendStored(){
  byte count = EEPROM.read(0);
  Record record;
  while (count!=0)
  {
    EEPROM.get(1 + count*sizeof(Record),record);
    if (sendRecord(record))
      count--;
    else
    return;
    lcdMessage("EEPROM FILLED " + String(count) + " of 73");
  }
  EEPROM.write(0,count);
  
}

bool is_buzzing = false;
void loop()
{
  LCD_print_cyrl(LCD, String("ПРИКЛАДЫВАЙТЕ").c_str(), new byte[2]{0,2});
  LCD_print_cyrl(LCD, String("КАРТУ").c_str(), new byte[2]{1,2});
  LCD.setCursor(0,0);
  LCD.write(127);
  LCD.setCursor(0,1);
  LCD.write(127);
  // Serial.write((String(rtc.now().unixtime())+"\n").c_str());
  if (rfid.PICC_IsNewCardPresent())
    if (rfid.PICC_ReadCardSerial())
    {
      #ifndef SILENT
       tone(BUZZER_PIN,600);
      delay(50);
      noTone(BUZZER_PIN);
      #endif
      
      lcdMessage("GOT CARD");
      //delay(1000);      

      Record current_record;
      //lcdMessage(String(rfid.uid.size));
      memccpy(current_record.uid,rfid.uid.uidByte,0,10);
      current_record.timestamp = rtc.now().unixtime();
      
      if (sendRecord(current_record))
          resendStored();
      lcdMessage("END OF");
    }
  //(is_buzzing = !is_buzzing)? tone(BUZZER_PIN,400):noTone(BUZZER_PIN);

  // put your main code here, to run repeatedly:
}
