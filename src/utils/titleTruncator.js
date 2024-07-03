
//Function to shrink the size of title , if title has more than 6 words 
export const truncateTitle = (title) => {
  const words = title.split(' ');
  if (words.length <= 6) return title;
  return words.slice(0, 6).join(' ') + '...';
};

