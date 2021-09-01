# exemple-api

vidéo de démo : https://github.com/ajulien-fr/exemple-api/raw/main/demo.mkv

Ce projet à été créé dans le but d'apprendre ou d'approfondir mes connaissances en PHP Symfony pour le coté REST API du projet, le serveur. \
Et en ReactJS pour le coté client / frontend du projet.

L'OS utilisé ici est GNU/Linux et la distrib une Debian.

```sh
git clone https://github.com/ajulien-fr/exemple-api.git
```

Warning : \
Les mots de passe **'insecure'** sont à modifier,
on les trouve dans les fichiers suivants :
* **exemple-api/apiservice/src/DataFixtures/UserFixtures.php**
* **exemple-api/apiservice/.env**
* **exemple-api/db.sql**

Vous pouvez aussi modifier le nom de l'utilisateur "admin" dans le fichier \
**exemple-api/apiservice/src/DataFixtures/UserFixtures.php**

## Installation en mode développement

### apiservice

Installation et configuration de **mysql-server** :

```sh
sudo apt install default-mysql-server && \
sudo mysql_secure_installation
```

Dans le dossier **exemple-api**, je crée l'utilisateur de la base de données :

```sh
sudo mysql -u root < ./db.sql
```

Installation de **php** sur une distrib utilisant apt comme package manager :

```sh
sudo apt install php-fpm php-curl php-xml php-mbstring php-intl php-mysql
```

Téléchargement et installation de **composer** :

```php
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
php composer-setup.php && \
php -r "unlink('composer-setup.php');" && \
sudo mv composer.phar /usr/local/bin/composer
```

Téléchargement et installation de **symfony** :

```sh
wget https://get.symfony.com/cli/installer -O - | bash && \
sudo mv ~/.symfony/bin/symfony /usr/local/bin/symfony
```

Installation des dépendances PHP du projet,
Dans le dossier **apiservice**, j'exécute :

```sh
composer install
```

Création de la base de données, toujours dans le dossier **apiservice**, jexécute :

```sh
php bin/console doctrine:database:create && \
php bin/console make:migration && \
php bin/console doctrine:migrations:migrate
```

Chargement des données de démo :

```sh
php bin/console doctrine:fixtures:load
```

Génération des clés SSL pour l'authentification :

```sh
php bin/console lexik:jwt:generate-keypair
```

Démarrage du serveur symfony :

```sh
symfony server:start
```

### apiclient

Installation des dépendances sur une distrib utilisant apt comme package manager :

```sh
sudo apt install npm
```

Installation des dépendances JS du projet, dans le dossier **apiclient** :

```sh
npm install
```

Démarrage de nodejs, toujours dans le dossier **apiclient** :

```sh
npm start
```
