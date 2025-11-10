const Issue = require('../models/Issue');
const Cosign = require('../models/Cosign');

// Calculate priority score: severity + co-signs + under-service index
const calculatePriority = (issue) => {
  const severity = 
    issue.category === 'Pothole' ? 3 : 
    issue.category === 'Water Leak' ? 4 : 
    issue.category === 'Garbage' ? 2 : 1;

  const coSignCount = issue.cosigns?.length || 0;
  const underServiceIndex = issue.location.lat < 40.7 ? 2 : 0; // Example logic

  return severity + coSignCount + underServiceIndex;
};

exports.createIssue = async (req, res) => {
  const { title, description, category, location } = req.body;
  const mediaURLs = req.files?.map(f => f.path) || [];

  try {
    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      mediaURLs,
      createdBy: req.user._id
    });
    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({}).sort({ priorityScore: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('cosigns');
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.cosignIssue = async (req, res) => {
  const { comment, evidenceURL } = req.body;
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });

    const existingCosign = await Cosign.findOne({ 
      user: req.user._id, 
      issue: issue._id 
    });
    if (existingCosign) return res.status(400).json({ msg: 'Already co-signed' });

    const cosign = await Cosign.create({
      user: req.user._id,
      issue: issue._id,
      comment,
      evidenceURL
    });

    issue.priorityScore = calculatePriority(issue);
    await issue.save();
    res.status(201).json(cosign);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.resolveIssue = async (req, res) => {
  const { proofBefore, proofAfter } = req.files || {};
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Issue not found' });

    issue.status = 'Resolved';
    issue.proofBefore = proofBefore?.path;
    issue.proofAfter = proofAfter?.path;
    issue.resolvedAt = Date.now();
    issue.resolvedBy = req.user._id;

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};