# scriptable-republicamovil

## Instructions
Copy and paste the contents of file <a href="https://raw.githubusercontent.com/jchicano/scriptable-republicamovil/master/scriptable-republicamovil.js">scriptable-republicamovil.js</a> into a new Scriptable script

Inside the script you must change the `IP` and `PATH` variables to match yours

I am assuming the JSON file has the following format:
```
{
  "min_used": "0",
  "min_available": "150",
  "cel_used": "3.03",
  "cel_available": "3",
  "cel_used_format": "GB",
  "promo_used": "3.00",
  "promo_available": "20",
  "promo_used_format": "MB"
}
```
You can get the API from <a href="https://github.com/jchicano/api-republicamovil">here</a>

## Screenshots
Solarized dark             |  Solarized Ocean
:-------------------------:|:-------------------------:
![](https://raw.githubusercontent.com/jchicano/scriptable-republicamovil/master/screenshots/light.png)  |  ![](https://raw.githubusercontent.com/jchicano/scriptable-republicamovil/master/screenshots/dark.png)

## Inspired by
- https://gist.github.com/olikdesign/732535e5eec25e45b2387541f3b2c0cf
- https://github.com/Saudumm/scriptable-News-Widget

## Wanted changes
- Display percentage as a circle like:
  - https://github.com/ThisIsBenny/iOS-Widgets/tree/main/VodafoneDE
  - https://github.com/chaeimg/battCircle
