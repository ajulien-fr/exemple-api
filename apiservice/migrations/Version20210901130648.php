<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210901130648 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE action (id INT AUTO_INCREMENT NOT NULL, compte_id INT NOT NULL, animal_id INT DEFAULT NULL, intervenant_id INT DEFAULT NULL, type VARCHAR(255) NOT NULL, date DATE NOT NULL, montant DOUBLE PRECISION NOT NULL, remarque LONGTEXT DEFAULT NULL, INDEX IDX_47CC8C92F2C56620 (compte_id), INDEX IDX_47CC8C928E962C16 (animal_id), INDEX IDX_47CC8C92AB9A1716 (intervenant_id), FULLTEXT INDEX IDX_47CC8C928CDE5729B9741AAB (type, remarque), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE animal (id INT AUTO_INCREMENT NOT NULL, famille VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, remarque LONGTEXT DEFAULT NULL, FULLTEXT INDEX IDX_6AAB231F2473F2136C6E55B56DE44026B9741AAB (famille, nom, description, remarque), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE compte (id INT AUTO_INCREMENT NOT NULL, date DATE NOT NULL, montant_depart DOUBLE PRECISION NOT NULL, montant_actuel DOUBLE PRECISION NOT NULL, remarque LONGTEXT DEFAULT NULL, FULLTEXT INDEX IDX_CFF65260B9741AAB (remarque), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE intervenant (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, code_postal VARCHAR(255) NOT NULL, ville VARCHAR(255) NOT NULL, phone VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, remarque LONGTEXT DEFAULT NULL, FULLTEXT INDEX IDX_73D0145C6C6E55B5C35F0816CC94AC3743C3D9C3B9741AAB (nom, adresse, code_postal, ville, remarque), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92F2C56620 FOREIGN KEY (compte_id) REFERENCES compte (id)');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C928E962C16 FOREIGN KEY (animal_id) REFERENCES animal (id)');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92AB9A1716 FOREIGN KEY (intervenant_id) REFERENCES intervenant (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP FOREIGN KEY FK_47CC8C928E962C16');
        $this->addSql('ALTER TABLE action DROP FOREIGN KEY FK_47CC8C92F2C56620');
        $this->addSql('ALTER TABLE action DROP FOREIGN KEY FK_47CC8C92AB9A1716');
        $this->addSql('DROP TABLE action');
        $this->addSql('DROP TABLE animal');
        $this->addSql('DROP TABLE compte');
        $this->addSql('DROP TABLE intervenant');
        $this->addSql('DROP TABLE user');
    }
}
