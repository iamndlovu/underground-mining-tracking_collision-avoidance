#include <Arduino.h>
#include <ArduinoHttpClient.h>
#include <WiFi.h>
#include <NewPing.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
#include <math.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>  

#define radians(deg) ((deg)*DEG_TO_RAD)
LiquidCrystal_I2C lcd(0x27,16,2);

const char* ssid     = "test";
const char* password = "12345677";

char serverAddress[] = "192.168.43.190";  // server address # check on list of connected device in hotspotting phone!!
int port = 5000;


WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

#define TRIGGER_PIN  2  // Arduino pin tied to trigger pin on the ultrasonic sensor.
#define ECHO_PIN     4  // Arduino pin tied to echo pin on the ultrasonic sensor.
#define MAX_DISTANCE 250 // Maximum distance we want to ping for (in centimeters). Maximum sensor distance is rated at 400-500cm.
#define SS_PIN 5
#define RST_PIN 27
#define BUZZER_PIN 25
#define STOP_PIN 15

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE); // NewPing setup of pins and maximum distance.
MFRC522 mfrc522(SS_PIN, RST_PIN);
byte readCard[4];
String employee_UID = "F320A96";  
String automobile_UID = "73C685A5";  
String unauthorized_UID = "93F777A6";  
bool isIdRead = false;
bool sms = false;
String types[] = {"Automobile", "Employee", "Unknown"};

String ID = "";
int type = 2, distanceStatus = 0, locationStatus = 2, overallStatus = 0;
float safetyDistance = 0.00;

      

// RX and TX pin from context of controller!
//controller RX <--> GPS TX
// controller TX <--> GPS RX
static const int RXPin = 18, TXPin = 19;
static const uint32_t GPSBaud = 9600;

// The TinyGPSPlus object
TinyGPSPlus gps;

// The Serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setup() {
  ss.begin(GPSBaud);
  Serial.begin(9600);
  while(!Serial){delay(100);}
  SPI.begin(); // init SPI bus
  mfrc522.PCD_Init(); // Initialise MFRC522
  delay(4);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(14, OUTPUT);
  pinMode(26, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  digitalWrite(14, LOW);
  digitalWrite(26, LOW);
  digitalWrite(STOP_PIN, LOW);
  pinMode(STOP_PIN, OUTPUT);

  Serial.println("Initializing");

  lcd.init();      // initialize the lcd
  lcd.backlight(); // open the backlight 
  lcd.clear();
  lcd.setCursor(0, 0);  // start to print at the first row
  lcd.print("Underground Mine");
  lcd.setCursor(0, 1);  // start to print at the 2and row
  lcd.print("Tracking System");
  delay(1400);

  Serial.println();
  Serial.println("******************************************************");
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WIFI Connected:");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  delay(680);
  mfrc522.PCD_DumpVersionToSerial();
}

void loop(){
  moveForward();
  while (digitalRead(STOP_PIN) == 0) {
    moveForward();
    readID();
    delay(430);
    if (isIdRead){
      checkDistance();

      if(digitalRead(BUZZER_PIN) == 1) {
        overallStatus++;
      }
      if(sms == true) {
        overallStatus++;
      }

      //GPS
      if(ss.available() > 0)
        if(gps.encode(ss.read()))
          sendInfo();

      if((millis() > 20000) && (gps.charsProcessed() < 10)) {
        Serial.println(F("No GPS detected: check wiring."));
         sendInfoWithoutGps();
        sendInfo();
      }
      delay(300);
      isIdRead = false;
    sms = false;
    type = 2; 
    distanceStatus = 0;
    locationStatus = 2;
    overallStatus = 0;
    isIdRead = false;
    distanceStatus = 0;
    locationStatus = 2;
    overallStatus = 0;
    digitalWrite(BUZZER_PIN, LOW);
    }
    isIdRead = false;
    sms = false;
    type = 2; 
    distanceStatus = 0;
    locationStatus = 2;
    overallStatus = 0;
    isIdRead = false;
    distanceStatus = 0;
    locationStatus = 2;
    overallStatus = 0;
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  }

  while((sonar.ping_cm() < 10 && !sonar.ping_cm() == 0) || (digitalRead(STOP_PIN) == 1)) {
    stopCar();
    delay(1000);
    isIdRead = false;
    sms = false;
    type = 2; 
    distanceStatus = 0;
    locationStatus = 2;
    overallStatus = 0;
    isIdRead = false;
    distanceStatus = 0;
    locationStatus = 2;
    overallStatus = 0;
    digitalWrite(BUZZER_PIN, LOW);
  }

  isIdRead = false;
  sms = false;
  type = 2; 
  distanceStatus = 0;
  locationStatus = 2;
  overallStatus = 0;
  digitalWrite(BUZZER_PIN, LOW);
}

//Read new tag if available
void readID() {
  //Check if a new tag is detected or not. If not return.
  Serial.println("Read ID()...");
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    Serial.println("Return 1");
    return;
  }
  //Check if a new tag is readable or not. If not return.
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    Serial.println("Return 2");
    return;
  }

  Serial.println("No Return");
  ID = "";
  // Read the 4 byte UID
  for ( uint8_t i = 0; i < 4; i++) {
    //readCard[i] = mfrc522.uid.uidByte[i];
    ID.concat(String(mfrc522.uid.uidByte[i], HEX)); // Convert the UID to a single String
  }

  ID.toUpperCase();
  mfrc522.PICC_HaltA(); // Stop reading

  if (ID == employee_UID) {
    Serial.println();
    Serial.print("Employee ID:");
    Serial.print(employee_UID);
    Serial.println();
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("EmployeeDetected"); 
    lcd.setCursor(0,1);
    lcd.print("ID: ");
    lcd.setCursor(4,1);
    lcd.print(employee_UID);
    type = 1;
  } else if (ID == automobile_UID) {
    Serial.println();
    Serial.print("Automobile ID:");
    Serial.print(automobile_UID);
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("AutomobileDetected"); 
    lcd.setCursor(0,1);
    lcd.print("ID: ");
    lcd.setCursor(4,1);
    lcd.print(automobile_UID);
    type = 0;
  } else {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(500);
    Serial.println("Unauthorized ID Detected");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Unauthorized ID"); 
    lcd.setCursor(0,1);
    lcd.print("Sending message");
    Serial.println("sending gsm message...");
    type = 2;
    sms = true;
  }
  isIdRead = true;
}

void checkDistance() {
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Checking"); 
  lcd.setCursor(0,1);
  lcd.print("Safety Distance");

  // ULTRASONIC
  safetyDistance = sonar.ping_cm(); // Send ping, get distance in cm (0 = outside set distance range)
  if (safetyDistance < 10 && !safetyDistance == 0) {
    stopCar();
  }
  delay(760);

  if (safetyDistance >= 50 || safetyDistance == 0) {
    Serial.println();
    Serial.print(types[type]);
    Serial.print(" object detected in safe zone\n");
    Serial.println();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(types[type]);
    lcd.setCursor(10, 0);
    lcd.print("Detected");
    lcd.setCursor(0, 1);
    lcd.print("in safe zone");
    delay(610);
    moveForward();
    distanceStatus = 0;
  } else if (safetyDistance >= 30 && safetyDistance < 50) {
    Serial.println();
    Serial.print(types[type]);
    Serial.print(" object detected in caution zone");
    Serial.println();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(types[type]);
    lcd.setCursor(10, 0);
    lcd.print("Detected");
    lcd.setCursor(0, 1);
    lcd.print("in caution zone");
    delay(610);
    moveForward();
    distanceStatus = 1;
  } else if (safetyDistance >= 10 && safetyDistance < 30) {
    digitalWrite(BUZZER_PIN, HIGH);
    Serial.println();
    Serial.print(types[type]);
    Serial.print(" detected in alarm zone");
    Serial.println();
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(types[type]);
    lcd.setCursor(10, 0);
    lcd.print("Detected");
    lcd.setCursor(0, 1);
    lcd.print("in alarm zone");
    delay(610);
    moveForward();
    distanceStatus = 2;
  } else if (safetyDistance < 10 && !safetyDistance == 0) {
    stopCar();
    digitalWrite(BUZZER_PIN, HIGH);
    distanceStatus = 3;
    sms = true;
    Serial.println();
    Serial.print(types[type]);
    Serial.print(" detected in alarm zone");
    Serial.println();
     lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(types[type]);
    lcd.setCursor(10, 0);
    lcd.print("Detected");
    lcd.setCursor(0, 1);
    lcd.print("in alarm zone");
    delay(2000);
    lcd.setCursor(0, 1);
    lcd.print("Sending message");
    Serial.println("sending gsm message...");
    delay(2000);
  }
}

void moveForward() {
  if(sonar.ping_cm() < 30 && !sonar.ping_cm() == 0) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(1000);
    digitalWrite(BUZZER_PIN, LOW);
  }
  if((sonar.ping_cm() < 10 && !sonar.ping_cm() == 0)) {
    stopCar();
    return;
  }
  if (sonar.ping_cm() >= 30 ) {
    digitalWrite(BUZZER_PIN, LOW);
  }
  digitalWrite(13, LOW);
  digitalWrite(12, HIGH);
  digitalWrite(14, LOW);
  digitalWrite(26, HIGH);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("automobile moving");
  lcd.setCursor(0, 1);
  lcd.print("forward");
  Serial.println("automobile moving forward");
  delay(500);
}

void stopCar() {
  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  digitalWrite(14, LOW);
  digitalWrite(26, LOW);
  lcd.clear();
  lcd.setCursor(5, 0);
  lcd.print("STOP!");
}

void sendInfo(){
  Serial.println("Sending with gps data...");
  // Serial.println("\nWait 10 seconds\n\n");
  // delay(5000);
  JsonDocument sensorDataObject;
  JsonDocument gpsData;
  
  if (gps.location.isValid())
  {
    gpsData["latitude"] = gps.location.lat();
    gpsData["longitude"] = gps.location.lng();
  }
  else
  {
    gpsData["latitude"] = 0.00;
    gpsData["longitude"] = 0.00;
  }

  //GPS
  sensorDataObject["gps"] = gpsData;

  // SAFETY DISTANCE
  sensorDataObject["safetyDistance"] = safetyDistance;

  //UID
  sensorDataObject["objectID"] = ID;

  // TYPE
  sensorDataObject["type"] = type;

  // DISTANCE STATUS
  sensorDataObject["distanceStatus"] = distanceStatus;

  //LOCATION STATUS
  sensorDataObject["locationStatus"] = locationStatus;

  //OVERALL STATUS
  sensorDataObject["overallStatus"] = overallStatus;
  
  // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  String endpoint = "/data/add";
  client.beginRequest();
  client.post(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", sensorDataObjectString.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(sensorDataObjectString);
  int statusCodePost = client.responseStatusCode();
  String responsePost = client.responseBody();
  client.endRequest();

  Serial.print("\nPost Response Status Code: ");
  Serial.println(statusCodePost);
  Serial.print("\nPost Response: ");
  Serial.println(responsePost);

  //Print stringified data objects
  Serial.println("\nPretty JSON Object:");
  Serial.println(sensorDataObjectPrettyString);
}

void sendInfoWithoutGps(){
  Serial.println("Sending without gps data...");
  // Serial.println("\nWait 25 seconds\n\n");
  // delay(20000);
  JsonDocument sensorDataObject;

  // SAFETY DISTANCE
  sensorDataObject["safetyDistance"] = safetyDistance;

  //UID
  sensorDataObject["objectID"] = ID;

  // TYPE
  sensorDataObject["type"] = type;

  // DISTANCE STATUS
  sensorDataObject["distanceStatus"] = distanceStatus;

  //LOCATION STATUS
  sensorDataObject["locationStatus"] = locationStatus;

  //OVERALL STATUS
  sensorDataObject["overallStatus"] = overallStatus;
  
  // convert into a JSON string
  String sensorDataObjectString, sensorDataObjectPrettyString;
  serializeJson(sensorDataObject, sensorDataObjectString);
  serializeJsonPretty(sensorDataObject, sensorDataObjectPrettyString);

  // send JSON data to server
  String endpoint = "/data/add";
  client.beginRequest();
  client.post(endpoint);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", sensorDataObjectString.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(sensorDataObjectString);
  int statusCodePost = client.responseStatusCode();
  String responsePost = client.responseBody();
  client.endRequest();

  Serial.print("\nPost Response Status Code: ");
  Serial.println(statusCodePost);
  Serial.print("\nPost Response: ");
  Serial.println(responsePost);

  //Print stringified data objects
  Serial.println("\nPretty JSON Object:");
  Serial.println(sensorDataObjectPrettyString);
}
