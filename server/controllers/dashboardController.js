const Issue = require('../models/Issue');
const Agency = require('../models/Agency');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolved = await Issue.countDocuments({ status: 'Resolved' });
    const pending = totalIssues - resolved;

    const issueAgg = await Issue.aggregate([
      { $match: { status: 'Resolved' } },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 86400000] } }
        }
      }
    ]);

    const avgResponseTime = issueAgg.length > 0 ? issueAgg[0].avgResponseTime : 0;

    res.json({
      totalIssues,
      resolved,
      pending,
      avgResponseTime
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};