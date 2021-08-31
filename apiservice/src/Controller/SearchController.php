<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\Tools\Pagination\Paginator;

use App\Entity\Intervenant;
use App\Entity\Animal;
use App\Entity\Compte;
use App\Entity\Action;

class SearchController extends AbstractController
{
    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     * @Route("/api/search/intervenants", name="app_search_intervenants", methods={"GET"})
     */
    public function search_intervenants(Request $request, EntityManagerInterface $entityManager)
    {
        $filter = $request->query->get('search', '');

        if ($filter === '')
        {
            $data = array('message' => 'no data to search');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }

        $queryBuilder = $entityManager->getRepository(Intervenant::class)->createQueryBuilder('i');

        $queryBuilder->where(
            'MATCH_AGAINST(i.nom, i.adresse, i.code_postal, i.ville, i.remarque) '
            . 'AGAINST(:searchterm boolean)>0')
                     ->setParameter('searchterm', $filter);

        $query = $queryBuilder->getQuery();

        $intervenants = new Paginator($query);

        $data = array('intervenants' => array());

        foreach ($intervenants as $intervenant)
        {
            $intervenant_data = array();

            $intervenant_data['intervenant'] = array(
                'id'            => $intervenant->getId(),
                'nom'           => $intervenant->getNom(),
                'adresse'       => $intervenant->getAdresse(),
                'code_postal'   => $intervenant->getCodePostal(),
                'ville'         => $intervenant->getVille(),
                'phone'         => (!$intervenant->getPhone()) ? '' : $intervenant->getPhone(),
                'email'         => (!$intervenant->getEmail()) ? '' : $intervenant->getEmail(),
                'remarque'      => (!$intervenant->getRemarque()) ? '' : $intervenant->getRemarque()
            );

            $data['intervenants'][] = $intervenant_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     * @Route("/api/search/animaux", name="app_search_animaux", methods={"GET"})
     */
    public function search_animaux(Request $request, EntityManagerInterface $entityManager)
    {
        $filter = $request->query->get('search', '');

        if ($filter === '')
        {
            $data = array('message' => 'no data to search');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }

        $queryBuilder = $entityManager->getRepository(Animal::class)->createQueryBuilder('a');

        $queryBuilder->where(
            'MATCH_AGAINST(a.famille, a.nom, a.description, a.remarque) AGAINST(:searchterm boolean)>0')
                     ->setParameter('searchterm', $filter);

        $query = $queryBuilder->getQuery();

        $animaux = new Paginator($query);

        $data = array('animaux' => array());

        foreach ($animaux as $animal)
        {
            $animal_data = array();

            $animal_data['animal'] = array(
                'id'            => $animal->getId(),
                'famille'       => $animal->getFamille(),
                'nom'           => $animal->getNom(),
                'description'   => $animal->getDescription(),
                'remarque'      => (!$animal->getRemarque()) ? '' : $animal->getRemarque(),
            );

            $data['animaux'][] = $animal_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     * @Route("/api/search/comptes", name="app_search_comptes", methods={"GET"})
     */
    public function search_comptes(Request $request, EntityManagerInterface $entityManager)
    {
        $filter = $request->query->get('search', '');

        if ($filter === '')
        {
            $data = array('message' => 'no data to search');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }

        $queryBuilder = $entityManager->getRepository(Compte::class)->createQueryBuilder('c');

        $queryBuilder->where('MATCH_AGAINST(c.remarque) AGAINST(:searchterm boolean)>0')
                     ->setParameter('searchterm', $filter);

        $query = $queryBuilder->getQuery();

        $comptes= new Paginator($query);

        $data = array('comptes' => array());

        foreach ($comptes as $compte)
        {
            $compte_data = array();

            $compte_data['compte'] = array(
                'id'            => $compte->getId(),
                'date'          => date_format($compte->getDate(), 'Y-m-d'),
                'montantDepart' => $compte->getMontantDepart(),
                'montantActuel' => $compte->getMontantActuel(),
                'remarque'      => (!$compte->getRemarque()) ? '' : $compte->getRemarque()
            );

            $data['comptes'][] = $compte_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     * @Route("/api/search/actions", name="app_search_actions", methods={"GET"})
     */
    public function search_actions(Request $request, EntityManagerInterface $entityManager)
    {
        $filter = $request->query->get('search', '');

        if ($filter === '')
        {
            $data = array('message' => 'no data to search');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }

        $queryBuilder = $entityManager->getRepository(Action::class)->createQueryBuilder('a');

        $queryBuilder->where('MATCH_AGAINST(a.type, a.remarque) AGAINST(:searchterm boolean)>0')
                     ->setParameter('searchterm', $filter);

        $query = $queryBuilder->getQuery();

        $actions = new Paginator($query);

        $data = array('actions' => array());

        foreach ($actions as $action)
        {
            $action_data = array();

            $action_data['action'] = array(
                'id'        => $action->getId(),
                'type'      => $action->getType(),
                'date'      => date_format($action->getDate(), 'Y-m-d'),
                'montant'   => $action->getMontant(),
                'remarque'  => (!$action->getRemarque()) ? '' : $action->getRemarque()
            );

            $compte = $entityManager->getRepository(Compte::class)->findOneBy(['id' => $action->getCompte()]);

            $action_data['compte'] = array(
                'id'            => $compte->getId(),
                'date'          => date_format($compte->getDate(), 'Y-m-d'),
                'montantDepart' => $compte->getMontantDepart(),
                'montantActuel' => $compte->getMontantActuel(),
                'remarque'      => (!$compte->getRemarque()) ? '' : $compte->getRemarque()
            );

            if ($action->getAnimal() != null)
            {
                $animal = $entityManager->getRepository(Animal::class)->findOneBy(
                    ['id' => $action->getAnimal()]);

                $action_data['animal'] = array(
                    'id'            => $animal->getId(),
                    'famille'       => $animal->getFamille(),
                    'nom'           => $animal->getNom(),
                    'description'   => $animal->getDescription(),
                    'remarque'      => (!$animal->getRemarque()) ? '' : $animal->getRemarque(),
                );
            }

            if ($action->getIntervenant() != null)
            {
                $intervenant = $entityManager->getRepository(Intervenant::class)->findOneBy(
                    ['id' => $action->getIntervenant()]);

                $action_data['intervenant'] = array(
                    'id'            => $intervenant->getId(),
                    'nom'           => $intervenant->getNom(),
                    'adresse'       => $intervenant->getAdresse(),
                    'code_postal'   => $intervenant->getCodePostal(),
                    'ville'         => $intervenant->getVille(),
                    'phone'         => (!$intervenant->getPhone()) ? '' : $intervenant->getPhone(),
                    'email'         => (!$intervenant->getEmail()) ? '' : $intervenant->getEmail(),
                    'remarque'      => (!$intervenant->getRemarque()) ? '' : $intervenant->getRemarque()
                );
            }

            $data['actions'][] = $action_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    private function response($data, $status)
    {
        return new JsonResponse($data, $status);
    }
}

