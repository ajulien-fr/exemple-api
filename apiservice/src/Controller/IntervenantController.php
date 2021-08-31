<?php

namespace App\Controller;

use App\Entity\Intervenant;
use App\Repository\IntervenantRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class IntervenantController extends AbstractController
{
    /**
    * @param Request $request
    * @param IntervenantRepository $intervenantRepository
    * @return JsonResponse
    * @Route("/api/intervenants", name="get_intervenants", methods={"GET"})
    */
    public function getIntervenants(Request $request, IntervenantRepository $intervenantRepository)
    {
        $offset = max(0, $request->query->getInt('offset', 0));
        $limit = max(1, $request->query->getInt('limit', 10));

        $intervenants = $intervenantRepository->getIntervenants($offset, $limit);

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
    * @param IntervenantRepository $intervenantRepository
    * @return JsonResponse
    * @throws \Exception
    * @Route("/api/intervenants", name="add_intervenant", methods={"POST"})
    */
    public function addIntervenant(Request $request, EntityManagerInterface $entityManager,
        IntervenantRepository $intervenantRepository)
    {
        try
        {
            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('nom')) || (!$request->get('adresse')) ||
                (!$request->get('code_postal')) || (!$request->get('ville')))
            {
                throw new \Exception();
            }

            $intervenant = new Intervenant();
            $intervenant->setNom($request->get('nom'));
            $intervenant->setAdresse($request->get('adresse'));
            $intervenant->setCodePostal($request->get('code_postal'));
            $intervenant->setVille($request->get('ville'));
            $intervenant->setPhone($request->get('phone'));
            $intervenant->setEmail($request->get('email'));
            $intervenant->setRemarque($request->get('remarque'));

            $entityManager->persist($intervenant);
            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_CREATED);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid intervenant data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
    * @param IntervenantRepository $intervenantRepository
    * @param $id
    * @return JsonResponse
    * @Route("/api/intervenants/{id}", name="get_intervenant", methods={"GET"})
    */
    public function getIntervenant(IntervenantRepository $intervenantRepository, $id)
    {
        $intervenant = $intervenantRepository->findOneBy(['id' => $id]);

        if (!$intervenant)
        {
            $data = array('message' => 'invalid intervenant id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $data['intervenant'] = array(
            'id'            => $intervenant->getId(),
            'nom'           => $intervenant->getNom(),
            'adresse'       => $intervenant->getAdresse(),
            'code_postal'   => $intervenant->getCodePostal(),
            'ville'         => $intervenant->getVille(),
            'phone'         => (!$intervenant->getPhone()) ? '' : $intervenant->getPhone(),
            'email'         => (!$intervenant->getEmail()) ? '' : $intervenant->getEmail(),
            'remarque'      => (!$intervenant->getRemarque()) ? '' : $intervenant->getRemarque()
        );

        return $this->response($data, Response::HTTP_OK);
    }

    /**
    * @param Request $request
    * @param EntityManagerInterface $entityManager
    * @param IntervenantRepository $intervenantRepository
    * @param $id
    * @return JsonResponse
    * @throws \Exception
    * @Route("/api/intervenants/{id}", name="update_intervenant", methods={"PUT"})
    */
    public function updateIntervenant(Request $request, EntityManagerInterface $entityManager,
        IntervenantRepository $intervenantRepository, $id)
    {
        try
        {
            $intervenant = $intervenantRepository->findOneBy(['id' => $id]);

            if (!$intervenant)
            {
                $data = array('message' => 'invalid intervenant id');

                return $this->response($data, Response::HTTP_NOT_FOUND);
            }

            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('nom')) || (!$request->get('adresse')) ||
                (!$request->get('code_postal')) || (!$request->get('ville')))
            {
                throw new \Exception();
            }

            $intervenant->setNom($request->get('nom'));
            $intervenant->setAdresse($request->get('adresse'));
            $intervenant->setCodePostal($request->get('code_postal'));
            $intervenant->setVille($request->get('ville'));
            $intervenant->setPhone($request->get('phone'));
            $intervenant->setEmail($request->get('email'));
            $intervenant->setRemarque($request->get('remarque'));

            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_OK);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid intervenant data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
    * @param EntityManagerInterface $entityManager
    * @param IntervenantRepository $intervenantRepository
    * @param $id
    * @return JsonResponse
    * @Route("/api/intervenants/{id}", name="delete_intervenant", methods={"DELETE"})
    */
    public function deleteIntervenant(EntityManagerInterface $entityManager,
        IntervenantRepository $intervenantRepository, $id)
    {
        $intervenant = $intervenantRepository->findOneBy(['id' => $id]);

        if (!$intervenant)
        {
            $data = array('message' => 'invalid intervenant id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($intervenant);
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

        if ($data === null) return null;

        $request->request->replace($data);

        return $request;
    }
}

