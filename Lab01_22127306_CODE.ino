// C++ code
//
bool mode1 = true;
int whiteLed = 3;
int redLed = 4;
int greenLed = 5;
int mode1Led = 2;
int button = 8;
bool press = false;
int lastState = LOW;
unsigned long lastMillis = 0;
unsigned long startMode2 = 0;
int currentLed = 0;
int ledMode2[] = {3,4,5};

void setup(){
  pinMode(mode1Led, OUTPUT);
  pinMode(whiteLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);
  pinMode(button, INPUT);
}

void loop(){
  int buttonState = digitalRead(button);
  if (buttonState != lastState){
    if (buttonState == HIGH){
    	lastMillis = millis();
      	press = true;
    }
    lastState = buttonState;
  }
  if (buttonState == LOW && press == true){
    press = false;
    if (mode1 == true){
      if (millis() - lastMillis >= 4000){
        digitalWrite(mode1Led, LOW);
        mode1 = false;
        startMode2 = millis();
      }
    }
    else{
      if (millis() - lastMillis < 4000){
        	mode1 = true;
        digitalWrite(ledMode2[currentLed], LOW);
        currentLed = 0;
      }
    }
  }
  if (mode1 == true){
    digitalWrite(mode1Led, HIGH);
  }
  else{
    digitalWrite(ledMode2[currentLed], HIGH);
    if (millis() - startMode2 >= 1000){
      digitalWrite(ledMode2[currentLed], LOW);
      currentLed = (currentLed + 1) % 3; 
      startMode2 = millis();
    }
  }
}