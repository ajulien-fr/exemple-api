<?php

namespace App\Controller;

use App\Entity\Compte;
use App\Repository\CompteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class CompteController extends AbstractController
{
    /**
    * @param Request $request
    * @param CompteRepository $compteRepository
    * @return JsonResponse
    * @Route("/api/comptes", name="get_comptes", methods={"GET"})
    */
    public function getComptes(Request $request, CompteRepository $compteRepository)
    {
        $offset = max(0, $request->query->getInt('offset', 0));
        $limit = max(1, $request->query->getInt('limit', 10));

        $comptes = $compteRepository->getComptes($offset, $limit);

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
    * @param CompteRepository $compteRepository
    * @return JsonResponse
    * @throws \Exception
    * @Route("/api/comptes", name="add_compte", methods={"POST"})
    */
    public function addCompte(Request $request, EntityManagerInterface $entityManager,
        CompteRepository $compteRepository)
    {
        try
        {
            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('date')) || (!$request->get('montantDepart')))
            {
                throw new \Exception();
            }

            $compte = new Compte();
            $compte->setDate(new \DateTime($request->get('date')));
            $compte->setMontantDepart($request->get('montantDepart'));
            $compte->setMontantActuel($request->get('montantDepart'));
            $compte->setRemarque($request->get('remarque'));

            $entityManager->persist($compte);
            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_CREATED);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid compte data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
    * @param CompteRepository $compteRepository
    * @param $id
    * @return JsonResponse
    * @Route("/api/comptes/{id}", name="get_compte", methods={"GET"})
    */
    public function getCompte(CompteRepository $compteRepository, $id)
    {
        $compte = $compteRepository->findOneBy(['id' => $id]);

        if (!$compte)
        {
            $data = array('message' => 'invalid compte id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $data['compte'] = array(
            'id'            => $compte->getId(),
            'date'          => date_format($compte->getDate(), 'Y-m-d'),
            'montantDepart' => $compte->getMontantDepart(),
            'montantActuel' => $compte->getMontantActuel(),
            'remarque'      => (!$compte->getRemarque()) ? '' : $compte->getRemarque()
        );

        return $this->response($data, Response::HTTP_OK);
    }

    /**
    * @param Request $request
    * @param EntityManagerInterface $entityManager
    * @param CompteRepository $compteRepository
    * @param $id
    * @return JsonResponse
    * @throws \Exception
    * @Route("/api/comptes/{id}", name="update_compte", methods={"PUT"})
    */
    public function updateCompte(Request $request, EntityManagerInterface $entityManager,
        CompteRepository $compteRepository, $id)
    {
        try
        {
            $compte = $compteRepository->findOneBy(['id' => $id]);

            if (!$compte)
            {
                $data = array('message' => 'invalid compte id');

                return $this->response($data, Response::HTTP_NOT_FOUND);
            }

            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('date')) ||
                (!$request->get('montantDepart')) || (!$request->get('montantActuel')))
            {
                throw new \Exception();
            }

            $compte->setDate(new \DateTime($request->get('date')));
            $compte->setMontantDepart($request->get('montantDepart'));
            $compte->setMontantActuel($request->get('montantActuel'));
            $compte->setRemarque($request->get('remarque'));

            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_OK);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid compte data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
    * @param EntityManagerInterface $entityManager
    * @param CompteRepository $compteRepository
    * @param $id
    * @return JsonResponse
    * @Route("/api/comptes/{id}", name="delete_compte", methods={"DELETE"})
    */
    public function deleteCompte(EntityManagerInterface $entityManager, CompteRepository $compteRepository, $id)
    {
        $compte = $compteRepository->findOneBy(['id' => $id]);

        if (!$compte)
        {
            $data = array('message' => 'invalid compte id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($compte);
        $entityManager->flush();

        $data = array();

        return $this->response($data, Response::HTTP_OK);
    }

    private function response($data, $status)
    {
        return new JsonResponse($data, $status);
    }

    private function transformJsonBody(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) return $request;

        $request->request->replace($data);

        return $request;
    }
}

