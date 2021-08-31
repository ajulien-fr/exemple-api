<?php

namespace App\Controller;

use App\Entity\Animal;
use App\Repository\AnimalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class AnimalController extends AbstractController
{
    /**
     * @param Request $request
     * @param AnimalRepository $animalRepository
     * @return JsonResponse
     * @Route("/api/animaux", name="get_animaux", methods={"GET"})
     */
    public function getAnimaux(Request $request, AnimalRepository $animalRepository)
    {
        $offset = max(0, $request->query->getInt('offset', 0));
        $limit = max(1, $request->query->getInt('limit', 10));

        $animaux = $animalRepository->getAnimaux($offset, $limit);

        $data = array('animaux' => array());

        foreach ($animaux as $animal)
        {
            $animal_data = array();

            $animal_data['animal'] = array(
                'id'            => $animal->getId(),
                'famille'       => $animal->getFamille(),
                'nom'           => $animal->getNom(),
                'description'   => $animal->getDescription(),
                'remarque'      => (!$animal->getRemarque()) ? '' : $animal->getRemarque()
            );

            $data['animaux'][] = $animal_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param AnimalRepository $animalRepository
     * @return JsonResponse
     * @throws \Exception
     * @Route("/api/animaux", name="add_animal", methods={"POST"})
     */
    public function addAnimal(Request $request, EntityManagerInterface $entityManager,
        AnimalRepository $animalRepository)
    {
        try
        {
            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('famille')) ||
                (!$request->get('nom')) || (!$request->get('description')))
            {
                throw new \Exception();
            }

            $animal = new Animal();
            $animal->setFamille($request->get('famille'));
            $animal->setNom($request->request->get('nom'));
            $animal->setDescription($request->request->get('description'));
            $animal->setRemarque($request->request->get('remarque'));

            $entityManager->persist($animal);
            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_CREATED);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid animal data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @param AnimalRepository $animalRepository
     * @param $id
     * @return JsonResponse
     * @Route("/api/animaux/{id}", name="get_animal", methods={"GET"})
     */
    public function getAnimal(AnimalRepository $animalRepository, $id)
    {
        $animal = $animalRepository->findOneBy(['id' => $id]);

        if (!$animal)
        {
            $data = array('message' => 'invalid animal id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $data['animal'] = array(
            'id'            => $animal->getId(),
            'famille'       => $animal->getFamille(),
            'nom'           => $animal->getNom(),
            'description'   => $animal->getDescription(),
            'remarque'      => (!$animal->getRemarque()) ? '' : $animal->getRemarque()
        );

        return $this->response($data, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param AnimalRepository $animalRepository
     * @param $id
     * @return JsonResponse
     * @throws \Exception
     * @Route("/api/animaux/{id}", name="update_animal", methods={"PUT"})
     */
    public function updateAnimal(Request $request, EntityManagerInterface $entityManager,
        AnimalRepository $animalRepository, $id)
    {
        try
        {
            $animal = $animalRepository->findOneBy(['id' => $id]);

            if (!$animal)
            {
                $data = array('message' => 'invalid animal id');

                return $this->response($data, Response::HTTP_NOT_FOUND);
            }

            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('famille')) ||
                (!$request->get('nom')) || (!$request->get('description')))
            {
                throw new \Exception();
            }

            $animal->setFamille($request->get('famille'));
            $animal->setNom($request->get('nom'));
            $animal->setDescription($request->get('description'));
            $animal->setRemarque($request->get('remarque'));

            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_OK);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid animal data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @param EntityManagerInterface $entityManager
     * @param AnimalRepository $animalRepository
     * @param $id
     * @return JsonResponse
     * @Route("/api/animaux/{id}", name="delete_animal", methods={"DELETE"})
     */
    public function deleteAnimal(EntityManagerInterface $entityManager,
        AnimalRepository $animalRepository, $id)
    {
        $animal = $animalRepository->findOneBy(['id' => $id]);

        if (!$animal)
        {
            $data = array('message' => 'invalid animal id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($animal);
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

