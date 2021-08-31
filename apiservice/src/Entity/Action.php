<?php

namespace App\Entity;

use App\Repository\ActionRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Event\PreUpdateEventArgs;

/**
 * @ORM\Entity(repositoryClass=ActionRepository::class)
 * @ORM\Table(name="action", indexes={@ORM\Index(columns={"type", "remarque"}, flags={"fulltext"})})
 * @ORM\HasLifecycleCallbacks()
 */
class Action
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $type;

    /**
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\Column(type="float")
     */
    private $montant;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $remarque;

    /**
     * @ORM\ManyToOne(targetEntity=Compte::class, inversedBy="actions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $compte;

    /**
     * @ORM\ManyToOne(targetEntity=Animal::class, inversedBy="actions")
     */
    private $animal;

    /**
     * @ORM\ManyToOne(targetEntity=Intervenant::class, inversedBy="actions")
     */
    private $intervenant;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant(float $montant): self
    {
        $this->montant = $montant;

        return $this;
    }

    public function getRemarque(): ?string
    {
        return $this->remarque;
    }

    public function setRemarque(?string $remarque): self
    {
        $this->remarque = $remarque;

        return $this;
    }

    public function getCompte(): ?Compte
    {
        return $this->compte;
    }

    public function setCompte(?Compte $compte): self
    {
        $this->compte = $compte;

        return $this;
    }

    public function getAnimal(): ?Animal
    {
        return $this->animal;
    }

    public function setAnimal(?Animal $animal): self
    {
        $this->animal = $animal;

        return $this;
    }

    public function getIntervenant(): ?Intervenant
    {
        return $this->intervenant;
    }

    public function setIntervenant(?Intervenant $intervenant): self
    {
        $this->intervenant = $intervenant;

        return $this;
    }

    /**
     * @ORM\PrePersist()
     */
    public function prePersist(): void
    {
        $montantActuel = $this->compte->getMontantActuel() + $this->montant;

        $this->compte->setMontantActuel($montantActuel);
    }

    /**
     * @ORM\PreRemove()
     */
    public function preRemove(): void
    {
        if ($this->montant < 0) $montantActuel = $this->compte->getMontantActuel() + $this->montant;

        else $montantActuel = $this->compte->getMontantActuel() - $this->montant;

        $this->compte->setMontantActuel($montantActuel);
    }
}

