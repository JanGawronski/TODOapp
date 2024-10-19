# todobackend
Do projektu użyłem Typescript, Express.js, TypeORM, bazy MariaDB, REST API, class-validator oraz Swaggera.

## How to install

Zakładam, że Node.js oraz serwer bazy danych MySQL już jest zainstalowany.

Domyślne parametry bazy danych to: 
- nazwa: todo,
- użytkownik: admin,
- hasło: admin.

Można je zmienić w pliku database.ts.

W pliku setup.sql są komendy do przygotowania tabel bazy danych, a w pliku exampledata.sql komendy, że wypełnić bazę przykładowymi danymi.

Żeby zainstalować wystarczy w folderze projektu uruchomić komendę:

`npm install`

Żeby potem uruchomić trzeba wpisać:

`npx ts-node index.ts`

