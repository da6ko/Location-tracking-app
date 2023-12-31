
# Web приложение за следене на локацията на ученици чрез геозащита

Целта е да разработи уеб приложение, което комбинира геозащитата и следенето на локацията на учениците, за да се подобри тяхната безопасност и надзор, както и да се улесни комуникацията между училището и родителите. За да може това да бъде изпълнено, са създадени 2 приложения:

•	Мобилно приложение, което ще проследява локацията на потребителя и ще я записва в база данни. (map_server)

•	Онлайн уебсайт, който ще позволява на потребителя да види всички ученици, намиращи се в определена геозащитена зона през своя компютър или телефон, създаден с помощта на Monaca. (mobile_application)

Заявките се обработват от два сървъра, които трябва да са хоствани публично: 

map_server -> server.js - за обработка на картата

mobile_server -> server.js - за обработка на потребители на мобилното приложение

## Начин на ползване

Преди да бъде използвано в приложението трябва да се въведе:

- Координати на геозащитената зона
- URL на MongoDB база данни
- URL на сървърите
- Mapbox GL access token



## Tech Stack

**Приложения:** MapboxGL, Monaca, Framework7

**Сървъри:** Node, Express, MongoDB

