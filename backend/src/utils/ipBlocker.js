const blockedIps = new Map();

function isIpBlocked(ip) {
  const unblockTime = blockedIps.get(ip);
  if (!unblockTime) return false;

  if (Date.now() > unblockTime) {
    blockedIps.delete(ip);
    return false;
  }
  return true;
}

function blockIp(ip, minutes = 20) {
  blockedIps.set(ip, Date.now() + minutes * 60 * 1000);
}

module.exports = {
  isIpBlocked,
  blockIp,
};
