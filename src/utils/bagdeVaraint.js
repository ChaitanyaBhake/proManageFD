const today = new Date();

export const getBadgeVariant = (task) => {
  const dueDate = new Date(task.dueDate);

  if (task.status === 'done') {
    return 'success';
  }

  if (today.toDateString() === dueDate.toDateString()) {
    return 'neutral'; // Grey color for today's due date
  }

  if (task.isExpired) {
    return 'error'; // Red color for past due date
  }

  return 'neutral'; // Grey color for future due date
};
