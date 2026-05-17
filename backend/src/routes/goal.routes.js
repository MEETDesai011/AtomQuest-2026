const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goal.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { ROLES } = require('../constants');

// All goal routes require employee role
router.use(requireAuth);
router.use(requireRole(ROLES.EMPLOYEE));

/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Employee goal management
 */

/**
 * @swagger
 * /goals/mine:
 *   get:
 *     summary: Retrieve employee's goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cycleId
 *         schema:
 *           type: string
 *         description: Cycle ID to filter goals
 *     responses:
 *       200:
 *         description: A list of goals
 */
router.get('/mine', goalController.getMyGoals);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new draft goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post('/', goalController.createGoal);

router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

/**
 * @swagger
 * /goals/submit:
 *   post:
 *     summary: Submit all draft goals for manager approval
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Goals submitted
 */
router.post('/submit', goalController.submitAllGoals);

module.exports = router;
