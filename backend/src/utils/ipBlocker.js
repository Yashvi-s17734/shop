const blockedIps = new Map();
const blockedEmails = new Map();

function blockIp(ip, minutes) {
  blockedIps.set(ip, Date.now() + minutes * 60 * 1000);
}

function blockEmail(email, minutes) {
  blockedEmails.set(email, Date.now() + minutes * 60 * 1000);
}

function isIpBlocked(ip) {
  const unblockTime = blockedIps.get(ip);
  if (!unblockTime) return false;
  if (Date.now() > unblockTime) {
    blockedIps.delete(ip);
    return false;
  }
  return true;
}

function isEmailBlocked(email) {
  const unblockTime = blockedEmails.get(email);
  if (!unblockTime) return false;
  if (Date.now() > unblockTime) {
    blockedEmails.delete(email);
    return false;
  }
  return true;
}

module.exports = {
  blockIp,
  blockEmail,
  isIpBlocked,
  isEmailBlocked,
};
