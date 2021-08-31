<?php

namespace App\EventListener;

use App\Entity\Action;
use App\Entity\Compte;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class ActionChangedNotifier
{
    private $montantActuel = 0;

    public function preUpdate(PreUpdateEventArgs $event): void
    {
        $entity = $event->getObject();
        $montant = 0;

        if ($entity instanceof Action)
        {
            if ($event->hasChangedField('montant'))
            {
                $em = $event->getObjectManager();

                $compte = $em->getRepository(Compte::class)->findOneBy(
                    ['id' => $entity->getCompte()]);

                $oldMontant = $event->getOldValue('montant');
                $newMontant = $event->getNewValue('montant');
                $montantActuel = $compte->getMontantActuel();

                if ($oldMontant < 0) $montant = $montantActuel + $oldMontant;

                else $montant = $montantActuel - $oldMontant;

                $this->montantActuel = $montant + $newMontant;
            }
        }
    }

    public function postUpdate(LifecycleEventArgs $event): void
    {
        $entity = $event->getObject();

        if ($entity instanceof Action)
        {
            $em = $event->getObjectManager();

            $compte = $em->getRepository(Compte::class)->findOneBy(
                ['id' => $entity->getCompte()]);

            if ($this->montantActuel !== 0) $compte->setMontantActuel($this->montantActuel);

            $em->flush();
        }
    }
}
