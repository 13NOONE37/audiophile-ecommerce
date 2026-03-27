export const blockBodyScroll = () => {
  const scrollY = window.scrollY;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
  document.body.style.overflowY = 'scroll';
};
export const enableBodyScroll = () => {
  const top = document.body.style.top;
  const scrollY = top ? Math.abs(parseInt(top)) : 0;

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflowY = '';

  window.scrollTo(0, scrollY);
};
