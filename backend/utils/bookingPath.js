function pushStatus(booking, status, byName, byRole, note) {
  if (!Array.isArray(booking.timeline)) booking.timeline = [];
  const last = booking.timeline[booking.timeline.length - 1];
  const detail = String(note || '').trim();
  if (last && last.status === status && !detail) return;
  booking.timeline.push({
    status,
    at: new Date(),
    byName: byName || 'Desk',
    byRole: byRole || 'desk',
    note: detail,
  });
}

module.exports = { pushStatus };
