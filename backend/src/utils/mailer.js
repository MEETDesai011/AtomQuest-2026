const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set — email sending is disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporter;
}

async function sendMail(to, subject, html) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`📧 Email skipped (not configured): To=${to}, Subject=${subject}`);
    return;
  }

  try {
    await transport.sendMail({
      from: `"Goal Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
}

async function sendGoalSubmittedEmail(managerEmail, managerName, employeeName) {
  await sendMail(
    managerEmail,
    `Goals Submitted by ${employeeName}`,
    `<h3>Hi ${managerName},</h3>
     <p><strong>${employeeName}</strong> has submitted their goals for review.</p>
     <p>Please log in to the Goal Portal to review and approve them.</p>`
  );
}

async function sendApprovalEmail(employeeEmail, employeeName, approved, reason) {
  const status = approved ? 'Approved' : 'Returned for Rework';
  const reasonHtml = reason
    ? `<p><strong>Reason:</strong> ${reason}</p>`
    : '';

  await sendMail(
    employeeEmail,
    `Goal ${status}`,
    `<h3>Hi ${employeeName},</h3>
     <p>Your goal has been <strong>${status.toLowerCase()}</strong> by your manager.</p>
     ${reasonHtml}
     <p>Please log in to the Goal Portal for details.</p>`
  );
}

async function sendCheckinReminderEmail(employeeEmail, employeeName, phase) {
  await sendMail(
    employeeEmail,
    `Check-in Reminder — ${phase}`,
    `<h3>Hi ${employeeName},</h3>
     <p>The <strong>${phase}</strong> check-in window is open. Please update your achievement entries in the Goal Portal.</p>`
  );
}

async function sendEscalationEmail(toEmail, toName, reason) {
  await sendMail(
    toEmail,
    'Action Required — Goal Portal Escalation',
    `<h3>Hi ${toName},</h3>
     <p>${reason}</p>
     <p>Please take the required action in the Goal Portal immediately.</p>`
  );
}

module.exports = {
  sendGoalSubmittedEmail,
  sendApprovalEmail,
  sendCheckinReminderEmail,
  sendEscalationEmail,
};
