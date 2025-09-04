const { crisisKeywords } = require('../../shared/constants');
const CrisisEvent = require('../models/CrisisEvent');
const { sendEmailAlert, sendSmsAlert } = require('../utils/alert');
const User = require('../models/User');

async function safetyGuard(req, res, next) {
  const text = req.body.text?.toLowerCase() || '';
  const hit = crisisKeywords.find((k) => text.includes(k.toLowerCase()));
  if (hit) {
    const userId = req.user?.id;
    let alertEmailSent = false;
    let alertSmsSent = false;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        const subject = `🚨 Neurocare Crisis Alert for ${user.name}`;
        const emailBody = `${user.name} may be in crisis based on their recent message: "${req.body.text}". Please reach out and ensure their safety.`;
        alertEmailSent = await sendEmailAlert(user.parentEmail, subject, emailBody);
        if (user.parentPhone) {
          alertSmsSent = await sendSmsAlert(user.parentPhone, `${user.name} might need help. Please check Neurocare dashboard.`);
        }
      }
    }
    await CrisisEvent.create({ userId: userId || null, message: req.body.text, alertEmailSent, alertSmsSent });
    return res.status(200).json({
      crisis: true,
      message: 'I\'m really sorry you\'re feeling this way. You are not alone and help is available. If you\'re in India, you can reach AASRA 24x7 Helpline: +91-9820466726. For other countries, please visit https://www.befrienders.org and find a helpline in your region. If you feel you might act on these thoughts, please contact emergency services immediately.'
    });
  }
  next();
}

module.exports = safetyGuard;