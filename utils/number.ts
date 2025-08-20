export const inputNumber = (event: any) => {
  return event.charCode >= 48 && event.charCode <= 57;
}

export const roundNumberByDecimalDig = (n: number, dig: number = 1) => {
  return Math.round(n * Math.pow(10, dig)) / Math.pow(10, dig);
};