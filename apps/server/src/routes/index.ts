import { Request, Response, Router } from 'express';

// controllers
import signInController from '../controllers/user-controller/signInController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';
import syncFilesController from '../controllers/files/syncFilesController';
import githubCodePushController from '../controllers/github-deploy-controller/githubCodePushController';
import getChatController from '../controllers/chat-controller/getChatController';
import githubRepoNameValidatorController from '../controllers/github-deploy-controller/githubRepoNameValidatorController';
import syncTemplate from '../controllers/template-controller/syncTemplates';
import githubProjectZipController from '../controllers/github-deploy-controller/githubProjectZipController';
import getUserContracts from '../controllers/contract-controller/getUserContracts';
import getAllContracts from '../controllers/contract-controller/getAllContracts';
import getAllTemplates from '../controllers/template-controller/getAllTemplates';
import plan_executor_controller from '../controllers/chat-controller/plan_executor_controller';
import generate_contract_controller from '../controllers/gen/generate_contract_controller';

// middlewares
import authMiddleware from '../middlewares/middleware.auth';
import subscriptionMiddleware from '../middlewares/middleware.subscription';
import githubMiddleware from '../middlewares/middleware.github';
import public_review_controller from '../controllers/review-controller/public_review_controller';
import createContractReview from '../controllers/review-controller/create_contract_review';

const router: Router = Router();

// sign-in
router.post('/sign-in', signInController);

// health
router.get('/health', async (_req: Request, res: Response) => {
    await new Promise((t) => setTimeout(t, 5000));
    res.status(200).json({ message: 'Server is running' });
});

// contract generation and chat fetch
router.post('/generate', authMiddleware, generate_contract_controller);
router.post('/contract/get-chat', authMiddleware, getChatController);
router.post('/plan', authMiddleware, plan_executor_controller);

// github controllers
router.post('/github/export-code', authMiddleware, githubMiddleware, githubCodePushController);
router.post('/github/get-zip-file', authMiddleware, githubMiddleware, githubProjectZipController);
router.post(
    '/github/validate-repo-name',
    authMiddleware,
    githubMiddleware,
    githubRepoNameValidatorController,
);

// subscription controllers
router.post('/subscription/create-order', authMiddleware, createOrderController);
router.get('/subscription/get-plan', authMiddleware, getUserPlanController);
router.post(
    '/subscription/update',
    authMiddleware,
    subscriptionMiddleware,
    updateSubscriptionController,
);

// review controllers
router.post('/contract-review', authMiddleware, createContractReview);
router.post('/public-review', authMiddleware, public_review_controller);

// template controllers
router.post('/templates/sync-templates', syncTemplate);
router.get('/template/get-templates', getAllTemplates);

// marketplace controllers
router.get('/contracts/get-user-contracts', authMiddleware, getUserContracts);
router.get('/contracts/get-all-contracts', authMiddleware, getAllContracts);

// file-routes [this was made for syncing files updating in web IDE to the pod]
router.get('/files/:contractId', authMiddleware, getFilesController);
router.get('/files/sync', authMiddleware, syncFilesController); // use this or write a ws layer to share directly to kubernetes

export default router;
