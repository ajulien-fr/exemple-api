<?php

namespace App\Controller;

use App\Entity\Action;
use App\Repository\ActionRepository;
use App\Entity\Compte;
use App\Entity\Animal;
use App\Entity\Intervenant;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class ActionController extends AbstractController
{
    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ActionRepository $actionRepository
     * @return JsonResponse
     * @Route("/api/actions", name="get_actions", methods={"GET"})
     */
    public function getActions(Request $request, EntityManagerInterface $entityManager,
        ActionRepository $actionRepository)
    {
        $offset = max(0, $request->query->getInt('offset', 0));
        $limit = max(1, $request->query->getInt('limit', 10));

        $idcompte = $request->query->getInt('idcompte', 0);
        $idanimal = $request->query->getInt('idanimal', 0);
        $idintervenant = $request->query->getInt('idintervenant', 0);

        $actions = $actionRepository->getActions($offset, $limit, $idcompte,
            $idanimal, $idintervenant);

        $data = array('actions' => array());

        foreach ($actions as $action)
        {
            $action_data = array();

            $action_data['action'] = array(
                'id'       => $action->getId(),
                'type'     => $action->getType(),
                'date'     => date_format($action->getDate(), 'Y-m-d'),
                'montant'  => $action->getMontant(),
                'remarque' => (!$action->getRemarque()) ? '' : $action->getRemarque()
            );

            $compte = $entityManager->getRepository(Compte::class)->findOneBy(
                ['id' => $action->getCompte()]);

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
                    'id'          => $animal->getId(),
                    'famille'     => $animal->getFamille(),
                    'nom'         => $animal->getNom(),
                    'description' => $animal->getDescription(),
                    'remarque'    => (!$animal->getRemarque()) ? '' : $animal->getRemarque(),
                );
            }

            if ($action->getIntervenant() != null)
            {
                $intervenant = $entityManager->getRepository(Intervenant::class)->findOneBy(
                    ['id' => $action->getIntervenant()]);

                $action_data['intervenant'] = array(
                    'id'          => $intervenant->getId(),
                    'nom'         => $intervenant->getNom(),
                    'adresse'     => $intervenant->getAdresse(),
                    'code_postal' => $intervenant->getCodePostal(),
                    'ville'       => $intervenant->getVille(),
                    'phone'       => (!$intervenant->getPhone()) ? '' : $intervenant->getPhone(),
                    'email'       => (!$intervenant->getEmail()) ? '' : $intervenant->getEmail(),
                    'remarque'    => (!$intervenant->getRemarque()) ? '' : 
                    $intervenant->getRemarque()
                );
            }

            $data['actions'][] = $action_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ActionRepository $actionRepository
     * @return JsonResponse
     * @throws \Exception
     * @Route("/api/actions", name="add_action", methods={"POST"})
     */
    public function addAction(Request $request, EntityManagerInterface $entityManager,
        ActionRepository $actionRepository)
    {
        try
        {
            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('type')) || (!$request->get('date')) ||
                (!$request->get('montant')) || (!$request->get('idcompte')))
            {
                throw new \Exception();
            }

            $compte = $entityManager->getRepository(Compte::class)->findOneBy(
                ['id' => $request->get('idcompte')]);

            if ($request->get('idanimal') != '')
            {
                $animal = $entityManager->getRepository(Animal::class)->findOneBy(
                    ['id' => $request->get('idanimal')]);
            }

            else $animal = null;

            if ($request->get('idintervenant') != '')
            {
                $intervenant = $entityManager->getRepository(Intervenant::class)->findOneBy(
                    ['id' => $request->get('idintervenant')]);
            }

            else $intervenant = null;

            $action = new Action();
            $action->setType($request->get('type'));
            $action->setDate(new \DateTime($request->get('date')));
            $action->setMontant($request->get('montant'));
            $action->setRemarque($request->get('remarque'));
            $action->setCompte($compte);

            if ($animal != null) $action->setAnimal($animal);

            if ($intervenant != null) $action->setIntervenant($intervenant);

            $entityManager->persist($action);
            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_CREATED);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid action data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @param EntityManagerInterface $entityManager
     * @param ActionRepository $actionRepository
     * @param $id
     * @return JsonResponse
     * @Route("/api/actions/{id}", name="get_action", methods={"GET"})
     */
    public function getAction(EntityManagerInterface $entityManager,
        ActionRepository $actionRepository, $id)
    {
        $action = $actionRepository->findOneBy(['id' => $id]);

        if (!$action)
        {
            $data = array('message' => 'invalid action id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $data['action'] = array(
            'id'        => $action->getId(),
            'type'      => $action->getType(),
            'date'      => date_format($action->getDate(), 'Y-m-d'),
            'montant'   => $action->getMontant(),
            'remarque'  => (!$action->getRemarque()) ? '' : $action->getRemarque()
        );

        $compte = $entityManager->getRepository(Compte::class)->findOneBy(
            ['id' => $action->getIdCompte()]);

        $data['compte'] = array(
            'id'            => $compte->getId(),
            'date'          => date_format($compte->getDate(), 'Y-m-d'),
            'montantDepart' => $compte->getMontantDepart(),
            'montantActuel' => $compte->getMontantAcuel(),
            'remarque'      => (!$compte->getRemarque()) ? '' : $compte->getRemarque()
        );

        if ($action->getIdAnimal() != null)
        {
            $animal = $entityManager->getRepository(Animal::class)->findOneBy(
                ['id' => $action->getIdAnimal()]);

            $data['animal'] = array(
                'id'            => $animal->getId(),
                'famille'       => $animal->getFamille(),
                'nom'           => $animal->getNom(),
                'description'   => $animal->getDescription(),
                'remarque'      => (!$animal->getRemarque()) ? '' : $animal->getRemarque()
            );
        }

        if ($action->getIdIntervenant() != null)
        {
            $intervenant = $entityManager->getRepository(Intervenant::class)->findOneBy(
                ['id' => $action->getIdIntervenant()]);

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
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ActionRepository $actionRepository
     * @param $id
     * @return JsonResponse
     * @throws \Exception
     * @Route("/api/actions/{id}", name="update_action", methods={"PUT"})
     */
    public function updateAction(Request $request, EntityManagerInterface $entityManager,
        ActionRepository $actionRepository, $id)
    {
        try
        {
            $action = $actionRepository->findOneBy(['id' => $id]);

            if (!$action)
            {
                $data = array('message' => 'invalid action id');

                return $this->response($data, Response::HTTP_NOT_FOUND);
            }

            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('type')) || (!$request->get('date')) ||
                (!$request->get('montant')))
            {
                throw new \Exception();
            }

            $compte = $entityManager->getRepository(Compte::class)->findOneBy(
                ['id' => $request->get('idcompte')]);

            if ($request->get('idanimal') != '')
            {
                $animal = $entityManager->getRepository(Animal::class)->findOneBy(
                    ['id' => $request->get('idanimal')]);
            }

            else $animal = null;

            if ($request->get('idintervenant') != '')
            {
                $intervenant = $entityManager->getRepository(Intervenant::class)->findOneBy(
                    ['id' => $request->get('idintervenant')]);
            }

            else $intervenant = null;

            $action->setType($request->get('type'));
            $action->setDate(new \DateTime($request->get('date')));
            $action->setMontant($request->get('montant'));
            $action->setRemarque($request->get('remarque'));
            $action->setCompte($compte);

            if ($animal != null) $action->setAnimal($animal);

            if ($intervenant != null) $action->setIntervenant($intervenant);

            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_OK);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid action data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @param EntityManagerInterface $entityManager
     * @param ActionRepository $actionRepository
     * @param $id
     * @return JsonResponse
     * @Route("/api/actions/{id}", name="delete_action", methods={"DELETE"})
     */
    public function deleteAction(EntityManagerInterface $entityManager, ActionRepository
        $actionRepository, $id)
    {
        $action = $actionRepository->findOneBy(['id' => $id]);

        if (!$action)
        {
            $data = array('message' => 'invalid action id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($action);
        $entityManager->flush();

        $data = array();

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param ActionRepository $actionRepository
     * @return JsonResponse
     * @Route("/api/activities", name="get_activities", methods={"GET"})
     */
    public function getActivities(ActionRepository $actionRepository)
    {
        $actions = $actionRepository->getAllActions();

        $data = array();

        foreach ($actions as $action)
        {
            $found = false;
            $type = $action->getType();

            foreach($data as $key => $value)
            {
                if ($value['type'] == $type)
                {
                    $found = true;

                    break;
                }
            }

            if ($found == false)
            {
                $nbr = $actionRepository->getNbrType($type);
                $montant = $actionRepository->getMontantType($type);

                array_push($data, array('type' => $type, 'nbr' => $nbr, 'montant' => $montant));
            }
        }

        return $this->response($data, Response::HTTP_OK);
    }

    private function response($data, $status)
    {
        return new JsonResponse($data, $status, array('Access-Control-Allow-Origin' => '*'));
    }

    private function transformJsonBody(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        if ($data === null) return $request;

        $request->request->replace($data);

        return $request;
    }
}

