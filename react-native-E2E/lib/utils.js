export const downloadFile = (name, data) => {
  const element = document.createElement('a');
  const file = new Blob([data], {
    type: 'application/car',
  });
  element.href = URL.createObjectURL(file);
  element.download = `test.car`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};
