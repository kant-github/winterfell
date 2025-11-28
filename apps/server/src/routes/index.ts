import { Request, Response, Router } from 'express';
import signInController from '../controllers/user-controller/signInController';
import startChatController from '../controllers/chat-controller/startChatController';
import getFilesController from '../controllers/chat-controller/getFilesController';
import authMiddleware from '../middlewares/middleware.auth';
import createOrderController from '../controllers/payment-controller/createOrderController';
import updateSubscriptionController from '../controllers/payment-controller/updateSubscriptionController';
import subscriptionMiddleware from '../middlewares/middleware.subscription';
import getUserPlanController from '../controllers/payment-controller/getUserPlanController';
import syncFilesController from '../controllers/files/syncFilesController';
import githubCodePushController from '../controllers/github-deploy-controller/githubCodePushController';
import continueChatController from '../controllers/chat-controller/continueChatController';
import getChatController from '../controllers/chat-controller/getChatController';
import { createContractReview } from '../controllers/review/create_contract_review';
import generateContractController from '../controllers/gen/generateContractController';
import githubRepoNameValidatorController from '../controllers/github-deploy-controller/githubRepoNameValidatorController';
import syncTemplate from '../controllers/template-controller/syncTemplates';
import githubMiddleware from '../middlewares/middleware.github';
import githubProjectZipController from '../controllers/github-deploy-controller/githubProjectZipController';

const router: Router = Router();

// user-routes
router.post('/sign-in', signInController);
router.get('/health', async (_req: Request, res: Response) => {
    await new Promise((t) => setTimeout(t, 5000));
    res.status(200).json({ message: 'Server is running' });
});

// code-routes
router.post('/generate', authMiddleware, generateContractController);
router.post('/new', authMiddleware, startChatController);
router.post('/continue', authMiddleware, continueChatController);
router.post('/contract/get-chat', authMiddleware, getChatController);

// github-routes
router.post('/github/export-code', authMiddleware, githubMiddleware, githubCodePushController);
router.post(
    '/github/validate-repo-name',
    authMiddleware,
    githubMiddleware,
    githubRepoNameValidatorController,
);
router.post('/github/get-zip-file', authMiddleware, githubMiddleware, githubProjectZipController);

// file-routes
router.get('/files/:contractId', authMiddleware, getFilesController);
// use this or write a ws layer to share directly to kubernetes
router.get('/files/sync', authMiddleware, syncFilesController);

// payment-routes
router.post('/subscription/create-order', authMiddleware, createOrderController);
router.post(
    '/subscription/update',
    authMiddleware,
    subscriptionMiddleware,
    updateSubscriptionController,
);
router.get('/subscription/get-plan', authMiddleware, getUserPlanController);

// reviews
router.post('/review', authMiddleware, createContractReview);

// templates
router.post('/sync-templates', syncTemplate);

// sign-in
// health
// contract
// github
// subscription
// review
// command

export default router;
