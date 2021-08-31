<?php

namespace App\Repository;

use App\Entity\Intervenant;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @method Intervenant|null find($id, $lockMode = null, $lockVersion = null)
 * @method Intervenant|null findOneBy(array $criteria, array $orderBy = null)
 * @method Intervenant[]    findAll()
 * @method Intervenant[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IntervenantRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Intervenant::class);
    }

    public function getIntervenants($offset, $limit)
    {
        $query = $this->createQueryBuilder('i')
                      ->orderBy('i.id', 'DESC')
                      ->setFirstResult($offset)
                      ->setMaxResults($limit)
                      ->getQuery();

        return new Paginator($query);
    }
}

