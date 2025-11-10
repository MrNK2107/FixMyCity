const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { 
  createIssue, 
  getIssues, 
  getIssueById,
  cosignIssue,
  resolveIssue
} = require('../controllers/issueController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.route('/')
  .post(protect, upload.array('media'), createIssue)
  .get(getIssues);

router.route('/:id')
  .get(getIssueById);

router.post('/:id/cosign', protect, cosignIssue);

router.post('/:id/resolve', protect, adminOnly, upload.fields([
  { name: 'proofBefore', maxCount: 1 },
  { name: 'proofAfter', maxCount: 1 }
]), resolveIssue);

module.exports = router;