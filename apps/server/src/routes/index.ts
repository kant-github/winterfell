import { Request, Response, Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import authMiddleware from '../middlewares/middleware.auth';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import subscriptionMiddleware from '../middlewares/middleware.subscription';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';
import syncFilesController from '../controllers/files/syncFilesController';
import githubCodePushController from '../controllers/github-deploy-controller/githubCodePushController';
import getChatController from '../controllers/chat-controller/getChatController';
import { createContractReview } from '../controllers/review/create_contract_review';
import generateContractController from '../controllers/gen/generateContractController';
import githubRepoNameValidatorController from '../controllers/github-deploy-controller/githubRepoNameValidatorController';
import syncTemplate from '../controllers/template-controller/syncTemplates';
import githubMiddleware from '../middlewares/middleware.github';
import githubProjectZipController from '../controllers/github-deploy-controller/githubProjectZipController';
import getUserContracts from '../controllers/contract-controller/getUserContracts';
import getAllContracts from '../controllers/contract-controller/getAllContracts';
import getAllTemplates from '../controllers/template-controller/getAllTemplates';
import generate_template_controller from '../controllers/template-controller/generate_template_controller';
import plan_executor_controller from '../controllers/chat-controller/plan_executor_controller';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);
router.get('/health', async (_req: Request, res: Response) => {
    await new Promise((t) => setTimeout(t, 5000));
    res.status(200).json({ message: 'Server is running' });
});

// code-routes
router.post('/generate', authMiddleware, generateContractController);
router.post('/contract/get-chat', authMiddleware, getChatController);
router.post('/plan', authMiddleware, plan_executor_controller);

// github-routes
router.post('/github/export-code', authMiddleware, githubMiddleware, githubCodePushController);
router.post('/github/get-zip-file', authMiddleware, githubMiddleware, githubProjectZipController);
router.post(
    '/github/validate-repo-name',
    authMiddleware,
    githubMiddleware,
    githubRepoNameValidatorController,
);

// file-routes
router.get('/files/:contractId', authMiddleware, getFilesController);
router.get('/files/sync', authMiddleware, syncFilesController); // use this or write a ws layer to share directly to kubernetes

// payment-routes
router.post('/subscription/create-order', authMiddleware, createOrderController);
router.get('/subscription/get-plan', authMiddleware, getUserPlanController);
router.post(
    '/subscription/update',
    authMiddleware,
    subscriptionMiddleware,
    updateSubscriptionController,
);

// reviews
router.post('/review', authMiddleware, createContractReview);

// templates
router.post('/templates/sync-templates', syncTemplate);
router.get('/template/get-templates', getAllTemplates);
router.post('/template/generate-template', authMiddleware, generate_template_controller);

// contracts
router.get('/contracts/get-user-contracts', authMiddleware, getUserContracts);
router.get('/contracts/get-all-contracts', authMiddleware, getAllContracts);

// sign-in
// health
// contract
// github
// subscription
// review
// command

export default router;
