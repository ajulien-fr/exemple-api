<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\User;
use App\Entity\Action;
use App\Entity\Compte;
use App\Entity\Animal;
use App\Entity\Intervenant;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $compte2020 = new Compte();
        $compte2020->setDate(\DateTime::createFromFormat('d/m/Y', '04/01/2020'));
        $compte2020->setMontantDepart(2500);
        $compte2020->setMontantActuel(1000);
        $compte2020->setRemarque("année 2020 ; vide ; montant de fin d'année 1000");
        $manager->persist($compte2020);
        $manager->flush();

        $compte2021 = new Compte();
        $compte2021->setDate(\DateTime::createFromFormat('d/m/Y', '02/01/2021'));
        $compte2021->setMontantDepart(1000);
        $compte2021->setMontantActuel(1000);
        $compte2021->setRemarque('année 2021');
        $manager->persist($compte2021);
        $manager->flush();

        $animal01 = new Animal();
        $animal01->setFamille('chat');
        $animal01->setNom('bouboule');
        $animal01->setDescription('noir et blanc');
        $manager->persist($animal01);
        $manager->flush();

        $action = new Action();
        $action->setType('capture');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '14/01/2021'));
        $action->setMontant(0);
        $action->setRemarque("trappé sur fécamp, placé en famille d'accueil chez bla bla");
        $action->setCompte($compte2021);
        $action->setAnimal($animal01);
        $manager->persist($action);
        $manager->flush();

        $intervenant01 = new Intervenant();
        $intervenant01->setNom('vétérinaire terra nova');
        $intervenant01->setAdresse('13 route de valmont');
        $intervenant01->setCodePostal('76400');
        $intervenant01->setVille('fécamp');
        $manager->persist($intervenant01);
        $manager->flush();

        $action = new Action();
        $action->setType('stérilisation');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '16/01/2021'));
        $action->setMontant(-150);
        $action->setCompte($compte2021);
        $action->setAnimal($animal01);
        $action->setIntervenant($intervenant01);
        $manager->persist($action);
        $manager->flush();

        $intervenant02 = new Intervenant();
        $intervenant02->setNom('ajulien');
        $intervenant02->setAdresse('42 bla bla bla');
        $intervenant02->setCodePostal('76400');
        $intervenant02->setVille('fécamp');
        $intervenant02->setPhone('0102030405');
        $intervenant02->setEmail('hello@ajulien.fr');
        $manager->persist($intervenant02);
        $manager->flush();

        $action = new Action();
        $action->setType('adoption');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '01/02/2021'));
        $action->setMontant(150);
        $action->setCompte($compte2021);
        $action->setAnimal($animal01);
        $action->setIntervenant($intervenant02);
        $manager->persist($action);
        $manager->flush();

        $animal02 = new Animal();
        $animal02->setFamille('chat');
        $animal02->setNom('mirabelle');
        $animal02->setDescription('brown tabby');
        $manager->persist($animal02);
        $manager->flush();

        $action = new Action();
        $action->setType('abandon');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '11/03/2021'));
        $action->setMontant(0);
        $action->setCompte($compte2021);
        $action->setAnimal($animal02);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('stérilisation');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '14/03/2021'));
        $action->setMontant(-150);
        $action->setCompte($compte2021);
        $action->setAnimal($animal02);
        $action->setIntervenant($intervenant01);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('adoption');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '20/03/2021'));
        $action->setMontant(100);
        $action->setCompte($compte2021);
        $action->setAnimal($animal02);
        $action->setIntervenant($intervenant02);
        $manager->persist($action);
        $manager->flush();

        $animal03 = new Animal();
        $animal03->setFamille('chien');
        $animal03->setNom('hector');
        $animal03->setDescription('westy blanc');
        $manager->persist($animal03);
        $manager->flush();

        $action = new Action();
        $action->setType('soins');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '10/04/2021'));
        $action->setMontant(-220);
        $action->setCompte($compte2021);
        $action->setAnimal($animal03);
        $action->setIntervenant($intervenant01);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('adoption');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '15/04/2021'));
        $action->setMontant(150);
        $action->setCompte($compte2021);
        $action->setAnimal($animal03);
        $action->setIntervenant($intervenant02);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('stérilisation');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '03/05/2021'));
        $action->setMontant(3 * -150);
        $action->setRemarque('3 chats trappés sur fécamp par bla bla');
        $action->setCompte($compte2021);
        $action->setIntervenant($intervenant01);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('hystérectomie');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '05/05/2021'));
        $action->setMontant(-180);
        $action->setRemarque('minette pleine trappée sur fécamp par bla bla');
        $action->setCompte($compte2021);
        $action->setIntervenant($intervenant01);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('stérilisation');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '15/06/2021'));
        $action->setMontant(-150);
        $action->setRemarque('1 chat trappé sur fécamp par bla bla');
        $action->setCompte($compte2021);
        $action->setIntervenant($intervenant01);
        $manager->persist($action);
        $manager->flush();

        $intervenant03 = new Intervenant();
        $intervenant03->setNom('mairie fécamp');
        $intervenant03->setAdresse('1 Place du Général Leclerc');
        $intervenant03->setCodePostal('76400');
        $intervenant03->setVille('fécamp');
        $intervenant03->setPhone('02 35 10 60 00');
        $manager->persist($intervenant03);
        $manager->flush();

        $action = new Action();
        $action->setType('subvention');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '20/06/2021'));
        $action->setMontant(1000);
        $action->setCompte($compte2021);
        $action->setIntervenant($intervenant03);
        $manager->persist($action);
        $manager->flush();

        $action = new Action();
        $action->setType('donation');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '02/07/2021'));
        $action->setMontant(100);
        $action->setCompte($compte2021);
        $action->setIntervenant($intervenant02);
        $manager->persist($action);
        $manager->flush();

        $intervenant04 = new Intervenant();
        $intervenant04->setNom('mairie yport');
        $intervenant04->setAdresse('rue ernest lethuillier');
        $intervenant04->setCodePostal('76111');
        $intervenant04->setVille('yport');
        $intervenant04->setPhone('02 35 27 30 24');
        $intervenant04->setEmail('mairie.yport@gmail.com');
        $manager->persist($intervenant04);
        $manager->flush();

        $action = new Action();
        $action->setType('subvention');
        $action->setDate(\DateTime::createFromFormat('d/m/Y', '03/08/2021'));
        $action->setMontant(500);
        $action->setCompte($compte2021);
        $action->setIntervenant($intervenant04);
        $manager->persist($action);
        $manager->flush();
    }
}

