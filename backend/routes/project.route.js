import {Router} from 'express';
import {body} from 'express-validator';
import * as projectController from '../controllers/project.controller.js';
import * as messageController from '../controllers/message.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create',
    body('name').notEmpty().withMessage('Project name is required'),authMiddleware.authUser,
    projectController.projectCreateController
);

router.get('/', authMiddleware.authUser, projectController.projectListController);

router.get('/:id', authMiddleware.authUser, projectController.projectGetController);

router.put('/:id',
    body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
    authMiddleware.authUser,
    projectController.projectUpdateController
);

router.delete('/:id', authMiddleware.authUser, projectController.projectDeleteController);

router.post('/:id/add-user',
    body('email').isEmail().withMessage('Valid email is required'),
    authMiddleware.authUser,
    projectController.projectAddUserController
);

router.post('/:id/remove-user',
    body('email').isEmail().withMessage('Valid email is required'),
    authMiddleware.authUser,
    projectController.projectRemoveUserController
);

// Messages for a project (also can be consumed by sockets)
router.get('/:id/messages', authMiddleware.authUser, messageController.getProjectMessagesController);

router.post('/:id/messages',
  body('content').notEmpty().withMessage('Message content is required'),
  authMiddleware.authUser,
  messageController.createMessageController
);

router.get("/all",
    authMiddleware.authUser,
    projectController.getAllProjectController
)


export default router;