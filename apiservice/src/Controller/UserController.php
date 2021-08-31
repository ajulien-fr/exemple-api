<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends AbstractController
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    /**
    * @param Request $request
    * @param EntityManagerInterface $entityManager
    * @return JsonResponse
    * @Route("/api/users", name="get_users", methods={"GET"})
    */
    public function getUsers(Request $request, EntityManagerInterface $entityManager)
    {
        $users = $entityManager->getRepository(User::class)->findAll();

        $data = array('users' => array());

        foreach ($users as $user)
        {
            $user_data = array();
            $user_data['user'] = array('id' => $user->getId(), 'username' => $user->getUsername());
            $data['users'][] = $user_data;
        }

        return $this->response($data, Response::HTTP_OK);
    }

    /**
    * @param Request $request
    * @param EntityManagerInterface $entityManager
    * @return JsonResponse
    * @throws \Exception
    * @Route("/api/register", name="add_user", methods={"POST"})
    */
    public function addUser(Request $request, EntityManagerInterface $entityManager)
    {
        try
        {
            $request = $this->transformJsonBody($request);

            if ((!$request) || (!$request->get('username')) || (!$request->get('password')))
            {
                throw new \Exception();
            }

            $user = new User();
            $user->setUsername($request->get('username'));
            $user->setPassword($this->passwordHasher->hashPassword($user, $request->get('password')));

            $entityManager->persist($user);
            $entityManager->flush();

            $data = array();

            return $this->response($data, Response::HTTP_CREATED);
        }

        catch (\Exception $e)
        {
            $data = array('message' => 'invalid user data');

            return $this->response($data, Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @param EntityManagerInterface $entityManager
     * @param $id
     * @return JsonResponse
     * @Route("/api/users/{id}", name="delete_user", methods={"DELETE"})
     */
    public function deleteUser(EntityManagerInterface $entityManager, $id)
    {
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

        if (!$user)
        {
            $data = array('message' => 'invalid user id');

            return $this->response($data, Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($user);
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

