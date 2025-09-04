const { crisisKeywords } = require('../../shared/constants');

function safetyGuard(req, res, next) {
  const text = req.body.text?.toLowerCase() || '';
  const hit = crisisKeywords.find((k) => text.includes(k.toLowerCase()));
  if (hit) {
    return res.status(200).json({
      crisis: true,
      message: 'I\'m really sorry you\'re feeling this way. You are not alone and help is available. If you\'re in India, you can reach AASRA 24x7 Helpline: +91-9820466726. For other countries, please visit https://www.befrienders.org and find a helpline in your region. If you feel you might act on these thoughts, please contact emergency services immediately.'
    });
  }
  next();
}

module.exports = safetyGuard;