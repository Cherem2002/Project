#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <debug.cpp>
#include <SAA_pins.h>

byte custom_char_index = 0;

#define FORI(X) for (int i = 0; i < X; i++)

void LCD_write_symbol(LiquidCrystal_I2C lcd,byte symbol[8], byte pos[2]){
    lcd.createChar((custom_char_index)%8,symbol);
    lcd.setCursor(pos[1],pos[0]);
    lcd.write(custom_char_index%8);
    (custom_char_index)++;
}

void (*alphabet[256])(LiquidCrystal_I2C lcd, char chr, byte pos[2]);

void write_native(LiquidCrystal_I2C lcd, char chr, byte pos[2]){
    lcd.setCursor(pos[1],pos[0]);
    lcd.write(chr);
}
void execute_write(LiquidCrystal_I2C lcd, char chr, byte pos[2]);

void LCD_print_cyrl(LiquidCrystal_I2C lcd, String str, byte pos[2]){

    FORI(str.length()){

         //[](LiquidCrystal_I2C lcd, char chr,byte pos[2]){ byte chr_bytes[8] =  { 0b11111, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b11110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,'A',pos);
        //(*alphabet['A'])(lcd,'A',pos);
        if (byte(str.charAt(i))==208)
            continue;
        //lcd.print(String(byte(str.charAt(i))));
        //delay(700);
        
        execute_write(lcd,char(str.charAt(i)),pos);
        if(++pos[1]>15)
        {
            pos[1] = 0;
            if(++pos[0] > 1) return;
        }
        //delay(1000);
    }
}

void execute_write(LiquidCrystal_I2C lcd, char chr, byte pos[2]){
    switch ((byte)chr)
    {
case byte('А'): write_native(lcd,'A',pos);break;
case byte('Б'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  { 0b11111, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b11110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('В'): write_native(lcd,'B',pos);break;
case byte('Г'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b11111, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Д'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00110, 0b01010, 0b01010, 0b01010, 0b01010, 0b01010, 0b11111, 0b10001 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Е'): write_native(lcd,'E',pos);break;
case byte('Ж'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10101, 0b10101, 0b10101, 0b01110, 0b10101, 0b10101, 0b10101, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('З'): write_native(lcd,'3',pos);break;
case byte('И'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10001, 0b10001, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Й'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10101, 0b10001, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('К'): write_native(lcd,'K',pos);break;
case byte('Л'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00111, 0b01001, 0b01001, 0b01001, 0b01001, 0b01001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('М'): write_native(lcd,'M',pos);break;
case byte('Н'): write_native(lcd,'H',pos);break;
case byte('О'): write_native(lcd,'O',pos);break;
case byte('П'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b11111, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Р'): write_native(lcd,'P',pos);break;
case byte('С'): write_native(lcd,'C',pos);break;
case byte('Т'): write_native(lcd,'T',pos);break;
case byte('У'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10001, 0b10001, 0b10001, 0b01111, 0b00001, 0b10001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ф'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00100, 0b01110, 0b10101, 0b10101, 0b10101, 0b01110, 0b00100, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Х'): write_native(lcd,'X',pos);break;
case byte('Ц'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10010, 0b10010, 0b10010, 0b10010, 0b10010, 0b10010, 0b11111, 0b00001 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ч'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10001, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b00001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ш'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b11111, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Щ'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b11111, 0b00001 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ъ'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b11000, 0b01000, 0b01000, 0b01110, 0b01001, 0b01001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ы'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10001, 0b10001, 0b10001, 0b11101, 0b10011, 0b10011, 0b11101, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ь'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b10000, 0b10000, 0b10000, 0b11110, 0b10001, 0b10001, 0b11110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Э'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b01110, 0b10001, 0b00001, 0b00111, 0b00001, 0b10001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Ю'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  { B10001, B10001, B10001, B11001, B10101, B10101, B11101, B00000 }; ;LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('Я'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b01111, 0b10001, 0b10001, 0b01111, 0b00101, 0b01001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('а'): write_native(lcd,'a',pos);break;
case byte('б'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00011, 0b01100, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('в'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b11110, 0b10001, 0b11110, 0b10001, 0b11110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('г'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b11110, 0b10000, 0b10000, 0b10000, 0b10000, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('д'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b00110, 0b01010, 0b01010, 0b01010, 0b11111, 0b10001 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('е'): write_native(lcd,'e',pos);break;
case byte('ж'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10101, 0b10101, 0b01110, 0b10101, 0b10101, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('з'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b01110, 0b10001, 0b00110, 0b10001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('и'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('й'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b01010, 0b00100, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('к'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('л'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b00111, 0b01001, 0b01001, 0b01001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('м'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('н'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('о'): write_native(lcd,'o',pos);break;
case byte('п'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b11111, 0b10001, 0b10001, 0b10001, 0b10001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('р'): write_native(lcd,'p',pos);break;
case byte('с'): write_native(lcd,'c',pos);break;
case byte('т'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('у'): write_native(lcd,'y',pos);break;
case byte('ф'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b00100, 0b01110, 0b10101, 0b01110, 0b00100, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('х'): write_native(lcd,'x',pos);break;
case byte('ц'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10010, 0b10010, 0b10010, 0b10010, 0b11111, 0b00001 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('ч'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10001, 0b10001, 0b01111, 0b00001, 0b00001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('ш'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10101, 0b10101, 0b10101, 0b10101, 0b11111, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('щ'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10101, 0b10101, 0b10101, 0b10101, 0b11111, 0b00001 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('ъ'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b11000, 0b01000, 0b01110, 0b01001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('ы'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10001, 0b10001, 0b11101, 0b10011, 0b11101, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('ь'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10000, 0b10000, 0b11110, 0b10001, 0b11110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('э'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b01110, 0b10001, 0b00111, 0b10001, 0b01110, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('ю'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b10010, 0b10101, 0b11101, 0b10101, 0b10010, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;
case byte('я'): [](LiquidCrystal_I2C lcd, char chr,byte pos[2]){byte chr_bytes[8] =  {0b00000, 0b00000, 0b01111, 0b10001, 0b01111, 0b00101, 0b01001, 0b00000 };LCD_write_symbol(lcd,chr_bytes,pos);}(lcd,chr,pos);break;

    default:
    write_native(lcd,chr,pos);
        break;
    }
}
