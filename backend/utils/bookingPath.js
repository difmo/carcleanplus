function pushStatus(booking, status, byName, byRole) {
  if (!Array.isArray(booking.timeline)) booking.timeline = [];
  const last = booking.timeline[booking.timeline.length - 1];
  if (last && last.status === status) return;
  booking.timeline.push({
    status,
    at: new Date(),
    byName: byName || 'Desk',
    byRole: byRole || 'desk',
  });
}

module.exports = { pushStatus };
