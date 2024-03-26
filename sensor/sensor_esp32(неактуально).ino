#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define SCK_PIN 22
#define SDA_PIN 23  // ESP32 pin GPIO5 // SS
#define SS_PIN SDA_PIN
#define RST_PIN 15
#define MISO_PIN 19
#define MOSI_PIN 21

#define BUZZER_PIN 18
#define BUZZER_GND 5
#define ONBOARD_LED_PIN 2

enum BuzzTunes{
  Attended,
  Not_found,
  Server_error,
  Wifi_timeout,
  Reading_started,
  Reading_ended
};

void buzz(BuzzTunes tune){
noTone(BUZZER_PIN);
    delay(100);
    switch (tune) {
      case Attended:
        tone(BUZZER_PIN, 440);
        delay(200);
        noTone(BUZZER_PIN);
        delay(100);
        tone(BUZZER_PIN, 622.26);
        delay(200);
        break;
      case Not_found:
        tone(BUZZER_PIN, 1030);
        delay(200);
        noTone(BUZZER_PIN);
        delay(100);
        tone(BUZZER_PIN, 1030);
        delay(200);
        break;
      case Server_error:
        tone(BUZZER_PIN, 1030);
        delay(400);
        noTone(BUZZER_PIN);
        delay(100);
        tone(BUZZER_PIN, 622.26);
        delay(400);
        noTone(BUZZER_PIN);
        delay(100);
        tone(BUZZER_PIN, 400);
        delay(400);
        break;
        case Wifi_timeout:
        tone(BUZZER_PIN, 1030);
        delay(400);
        noTone(BUZZER_PIN);
        delay(400);
        tone(BUZZER_PIN, 1030);
        delay(400);
        noTone(BUZZER_PIN);
        delay(400);
        tone(BUZZER_PIN, 1030);
        delay(400);
        noTone(BUZZER_PIN);
        delay(400);
        break;
    }
    noTone(BUZZER_PIN);
}

void blink(BuzzTunes tune){
  noTone(ONBOARD_LED_PIN);
    delay(100);
    switch (tune) {
      case Attended:
        tone(ONBOARD_LED_PIN, 540);
        delay(200);
        noTone(ONBOARD_LED_PIN);
        delay(100);
        tone(ONBOARD_LED_PIN, 630);
        delay(200);
        break;
      case Not_found:
        tone(ONBOARD_LED_PIN, 1030);
        delay(400);
        noTone(ONBOARD_LED_PIN);
        delay(100);
        tone(ONBOARD_LED_PIN, 1030);
        delay(400);
        break;
      case Server_error:
        tone(ONBOARD_LED_PIN, 1030);
        delay(400);
        noTone(ONBOARD_LED_PIN);
        delay(100);
        tone(ONBOARD_LED_PIN, 630);
        delay(400);
        noTone(ONBOARD_LED_PIN);
        delay(100);
        tone(ONBOARD_LED_PIN, 400);
        delay(400);
        break;
        case Wifi_timeout:
        tone(ONBOARD_LED_PIN, 1030);
        delay(400);
        noTone(ONBOARD_LED_PIN);
        delay(400);
        tone(ONBOARD_LED_PIN, 1030);
        delay(400);
        noTone(ONBOARD_LED_PIN);
        delay(400);
        tone(ONBOARD_LED_PIN, 1030);
        delay(400);
        noTone(ONBOARD_LED_PIN);
        delay(400);
        break;
    }
    noTone(ONBOARD_LED_PIN);
}



MFRC522 rfid(SDA_PIN, RST_PIN);
const char* ssid = "GalaxyA7171A8";
const char* password = "123456789";
String serverUrl = "http://192.168.181.236:4444/sensor";

struct SensorData {
  //String number;
  String UID;
};

void setup() {
  pinMode(BUZZER_GND, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_GND, LOW);
  Serial.begin(9600);
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  rfid.PCD_Init();
  Serial.println("RFID Ready!");
  Serial.println("");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
}

void loop() {
  //Serial.println("Connected" + String(WiFi.status() != WL_CONNECTED));
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {

      if (WiFi.status() != WL_CONNECTED){
        buzz(Wifi_timeout);
        blink(Wifi_timeout);
        return;
      }

    Serial.print("Card UID: ");
    String uid = "";
    tone(BUZZER_PIN, 440);

    for (byte i = 0; i < rfid.uid.size; i++) {
      //Serial.print(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
      Serial.print(rfid.uid.uidByte[i], DEC);
      uid.concat(String(rfid.uid.uidByte[i] < 0x10 ? "0" : ""));
      uid.concat(String(rfid.uid.uidByte[i], HEX));
      uid += String(rfid.uid.uidByte[i], HEX);

      //sensorData.number = "Ж101";
    }
    Serial.println();
    SensorData sensorData;
    sensorData.UID = uid;
    Serial.println(sensorData.UID);

    const size_t capacity = JSON_OBJECT_SIZE(2);
    StaticJsonDocument<200> doc;
    //doc["number"] = sensorData.number;
    doc["UID"] = sensorData.UID;

    String jsonStr;
    serializeJson(doc, jsonStr);
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    Serial.println(jsonStr);
    BuzzTunes Response_int = Server_error;
    int httpResponseCode = http.POST(jsonStr);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);

      if (response == "Attended")
        Response_int = Attended;
      else if (response == "Not found")
        Response_int = Not_found;
    }
    buzz(Response_int);
    blink(Response_int);
    
    Serial.println("");
  }
}
