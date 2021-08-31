<?php

namespace App\Repository;

use App\Entity\Action;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @method Action|null find($id, $lockMode = null, $lockVersion = null)
 * @method Action|null findOneBy(array $criteria, array $orderBy = null)
 * @method Action[]    findAll()
 * @method Action[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ActionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Action::class);
    }

    public function getActions($offset, $limit, $idcompte, $idanimal, $idintervenant)
    {
        $query = $this->createQueryBuilder('a');

        $query->orderBy('a.date', 'DESC');
        $query->setFirstResult($offset);
        $query->setMaxResults($limit);

        if ($idcompte != 0) $query->andWhere('a.compte = :id')->setParameter('id', $idcompte);

        if ($idanimal != 0) $query->andWhere('a.animal = :id')->setParameter('id', $idanimal);
        
        if ($idintervenant != 0)
        {
            $query->andWhere('a.intervenant = :id')->setParameter('id', $idintervenant);
        }
        
        $query->getQuery();

        return new Paginator($query);
    }

    public function getAllActions()
    {
        $query = $this->createQueryBuilder('a')
                      ->orderBy('a.date', 'DESC')
                      ->getQuery();

        return new Paginator($query);
    }

    public function getNbrType(string $type)
    {
        $nbr = $this->createQueryBuilder('a')
                    ->where('a.type = :type')->setParameter('type', $type)
                    ->select('COUNT(a.id)')
                    ->getQuery()
                    ->getSingleScalarResult();

        return $nbr;
    }

    public function getMontantType(string $type)
    {
        $montant = $this->createQueryBuilder('a')
                        ->where('a.type = :type')->setParameter('type', $type)
                        ->select('SUM(a.montant)')
                        ->getQuery()
                        ->getSingleScalarResult();

        return $montant;
    }
}

