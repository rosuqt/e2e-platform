const RemoveDoubleClick = () => {
  document.addEventListener("mousedown", (e) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  });
};

export default RemoveDoubleClick;
