// Setup the client to send sensor data to the server
#include <math.h>
#include <TinyGPSPlus.h>
#include <WiFi.h>
#include <SoftwareSerial.h>
SoftwareSerial mySerial(18,19);// rx tx
#define radians(deg) ((deg)*DEG_TO_RAD)
#include <WebServer.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>  
LiquidCrystal_I2C lcd(0x27,16,2);

#define SS_PIN   5
#define RST_PIN   27
#define BUZZER_PIN 25


MFRC522 mfrc522(SS_PIN, RST_PIN);
byte readCard[4];
String employee_UID = "F320A96";  
String automobile_UID = "73C685A5";  
String unauthorized_UID = "93F777A6";  
String ID = "";

 //safety distance ultrasonic sensor connection
const int Trig_PIN1 = 2;
const int Echo_PIN1 = 4;

const int stop_pin = 15;

int forward, stop;

float safetyDistance;
float distance_threshold = 10;

boolean hasGotGPSData = false;
TinyGPSPlus gps;

//byte authorizedUID[4] = {0x23, 0x67, 0x1A, 0xA7};

char* ssid = "RUVIMBOSAM";
char* password = "0777601619";

const char* host = "192.168.8.117"; // as specified in server.ino
IPAddress staticIP(192, 168, 8, 10);
IPAddress gateway(192,168,8,1);
IPAddress subnet(255, 255, 255, 0);

byte server[] = { 192, 168, 8, 117  }; //

// Set up the client objet
WiFiClient client;

WebServer myserver;


String result = "";
char input[12];
int count = 0;

float lat;
float lon;
float locationLatitude, locationLongitude;

void moveForward() {
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
  delay(300);
}

void stopCar() {
  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  digitalWrite(14, LOW);
  digitalWrite(26, LOW);
}


String httpRequest(String ID, float safetyDistance, float locationLatitude, float locationLongitude) {
  Serial.println("httpRequest:");
  if (client.connect(server, 80)) {
    Serial.println("connected:");
    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Connected");
    String url = "/UndergroundMining/data.php?ID=" + String(ID) + "&safetyDistance=" + String(safetyDistance)+ "&locationLatitude=" + String(locationLatitude)+ "&locationLongitude=" + String(locationLongitude);
    Serial.println(url);
   // Serial.println(url);
    client.print(
      String("GET ")
      + url
      + " HTTP/1.1\r\n" + "Host: "
      + host
      +  "\r\n"
      + "Connection: keep-alive\r\n\r\n"
    ); // minimum set of required URL headers

    delay(10);
    // Read all the lines of the response and print them to Serial
    Serial.println("Response: ");
    while (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }

    if (!client.connected()) {
      Serial.println();
      Serial.println("disconnecting.");
      lcd.clear();  
      lcd.setCursor(0, 0); 
      lcd.print("Disconnecting");
      client.flush();
      client.stop();
       //http.end();
    }
  }
  else {
    //if you didn't get a connection to the server:
    Serial.println("connection failed");
    lcd.clear();  
    lcd.setCursor(0, 0); 
    lcd.print("Connection Failed");
  }
}

void sendSms() {
  lcd.setCursor(0, 0);  // start to print at the second row
  lcd.print("Sending message");
  Serial.println("sending gsm message...");
  delay(1000);
  mySerial.println("AT");
  updateSerial();
  mySerial.println("AT+CMGF=1");
  updateSerial();
  mySerial.println("AT+CMGS=\"+263777601619\"");
  updateSerial();
  mySerial.print("Unauthorized ID Detected!");
  updateSerial();
  mySerial.write(26); 
  lcd.clear();
}


void sendSmss() {
  lcd.setCursor(0, 0);  // start to print at the second row
  lcd.print("Sending message");
  Serial.println("sending gsm message...");
  delay(1000);
  mySerial.println("AT");
  updateSerial();
  mySerial.println("AT+CMGF=1");
  updateSerial();
  mySerial.println("AT+CMGS=\"+263777601619\"");
  updateSerial();
  mySerial.print("Employee/Automobile Detected in Danger Zone!");
  updateSerial();
  mySerial.write(26); 
  lcd.clear();
}



void updateSerial() {
  delay(500);  
  while(Serial.available()) {
    Serial2.write(Serial.read());
  }
  while(Serial2.available()) {
    Serial.write(Serial2.read());
  }
}

//Read new tag if available
bool readID() {
    //Check if a new tag is detected or not. If not return.
    if ( ! mfrc522.PICC_IsNewCardPresent()) {
      return false;
    }
    //Check if a new tag is readable or not. If not return.
    if ( ! mfrc522.PICC_ReadCardSerial()) {
      return false;
    }

    ID = "";
    // Read the 4 byte UID
    for ( uint8_t i = 0; i < 4; i++) {
      //readCard[i] = mfrc522.uid.uidByte[i];
      ID.concat(String(mfrc522.uid.uidByte[i], HEX)); // Convert the UID to a single String
    }

    ID.toUpperCase();
    mfrc522.PICC_HaltA(); // Stop reading
    return true;
  }


float safetyDistancee() {
  float safetyDistance;
  digitalWrite(Trig_PIN1, LOW);
  delayMicroseconds(5);
  digitalWrite(Trig_PIN1, HIGH);
  delayMicroseconds(15);
  digitalWrite(Trig_PIN1, LOW);
  safetyDistance = pulseIn(Echo_PIN1, HIGH);
  safetyDistance = safetyDistance * 0.01657; //how far away is the object in cm
  Serial.println("Safety Distance = ");
  Serial.println(safetyDistance);
  lcd.setCursor(0,0);
  lcd.print("Safety Distance = ");
  lcd.setCursor(0,0);
  lcd.print(safetyDistance);
  return safetyDistance;
}

float getCoordinates(bool moveF) {
  if (moveF == true) {
    moveForward();
  }
  Serial.println(" ");
  Serial.println("getCoordinates");
  hasGotGPSData = false;
  while (!hasGotGPSData) {
    if (moveF == true) {
    moveForward();
  }
    while (Serial2.available()) {
      gps.encode(Serial2.read());
      if (moveF == true) {
        moveForward();
      }
    }

    if (gps.location.isUpdated()) {
      Serial.println("Satellite Count:");
      Serial.println(gps.satellites.value());
      lat = gps.location.lat(), 6;
      Serial.println();
      Serial.print("Latitude: ");
      Serial.print(lat,6);
      Serial.print(" ; ");
      
      lon = gps.location.lng(), 6;
      Serial.print("Longitude: ");
      Serial.print(lon,6);
      Serial.println();

      lcd.clear();  
      lcd.setCursor(0,0);
      lcd.print("Lat: "); 
      lcd.setCursor(4,0);
      lcd.print(lat);
      lcd.setCursor(0,1);
      lcd.print("Lon: "); 
      lcd.setCursor(4,1);
      lcd.print(lon);

      if (Serial1.available()){            //Displays on the serial monitor if there's a communication from the module
        Serial.write(Serial1.read()); 
      }
      
      hasGotGPSData = true;
    }
  }
  return (lat,6);
  return (lon,6);
}

float getDistance(float lat, float lon, float latitudeTo, float longitudeTo) {
  float delLat = abs(latitudeTo-lat)*111194.9;
  float delLong = 111194.9*abs(longitudeTo-lon)*cos(radians((latitudeTo+lat)/2));
  return sqrt(pow(delLat,2)+pow(delLong,2));
}

float getDistancee(float lat, float lon, float latitudeTo, float longitudeTo) {
  float long1 = radians(lon);
  float long2 = radians(latitudeTo);
  float lat1 = radians(lat);
  float lat2 = radians(longitudeTo);

  //Haversine Formula
  float dlong = abs(long2 - long1);
  float dlati = abs(lat2 - lat1);
  float val = pow(sin(dlati/2),2)+cos(lat1)*cos(lat2)*pow(sin(dlong/2),2);
  float res = 2 * asin(sqrt(val));

  float radius = 6371;

  return radius*res;
}


void setup() {
  Serial.begin(57600);
  Serial.println("The GPS Received Signal:");
  Serial1.begin(9600);
  Serial2.begin(9600);
  mySerial.begin(9600);
  delay(1000);
  
  pinMode(Trig_PIN1, OUTPUT); 
  pinMode(Echo_PIN1, INPUT);
  //pinMode(stop_pin, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(BUZZER_PIN, LOW);
  //LN 298 Driver Pins
  //LN 298 Driver Pins
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(14, OUTPUT);
  pinMode(26, OUTPUT);

  digitalWrite(13, LOW);
  digitalWrite(12, LOW);
  digitalWrite(14, LOW);
  digitalWrite(26, LOW);

  SPI.begin(); // init SPI bus
  //rfid.PCD_Init(); // init MFRC522
  mfrc522.PCD_Init(); // Initialise MFRC522

  lcd.init();      // initialize the lcd
  lcd.backlight(); // open the backlight 
  lcd.clear();
  lcd.setCursor(0, 0);  // start to print at the first row
  lcd.print("Underground Mining");
  lcd.setCursor(0, 1);  // start to print at the first row
  lcd.print("Tracking System");
  Serial.println("Underground Mining System");
  delay(2000);
  Serial.println("Start...");//Just show to the monitor that the sketch has started
  WiFi.begin(ssid, password);
  WiFi.config(staticIP, gateway, subnet);
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.print("IP Address (AP): ");
  Serial.println(WiFi.localIP());
  lcd.clear();  
  lcd.setCursor(0, 0); 
  lcd.print("IP Address:");
  lcd.setCursor(0, 1); 
  lcd.print(WiFi.localIP());

  myserver.on("/", []() {
    myserver.send(200, "text/plain", "Hello World!");
  });
  myserver.begin();
  //http.begin(client);
  delay(1500);

  Serial.println();
  Serial.print("Initiallizing underground mining"); 
  delay(1000);
}

void loop() {
  moveForward();
  Serial.println();
  Serial.println("Waiting for employee/automobile");
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Waiting 4 employee"); 
  lcd.setCursor(0,1);
  lcd.print("or automobile scanning");
  delay(3000);

  if (readID()) {
    if (ID == employee_UID) {
      Serial.println();
      Serial.print("Employee ID:");
      Serial.print(employee_UID);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Employee ID:"); 
      lcd.setCursor(0,1);
      lcd.print(employee_UID);
      delay(2000);

      Serial.println();
      Serial.println("Employee Detected");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Employee"); 
      lcd.setCursor(0,1);
      lcd.print("Detected");
      delay(2000);

      Serial.println();
      Serial.println("Checking Employee Safety Distance");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Checking Employee"); 
      lcd.setCursor(0,1);
      lcd.print("Safety Distance");
      delay(1000);


      //check obstacle distance before moving
      safetyDistance = safetyDistancee();
      delay(1000);

      //if forward obstacles in safe zone
      if (safetyDistance >= 50) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("employee detected");
        lcd.setCursor(0, 1);
        lcd.print("in safe zone");
        Serial.println("employee detected in safe zone");
        delay(1000);
        moveForward();

        //if automobile manually stopped
        stop = digitalRead(stop_pin);
        if(stop == 1) {
          stopCar();
        }
      }

      //if forward obstacles in caution zone
      if (safetyDistance >= 30 && safetyDistance < 50) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("employee detected");
        lcd.setCursor(0, 1);
        lcd.print("in caution zone");
        Serial.println("employee detected in caution zone");
        delay(1000);
        moveForward();

        //if automobile manually stopped
        stop = digitalRead(stop_pin);
        if(stop == 1) {
          stopCar();
        }
      }

      //if forward obstacles in alarm zone
      if (safetyDistance >= 10 && safetyDistance < 30) {
        digitalWrite(BUZZER_PIN, HIGH);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("employee detected");
        lcd.setCursor(0, 1);
        lcd.print("in alarm zone");
        Serial.println("employee detected in alarm zone");
        delay(1000);
        moveForward();

        //if automobile manually stopped
        stop = digitalRead(stop_pin);
        if(stop == 1) {
          stopCar();
        }
      }

      //if forward obstacles in danger zone
      if (safetyDistance < distance_threshold) {
        stopCar();
        digitalWrite(BUZZER_PIN, HIGH);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("employee detected");
        lcd.setCursor(0, 1);
        lcd.print("in danger zone");
        Serial.println("employee detected in danger zone");
        delay(1000);
        sendSmss();
      }

      //get the exact employee location
      getCoordinates(safetyDistance > distance_threshold);
      locationLatitude = lat;
      locationLongitude = lon;
    } //end of employee ID  detection

    else if (ID == automobile_UID) {
      Serial.println();
      Serial.print("Automobile ID:");
      Serial.print(automobile_UID);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Automobile ID:"); 
      lcd.setCursor(0,1);
      lcd.print(automobile_UID);
      delay(2000);

      Serial.println();
      Serial.println("Automobile Detected");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Automobile"); 
      lcd.setCursor(0,1);
      lcd.print("Detected");
      delay(2000);

      Serial.println();
      Serial.println("Checking Automobile Safety Distance");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Checking Automobile"); 
      lcd.setCursor(0,1);
      lcd.print("Safety Distance");
      delay(1000);
      
      //check obstacle distance before moving
      safetyDistance = safetyDistancee();
      delay(1000);

      //if forward obstacles in safe zone
      if (safetyDistance >= 50) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("automobile detected");
        lcd.setCursor(0, 1);
        lcd.print("in safe zone");
        Serial.println("automobile detected in safe zone");
        delay(1000);
        moveForward();

        //if automobile manually stopped
        stop = digitalRead(stop_pin);
        if(stop == 1) {
          stopCar();
        }
      }

      //if forward obstacles in caution zone
      if (safetyDistance >= 30 && safetyDistance < 50) {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("automobile detected");
        lcd.setCursor(0, 1);
        lcd.print("in caution zone");
        Serial.println("automobile detected in caution zone");
        moveForward();

        //if automobile manually stopped
        stop = digitalRead(stop_pin);
        if(stop == 1) {
          stopCar();
        }
      }

      //if forward obstacles in alarm zone
      if (safetyDistance >= 10 && safetyDistance < 30) {
        digitalWrite(BUZZER_PIN, HIGH);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("automobile detected");
        lcd.setCursor(0, 1);
        lcd.print("in alarm zone");
        Serial.println("automobile detected in alarm zone");
        delay(1000);
        moveForward();

        //if automobile manually stopped
        stop = digitalRead(stop_pin);
        if(stop == 1) {
          stopCar();
        }
      }

      //if forward obstacles closeby, stop the automobile and notify
      if (safetyDistance < distance_threshold) {
        stopCar();
        digitalWrite(BUZZER_PIN, HIGH);
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print("forward obstacle detected");
        lcd.setCursor(0, 1);
        lcd.print("automobile stopped");
        Serial.println("Forward obstacle detected, automobile stopped");
        delay(1000);
        sendSmss();
      }

      //if automobile manually stopped
      stop = digitalRead(stop_pin);
      if(stop == 1) {
        stopCar();
      }

      //get the exact automobile location
      getCoordinates(safetyDistance > distance_threshold);
      locationLatitude = lat;
      locationLongitude = lon;

      //if automobile manually stopped
      stop = digitalRead(stop_pin);
      if(stop == 1) {
        stopCar();
      }

      //if automobile manually stopped
      stop = digitalRead(stop_pin);
      if(stop == 1) {
        stopCar();
      }
    } //end of automobile ID detection

    else {
      digitalWrite(BUZZER_PIN, HIGH);
      Serial.println();
      Serial.print("Detected ID:");
      Serial.print(ID);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Detected ID:"); 
      lcd.setCursor(0,1);
      lcd.print(ID);
      delay(2000);

      Serial.println();
      Serial.println("Unauthorized ID Detected");
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Unauthorized"); 
      lcd.setCursor(0,1);
      lcd.print("ID Detected");
      delay(2000);
      sendSms();
    } 
    httpRequest(ID, safetyDistance, locationLatitude, locationLongitude);
  delay(3000);
  }
}//end of void main


   
  

 




