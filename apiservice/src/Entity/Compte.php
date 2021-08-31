<?php

namespace App\Entity;

use App\Repository\CompteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
* @ORM\Entity(repositoryClass=CompteRepository::class)
* @ORM\Table(name="compte", indexes={@ORM\Index(columns={"remarque"}, flags={"fulltext"})})
*/
class Compte
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     */
    private $date;

    /**
     * @ORM\Column(type="float")
     */
    private $montantDepart;

    /**
     * @ORM\Column(type="float")
     */
    private $montantActuel;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $remarque;

    /**
     * @ORM\OneToMany(targetEntity=Action::class, mappedBy="compte")
     */
    private $actions;

    public function __construct()
    {
        $this->actions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getMontantDepart(): ?float
    {
        return $this->montantDepart;
    }

    public function setMontantDepart(float $montantDepart): self
    {
        $this->montantDepart = $montantDepart;

        return $this;
    }

    public function getMontantActuel(): ?float
    {
        return $this->montantActuel;
    }

    public function setMontantActuel(float $montantActuel): self
    {
        $this->montantActuel = $montantActuel;

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

    /**
     * @return Collection|Action[]
     */
    public function getActions(): Collection
    {
        return $this->actions;
    }

    public function addAction(Action $action): self
    {
        if (!$this->actions->contains($action)) {
            $this->actions[] = $action;
            $action->setCompte($this);
        }

        return $this;
    }

    public function removeAction(Action $action): self
    {
        if ($this->actions->removeElement($action)) {
            // set the owning side to null (unless already changed)
            if ($action->getCompte() === $this) {
                $action->setCompte(null);
            }
        }

        return $this;
    }
}

