const checkFunction = (val: any) => {
  return Object.prototype.toString.call(val) === "[object Function]";
};

export { checkFunction };
